import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function RegisterPage(){
    const [name,setName]=useState('');
    const [email,setemail]=useState('');
    const [password,setPassword]=useState('');
    function RegisterUser(ev){
        try{
            ev.preventDefault();
            axios.post('/register',{
            name,
            email,
            password
        });
        alert('Registration successful. Now you can log in');
        } catch(e){
            alert('Registration failed. Please try again later')
        }
    }
    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-48">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={RegisterUser}>
                    <input type="text" placeholder="Your Name"
                        value={name} 
                        onChange={ev=> setName(ev.target.value)}/>
                    <input type="email" placeholder="youremail.com"
                        value={email} 
                        onChange={ev=> setemail(ev.target.value)}/>
                    <input type="password" placeholder="password"
                        value={password} 
                        onChange={ev=> setPassword(ev.target.value)}/>
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gey-400">
                        Already signed up?
                        <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}