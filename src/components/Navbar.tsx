
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ListChecks, BellRing, User } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 gap-6 md:gap-10">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-frei-blue to-frei-teal">
              FIND
            </span>
            <span className="hidden md:inline-block text-xs px-2 py-1 rounded-md bg-frei-light text-frei-teal font-medium">
              fra Frei
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-1.5 text-sm font-medium hover:text-frei-teal transition-colors">
              <Search size={18} />
              <span>Søk</span>
            </Link>
            <Link to="/lists" className="flex items-center gap-1.5 text-sm font-medium hover:text-frei-teal transition-colors">
              <ListChecks size={18} />
              <span>Mine lister</span>
            </Link>
            <Link to="/alerts" className="flex items-center gap-1.5 text-sm font-medium hover:text-frei-teal transition-colors">
              <BellRing size={18} />
              <span>Varsler</span>
            </Link>
          </nav>
          
          <Button variant="outline" size="sm" className="rounded-full w-9 h-9 p-0">
            <User size={18} />
            <span className="sr-only">Konto</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
