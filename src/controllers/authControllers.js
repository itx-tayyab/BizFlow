import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {ExistingUser, CreateNewUser} from '../models/authModal.js'

export const registeruser = async(req,res) => {
    const {name, email, password} = req.body;

    try {
        const existinguser = await ExistingUser(email);
        if(existinguser){
            return res.status(400).json({message: "Email Already Exist"})
        }

        const hashPassword = await bcrypt.hash(password,10);

        const NewUser = await CreateNewUser(name, email, hashPassword);

        const token = jwt.sign
        (
            {
             id: NewUser.id,
             email: NewUser.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env,ACCESS_TOKEN_SECRET_EXPIRE
            }
        )

        res.status(201).json({user: NewUser,token});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

