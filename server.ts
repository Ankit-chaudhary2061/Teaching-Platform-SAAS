import app from "./src/app.ts";
import dotenv from 'dotenv'
dotenv.config()


const StartServer = () => {
    const port = process.env.PORT; // PORT number is set in .env folder 
    app.listen(port, () => {
        console.log(`Server has started at port ${port}`);
    })
};

// Start the server
StartServer();

export default StartServer; //  Export if needed elsewhere