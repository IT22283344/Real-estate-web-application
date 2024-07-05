import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userslice";
/* firbase storage 
       allow read;
      allow write: if 
      request.resource.size < 2*1024*1024 &&
      request.resource.contentType.matches('image/*') */

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();



  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);
  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async() => {
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data =await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
      navigate("/signin");
    }catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate('/signin');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async() => {
    try{ 
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false){
        setShowListingsError(true);
        return;
      }
      
      setUserListings(data);
    }catch(error){
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async(listingId) => {
    try{
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }
      setUserListings((prev) => 
        prev.filter((listing) => listing._id !== listingId)
      );

    }catch(error){
      console.log(error.message);
    }
  };

  return (
    <div className="mx-auto p-3 max-w-lg">
      <h1 className="text-3xl text-center font-semibold p-2 my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.avatar}
          onClick={() => fileRef.current.click()}
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2"
          alt="profile"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 Mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          className="p-3 m-2 mt-10 border rounded-lg bg-transparent focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          className="p-3 m-2  border rounded-lg bg-transparent focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="p-3 m-2 border rounded-lg bg-transparent focus:outline-none"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 m-2 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>

        <Link className="bg-green-700 rounded-lg p-3 m-2 text-white uppercase text-center hover:opacity-95"to={"/create-listing"}>Create Listing</Link>

      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{UpdateSuccess ? 'User is updated successfully!' : ''}</p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingsError ? 'error showing listings':''}</p>

      {userListings && userListings.length > 0 && 
        <div className="flex flex-col gap-3">
          <h1 className="font-semibold text-center mt-7 text-2xl ">Your Listings</h1>
          {userListings.map((listing) => 
            <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4"> 
              <Link to={`/listing/${listing._id}`}>
                <img className="h-16 w-16 object-contain rounded-lg" src={listing.imageUrls[0]} alt="Listing Cover"/>
              </Link>
              <Link className=" flex-1 text-slate-700 font-semibold hover:underline truncate gap-4" to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>
              <div className="items-center flex flex-col">
                <button onClick={() => handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-600-700 uppercase">Edit</button>
                </Link>
              </div>

            </div>
          )}
        </div>
        
      }
    </div>
  );
};
