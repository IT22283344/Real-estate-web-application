import { BrowserRouter,Route,Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import Header from "./Components/Header";
import About from "./Pages/About";
import PrivateRoute from "./Components/PrivateRoute";
import CreateListing from "./Pages/CreateListing";

export default function App() {
  return (
    <BrowserRouter> 
      <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Signin" element={<Signin/>}/>
          <Route path="/Signup" element={<Signup/>}/>
          <Route path="/About" element={<About/>}/>
          <Route  element={<PrivateRoute/>}>
            <Route path="/Profile" element={<Profile/>}/>
            <Route path="/create-listing" element={<CreateListing/>}/>
          </Route>
        </Routes>
    </BrowserRouter>
  );
}
 