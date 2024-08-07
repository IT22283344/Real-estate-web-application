import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import Header from "./Components/Header";
import About from "./Pages/About";
import PrivateRoute from "./Components/PrivateRoute";
import CreateListing from "./Pages/CreateListing";
import UpdateListing from "./Pages/UpdateListing";
import Listing from "./Pages/listing";
import Search from "./Pages/Search";
import ScrollToTop from "./Components/ScrollToTop";
import Footer from "./Components/Footer";
import FloatingWhatsAppButton from "./Components/Floatingwhatsappbutton";


export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/About" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listing/:listingId" element={<Listing />} />

          <Route element={<PrivateRoute />}>
            <Route path="/Profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route
              path="/update-listing/:listingId"
              element={<UpdateListing />}
            />
          </Route>
        </Routes>
        <Footer/>
      </>
    </BrowserRouter>
  );
}
