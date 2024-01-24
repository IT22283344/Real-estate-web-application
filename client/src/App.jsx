import { BrowserRouter,Route,Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import Header from "./Components/Header";
import About from "./Pages/About";

export default function App() {
  return (
    <BrowserRouter className> 
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Signin" element={<Signin/>}/>
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/About" element={<About/>}/>
      </Routes>
    </BrowserRouter>
  )
}
 