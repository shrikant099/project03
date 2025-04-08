import jwt from 'jsonwebtoken';
import { User } from '../modles/user.models.js';

const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Unauthorizes, No Token Provided !"
                }
            );
        };

        // console.log(`Token:- ${token}`);

        const decodedToken = jwt.verify(token, process.env.JWT_SECERET)

        const user = await User.findById(decodedToken.id);
        
        if(!user){
            return res.status(404).json(
                {
                    success: false,
                     message: "User Not Found"
                }
            );
        };

        if(user.role !== "Admin"){
            return res.status(403).json(
                {
                    success: false,
                     message: "Access Denied"
                }
            );
        };

        next();

    } catch (error) {
        console.log(`Error isAdmin Protect Middleware ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Internal Server Error"
            }
        );
    };
};

export {
    isAdmin
}