import react from 'react';
import { set } from 'mongoose';
import  { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import OAuth from '../Components/OAuth';

export default function Signup() {
  const[formData,setformData]=useState({});
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const handlechange=(e)=>{
    setformData({...formData,[e.target.id]:e.target.value});
  };
  
  const handlesubmit=async (e)=>{
    e.preventDefault();
    try{
      setLoading(true);
      setError(false);
      const res= await fetch('/api/auth/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      });
      const data=await res.json();
      console.log(data);
      setLoading(false);
      if(data.success===false){
          setError(true);
          return;
      }
      navigate('/signin');
    
    }
    catch(error){}
      setLoading(false);
      
  };
 
  return (
    <div className='p-5 max-w-lg mx-auto'>
      <h1 className=' text-center font-semibold my-7'>Signup</h1>
      <form onSubmit={handlesubmit} className='flex flex-col gap-4'>
        <input className='bg-slate-100  rounded ' id='username' autoComplete='username' type='text' placeholder='Username' onChange={handlechange}  />
        <input className='bg-slate-100  rounded' id='email' type='email' autoComplete='email' placeholder='E-mail' onChange={handlechange} />
        <input className='bg-slate-100  rounded' id='password' type='password' placeholder='*********' onChange={handlechange}/>
        <button className='bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95' >{loading?'loading...':'sign Up'}</button>
        <OAuth/>

      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/signin'>
          <span className='text-blue-500'>Sign in</span>
        </Link>
       
      </div>
      <p className='text-red-600 mt-5'>{error && 'Something went wrong!!'}</p>
 
    </div>
  )
}
