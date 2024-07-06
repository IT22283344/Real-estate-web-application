import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm,setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParms = new URLSearchParams(window.location.search);
        urlParms.set('searchTerm',searchTerm);
        const searchQuery = urlParms.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    },[location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm  text-blue-600 font-serif flex flex-wrap">
            <span className="text-blue-600">Rash</span>
            <span className="text-blue-300">Market</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search....."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600"></FaSearch>
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/About">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>

          <Link to="/Profile">
            {currentUser ? (
              <img
                className="rounded-full w-8 h-8 object-cover"
                src={currentUser.avatar}
                alt="Profile"
              />
            ) : (
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Signin
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
