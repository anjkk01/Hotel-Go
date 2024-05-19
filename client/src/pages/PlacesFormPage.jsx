import Perks from "../Perks";
import { useEffect, useState } from "react";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
export default function PlacesFormPage() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuest] = useState(1);
    const [redirect,setRedirect] = useState(false);
    const [price,setPrice]=useState(100);
    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get('/places/'+id).then(response =>{
            const {data}=response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuest(data.maxGuests);
            setPrice(data.price);
        });
    }, [id]);
    function inputheader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDesc(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function preinput(header, description) {
        return (
            <>
                {inputheader(header)}
                {inputDesc(description)}
            </>
        );
    }

    async function savePlace(ev) {
        ev.preventDefault();
        const placeData={ title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests,price};
        if(id){
            await axios.put('/places', { id, ...placeData });
            setRedirect(true);
        }
        else{
            await axios.post('/places',placeData);
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/account/places'}/>
    }
    return (
        <div className="pl-1">
            <AccountNav/>
            <form onSubmit={savePlace}>
                {preinput('Title', 'Title for your place should be short and catchy')}
                <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My lovely apartment" />
                {preinput('Address', 'Address to this place')}
                <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="address" />
                <h2 className="text-2xl mt-4">Photos</h2>
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                {preinput('Description', 'description of the place')}
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} className="h-72 md:h-56 lg:h-48 "></textarea>
                {preinput('Perks', 'select all the perks of your place')}
                <div>
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <Perks selected={perks} onChange={setPerks} />
                    </div>
                </div>
                {preinput('Extra Info', 'house rules, etc')}
                <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}></textarea>
                {preinput('Check in&out times', 'add check in and out times, remember to have some time window for cleaning the rooms')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check-in time</h3>
                        <input type="text" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} placeholder="11:00" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check-out time</h3>
                        <input type="text" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} placeholder="9:00" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                        <input type="number" value={maxGuests} onChange={ev => setMaxGuest(ev.target.value)} placeholder="6" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type="number" value={price} onChange={ev => setPrice(ev.target.value)} placeholder="100" />
                    </div>
                </div>
                <button className="primary my-4 hover:bg-opacity-95">Save</button>
            </form>
        </div>
    );
}