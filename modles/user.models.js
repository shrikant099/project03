import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String
    },
    photo: String,
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User",
    }

}, { timestamps: true });



/** @type {import("mongoose").Model} */
const User = mongoose.model('AuthUser', userSchema);

export {
    User
}