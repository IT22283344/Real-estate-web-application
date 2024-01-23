import { BrowserRouter,Route,Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";

export default function App() {
  return (
    <BrowserRouter className> 
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Sign-in" element={<Signin/>}/>
        <Route path="/Sign-up" element={<Signup/>}/>
        <Route path="/Profile" element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}
 