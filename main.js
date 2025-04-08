import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectionDataBase } from './utils/db/db.js';
import { authRoutes } from './routes/user.route.js';
import { adminRoutes } from './routes/admin.routes.js';
import ejs from 'ejs';
import path from 'path';


dotenv.config();

const app = express();
// Set up ejs 
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:3000", "http://localhost:7000"],
    credentials: true
}));
app.use(express.static("public"));
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

// Send Main index file
app.get('/', (req, res) => {
    res.sendFile(path.join("../index.html"));
})

// Db Connection
connectionDataBase().then((req, res) => {
    app.listen(process.env.PORT || 6000, () => {
        console.log(`App is listen On PORT:- ${process.env.PORT}`);
    });
}).catch((error) => console.log(`App listening Error ${error}`));

