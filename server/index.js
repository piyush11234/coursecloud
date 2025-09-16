import express from 'express';
import { config } from 'dotenv';
import connectDb from './database/db.js';
import dotenv from 'dotenv'
dotenv.config();

import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute.js'
import courseRoute from './routes/courseRoute.js'
import mediaRoute from './routes/mediaRoute.js'
import path from 'path';

const app=express();


const PORT= process.env.PORT || 8000;

// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin:'https://coursecloud.onrender.com',
    credentials:true
}))

const _dirname=path.resolve();

//router
app.use('/api/v1/user',userRoute);
app.use('/api/v1/course',courseRoute);
app.use('/api/v1/media',mediaRoute);

app.use(express.static(path.join(_dirname,"client/dist")));
app.use((_, res) => {
  res.sendFile(path.resolve(_dirname, 'client', 'dist', 'index.html'));
});




app.listen(PORT,()=>{
    connectDb();
    console.log(`Server is running on port ${PORT}`);
    
})