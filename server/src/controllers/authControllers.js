import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {ExistingUser, CreateNewUser} from '../models/authModal.js';
import {app} from '../app.js';

export const registeruser = async(req,res) => {
    const {name, email, password} = req.body;

    try {
        const existinguser = await ExistingUser(email);
        if(existinguser){
            return res.status(400).json({message: "Email Already Exist"})
        }

        const hashPassword = await bcrypt.hash(password,10);

        const NewUser = await CreateNewUser(name, email, hashPassword);

        res.status(201).json({user: NewUser,token});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export const loginuser = async(req,res) => {
    const {email,password} = req.body;

    try {
        const existinguser = await ExistingUser(email);
        if(!existinguser){
            return res.status(400).json({message: "Email Not Found"})
        }

        const isFound = await bcrypt.compare(password, existinguser.password);
        if(!isFound){
            return res.status(401).json({message: "Invalid Password"})
        }

        const accesstoken = jwt.sign
        (
            {
             id: existinguser.id,
             email: existinguser.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE
            }
        )

        const refreshtoken = jwt.sign
        (
            {
             id: existinguser.id,
             email: existinguser.email,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRE
            }
        )

        res.cookie(
        "jwt", refreshToken, 
        {
        httpOnly: true,   
        secure: true,     
        }
       );

       res.json({
       message: "Login successful",
       accesstoken,
       user: 
        { 
          id: existinguser.id,
          name: existinguser.name, 
          email: existinguser.email 
        },
    });
        
    } catch (err) {
        res.status(500).json({message: "Server error"});
    }
}