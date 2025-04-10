import { mongo } from "mongoose";
import { User } from "../modles/user.models.js";
import bcryptJs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer'


// genrate Otp
async function genrateOtp() {
    return crypto.randomInt(1000, 9999);
}

const registerUser = async (req, res) => {
    try {
        const { username, email , number, password } = req.body;

        if (!username || !email || !number || !password) {
            return res.status(402).json(
                {
                    success: false,
                    message: "Invalid Credentials Fields are reuired!"
                }
            );
        };

        const findUser = await User.findOne({ email: email });

        if (findUser) {
            return res.status(403).json(
                {
                    success: false,
                    message: "This email is already Registerd Please Login!"
                }
            );
        };


        const hashedPassword = await bcryptJs.hashSync(password, 10);

        const user = await User.create({
            username,
            email,
            number,
            password: hashedPassword
        });


        await user.save();

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECERET);


        return res.status(200).json(
            {
                success: true,
                message: "User register succesfully",
                RegisterUser: user,
                token
            }
        )


    } catch (error) {
        console.log(`Error Register User Internal server error ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Error Register User Internal server error"
            }
        )
    };
};


// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(402).json(
                {
                    success: false,
                    message: "Invalid Credentials Fields are reuired!"
                }
            );
        };

        const findUser = await User.findOne({ email: email });
        if (!findUser) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Account Not Found"
                }
            );
        };


        const isMatch = await bcryptJs.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        };

        const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECERET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 259200000
        })

        return res.status(200).json({
            success: true,
            message: "User Logged IN Successfully",
            user: findUser,
            token
        });

    } catch (error) {
        console.log(`Error Login user Internal server error ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Error Login user Internal server error"
            }
        );
    };
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false, // Agar HTTPS use kar rahe hain to isko true karein
            sameSite: "None" // Cross-origin requests ke liye zaroori hai
        });

        res.status(200).json(
            {
                success: true,
                message: "Logout Succesfull"
            }
        );

    } catch (error) {
        console.log(`Clear Cookie Error ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Error Logout Please try again"
            }
        );
    };
};

// Send mail to forget password;
async function sendMailForgetPass(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email is Required"
            });
        }

        // Email check karna
        const findEmail = await User.findOne({ email: email });

        if (!findEmail) {
            return res.status(401).json({
                success: false,
                message: "Email Not Found"
            });
        }

        // OTP generate karna
        const otp = await genrateOtp();
        // console.log(`Generated OTP: ${otp}`);

        // OTP ko database mein save karna
        findEmail.otp = otp;
        await findEmail.save();

        // Nodemailer se OTP bhejna
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            auth: {
                user: 'ys162393@gmail.com',  // Aapka email
                pass: 'trch joyh isfg gnmr'  // Aapka email password
            }
        });

        const mailOptions = {
            from: 'ys162393@gmail.com',
            to: email,
            subject: `🔐 Your OTP Code - Action Required`,
            text: `Your OTP is: ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 10px; overflow: hidden; box-shadow: 0 0 15px rgba(0,0,0,0.1); border: 1px solid #eaeaea;">
                    <div style="background-color: #4A90E2; padding: 20px; color: white; text-align: center;">
                        <h1 style="margin: 0;">🔐 OTP Verification</h1>
                    </div>
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; color: #333;">Hello <strong>${findEmail.username}</strong>,</p>
                        <p style="font-size: 16px; color: #333;">
                            We received a request to reset your password. Use the OTP below to proceed.
                        </p>
                        <div style="margin: 30px auto; text-align: center;">
                            <span style="font-size: 32px; letter-spacing: 8px; font-weight: bold; background: #f1f1f1; padding: 15px 30px; border-radius: 8px; display: inline-block;">
                                ${otp}
                            </span>
                        </div>
                        <p style="font-size: 14px; color: #555;">
                            This OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.
                        </p>
                        <p style="font-size: 14px; color: #777; margin-top: 40px;">
                            Regards,<br/>Your App Team
                        </p>
                    </div>
                    <div style="background: #f5f5f5; text-align: center; padding: 15px; font-size: 12px; color: #999;">
                        © ${new Date().getFullYear()} Your App. All rights reserved.
                    </div>
                </div>
                `
        };

        // OTP ko email se bhejna
      await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Send Mail Error:", error);
                return res.status(500).json({
                    success: false,
                    message: "Failed to send OTP"
                });
            }
            res.status(200).json({
                success: true,
                message: `OTP sent successfully to this email:- ${findEmail.email}`
            });
        });


    } catch (error) {
        console.log(`Error: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Verify OTP;
const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(402).json(
                {
                    success: false,
                    message: "Otp is requires to forget password"
                }
            );
        };

        const fetchOtp = await User.findOne({ otp: otp });

        if (!fetchOtp) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Otp Not found Please enter a valid otp"
                }
            );
        };

        return res.status(200).json({
            success: true,
            message: "OTP Verified Succesfull",
            userId: fetchOtp._id
        });

    } catch (error) {
        console.log(`Error verify otp:- ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error please try again"
            }
        );
    };
};

// reset password;
const resetPassword = async (req, res) => {

    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!id) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Unauthorize User!"
                }
            );
        };

        const findUser = await User.findById(id);

        if (!findUser) {
            return res.status(404).json(
                {
                    success: false,
                    message: "User Not found"
                }
            );
        };

        const hashedPassword = await bcryptJs.hash(password, 10);
        findUser.password = hashedPassword;
        await findUser.save();

        return res.status(200).json(
            {
                success: true,
                message: "Password Reset Succesfull",
                resetPasswordUser: findUser
            }
        );

    } catch (error) {
        console.log(`Internal server Error Please try again:- ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server Error Please try again"
            }
        );
    };
};


export {
    registerUser,
    login,
    logout,
    sendMailForgetPass,
    verifyOtp,
    resetPassword
}