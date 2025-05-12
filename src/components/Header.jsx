/* eslint-disable no-unused-vars */
import { Link, useLocation } from "react-router-dom";
import { Home, FilePlus } from "lucide-react"; // Add more icons as needed
import { Button } from "./ui/button";

const Header = () => {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path ? "text-cyan-400 font-semibold" : "text-gray-500";

  return (
    <header className="fixed top-4 left-0 right-0 mx-auto max-w-xs sm:max-w-lg md:max-w-2xl shadow-md rounded-full bg-dot backdrop-blur-3xl z-50 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-primary-foreground">
        AquaTrack
      </Link>
      <nav className="flex space-x-6 text-base">
        <Link
          to="/"
          className={`${isActive(
            "/"
          )} text-primary-foreground flex items-center gap-1`}
        >
          <Home className="h-5 w-5" />
          {/* <span className="hidden sm:inline">Home</span> */}
        </Link>
        <Button variant="outline" className="group rounded-full" asChild>
          <Link
            to="/report"
            className={`${isActive(
              "/report"
            )} text-primary-foreground flex items-center gap-1`}
          >
            <FilePlus className="h-5 w-5 inline sm:hidden" />
            <span className="hidden sm:inline">Report Water Issues</span>
          </Link>
        </Button>
        {/* <Link to="/about" className={`${isActive("/about")} text-primary-foreground flex items-center gap-1`}>
          <Info className="h-5 w-5 inline sm:hidden" />
          <span className="hidden sm:inline">About</span>
        </Link> */}
      </nav>
    </header>
  );
};

export default Header;
