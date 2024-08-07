import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import listingRoutes from './routes/listing.routes.js';
import path, { join } from 'path';
dotenv.config();


mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});   

const __dirname = path.resolve();

const app = express(); 
app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{
    console.log('Server listerning on port 3000');
}); 



app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/listing',listingRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'client','dist', 'index.html'));
})

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message||'Internet server error' ;
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,

    });
});