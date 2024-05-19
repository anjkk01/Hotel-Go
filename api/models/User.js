import mongoose from "mongoose";
const {Schema} = mongoose;
const UserSchema= new Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
});

const User = mongoose.model('User',UserSchema);
export default User;