import mongoose from "mongoose";

const connectionDataBase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDb Connection Succesfull`);
        
    } catch (error) {
        console.log(`MongoDb Connection Error:- ${error}`);        
    }
};

export {
    connectionDataBase
}