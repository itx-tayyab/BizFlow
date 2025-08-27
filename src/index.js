import dotenv from 'dotenv';
import { app } from './app';

dotenv.config({
    path: './env'
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Listing to port ${port}`)
})
