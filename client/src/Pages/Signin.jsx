import react from 'react';
import  { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { signinStart, signinSuccess, signinFaliure } from '../redux/user/userslice';
import {  useDispatch, useSelector } from 'react-redux';

export default function Signin() {
  const[formData,setformData]=useState({});
  const {loading,error}=useSelector((state)=>state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const handlechange=(e)=>{
    setformData({...formData,[e.target.id]:e.target.value});
  };
  
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signinStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      dispatch(signinSuccess(data));
      if (data.success === false) {
        dispatch(signinFaliure(data));
        return;
      }
      navigate('/');
    } catch (error) {
      dispatch(signinFaliure(error));
    }
  };
  
 
  return (
    <div className='p-5 max-w-lg mx-auto'>
      <h1 className=' text-center font-semibold my-7'>Sign-In</h1>
      <form onSubmit={handlesubmit} className='flex flex-col gap-4'>
        
        <input className='bg-slate-100  rounded' id='email' type='email' autoComplete='email' placeholder='E-mail' onChange={handlechange} />
        <input className='bg-slate-100  rounded' id='password' type='password' placeholder='*********' onChange={handlechange}/>
        <button className='bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95' >{loading?'loading...':'sign In'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to='/signup'>
          <span className='text-blue-500'>Sign Up</span>
        </Link>
       
      </div>
      <p className='text-red-600 mt-5'>{error ? error.message || 'Something went wrong!!':''}</p>
 
    </div>
  )
}
