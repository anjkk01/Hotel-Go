import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from './models/User.js';
import Place from './models/Place.js';
import BookingModel from "./models/booking.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import imageDownloader from "image-downloader";
import multer from "multer";
import fs from "fs";
import { resolve } from "path";
import { rejects } from "assert";
dotenv.config();
const app=express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'ygfyugwefyfuew78wefg8wef7';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('C:/Users/rohan/OneDrive/Desktop/Web Dev/BookingApp/api/uploads'));
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173',
}))

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromReq(req){
    return new Promise((resolve,reject)=>{
        jwt.verify(req.cookies.token, jwtSecret, {}, async(err, userData)=>{
            if(err) throw err;
            resolve(userData);
        });
    });
}

app.get('/test',(req,res) =>{
    res.json('test ok');
})
app.post('/register', async (req,res)=>{
    const{name,email,password}=req.body;

    try {
        const userDoc=await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userDoc);
    }catch(e){
        res.status(422).json(e)
    }
    
});

app.post('/login', async(req,res)=>{
    const {email,password}=req.body;
    const UserDo= await User.findOne({email})
    console.log(UserDo);
    if(UserDo){
        const passOk=bcrypt.compareSync(password,UserDo.password);
        if(passOk){
            jwt.sign({email:UserDo.email, id:UserDo._id},jwtSecret, {}, (err,token) =>{
                if(err) throw err;
                res.cookie('token',token).json(UserDo);
            })
        }
        else{
            res.status(422).json('password not ok');
        }
    }else{
        res.json('not found');
    }
});

app.get('/profile',(req,res) =>{
    const{token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async(err, userData)=>{
            if(err) throw err;
            const {name,email,_id}=await User.findById(userData.id);
            res.json({name,email,_id});
        });
    }else{
        res.json(null);
    }
});

app.post('/logout', (req,res) => {
    res.cookie('token','').json(true);
});

app.post('/upload-by-link',async(req,res) =>{
    const {link} = req.body;
    const newName= 'photo'+ Date.now()+'.jpg';
    await imageDownloader.image({
        url:link,
        dest:'C:/Users/rohan/OneDrive/Desktop/Web Dev/BookingApp/api/uploads/'+newName,
    })
    res.json(newName);

})

const photosMiddleware= multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos',100),(req,res)=>{
    const uploadedFiles=[];
    for(let i=0;i< req.files.length;i++){
        const {path,originalname} =req.files[i];
        const parts= originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath =path + '.' + ext;
        fs.renameSync(path,newPath);
        uploadedFiles.push(newPath.replace('uploads\\',''));
    }
    res.json(uploadedFiles);
})

app.post('/places',function(req,res){
    const{token} = req.cookies;
    const {title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price}=req.body;
    jwt.verify(token, jwtSecret, {}, async(err, userData)=>{
        if(err) throw err;
        const placeDoc =await Place.create({
            owner:userData.id,
            title,
            address,
            photos:addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price,
        })
        res.json(placeDoc);
    });
});

app.get('/user-places',(req,res)=>{
    const{token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async(err, userData)=>{
        const {id} =userData;
        res.json(await Place.find({owner:id}));
    });
});
app.get('/places/:id',async (req,res)=>{
    const {id}=req.params;
    res.json(await Place.findById(id));
});
app.put('/places', async (req,res)=>{
    const{token} = req.cookies;
    const {id,title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price}=req.body;
    jwt.verify(token, jwtSecret, {}, async(err, userData)=>{
        if(err) throw err;
        const placeDoc = await Place.findById(id);
        if(userData.id == placeDoc.owner.toString()){
            placeDoc.set({
                title,
                address,
                photos:addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price,
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
});
app.get('/places',async (req,res)=>{
    res.json( await Place.find() )
})

app.post('/bookings', async(req,res)=>{
    const UserData=await getUserDataFromReq(req);
    const{
        place,checkIn,checkOut,numberOfGuests,name,phone,price,
      } = req.body;
      BookingModel.create({
        place,checkIn,checkOut,numberOfGuests,name,phone,price,
        user:UserData.id,
      }).then((doc) => {
        res.json(doc);
      }).catch((err) => {
        throw err;
        
      });
})

app.get('/bookings',async (req,res)=>{
    const userData=await getUserDataFromReq(req);
    res.json(await BookingModel.find({user:userData.id}).populate('place'));
});
app.listen(4000);