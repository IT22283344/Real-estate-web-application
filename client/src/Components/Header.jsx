import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import "boxicons/css/boxicons.min.css";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  return (
    <header className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 shadow-md sticky top-0 z-50">
      <div className="flex flex-wrap justify-between items-center max-w-7xl mx-auto p-4 md:px-8">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <box-icon name="home" color="white" size="md"></box-icon>
          <h1 className="text-white text-xl font-bold flex items-center">
            <span>LANKA</span>
            <span className="text-sm ml-1">Real Estate</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center bg-white rounded-full shadow-md px-4 py-2 w-full md:w-1/2 max-w-md"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full text-sm text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute right-3">
            <FaSearch className="text-gray-500" />
          </button>
        </form>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white text-sm md:text-base ${
                isActive ? "font-semibold underline" : "hover:underline"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/About"
            className={({ isActive }) =>
              `text-white text-sm md:text-base ${
                isActive ? "font-semibold underline" : "hover:underline"
              }`
            }
          >
            About Us
          </NavLink>
          <Link to="/Profile" className="flex items-center">
            {currentUser ? (
              <img
                className="rounded-full w-8 h-8 border-2 border-white object-cover"
                src={currentUser.avatar}
                alt="Profile"
              />
            ) : (
              <FaUserCircle className="text-white text-2xl" />
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
