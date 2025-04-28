import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, Hotel, LogOut, Menu, User, UserPlus, FileText } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated, isProvider, isConsumer } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Hotel className="h-6 w-6 text-hotel-primary mr-2" />
              <span className="text-xl font-bold text-hotel-primary">HOTELQUICK</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-hotel-primary hover:bg-gray-50">
              Hotels
            </Link>
            
            {isAuthenticated && isConsumer && (
              <Link to="/my-bookings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-hotel-primary hover:bg-gray-50">
                My Bookings
              </Link>
            )}
            
            {isAuthenticated && isProvider && (
              <>
                <Link to="/manage-hotels" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-hotel-primary hover:bg-gray-50">
                  Manage Hotels
                </Link>
                <Link to="/manage-bookings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-hotel-primary hover:bg-gray-50">
                  Manage Bookings
                </Link>
              </>
            )}
            
            {!isAuthenticated ? (
              <Button 
                variant="default" 
                onClick={() => navigate("/login")}
                className="bg-hotel-primary hover:bg-blue-700"
              >
                Sign In
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(isProvider ? "/manage-hotels" : "/my-bookings")}>
                    {isProvider ? (
                      <>
                        <Building2 className="h-4 w-4 mr-2" />
                        <span>Dashboard</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        <span>My Bookings</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link to="/">Hotels</Link>
                </DropdownMenuItem>
                
                {isAuthenticated && isConsumer && (
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings">My Bookings</Link>
                  </DropdownMenuItem>
                )}
                
                {isAuthenticated && isProvider && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/manage-hotels">Manage Hotels</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/manage-bookings">Manage Bookings</Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                
                {!isAuthenticated ? (
                  <DropdownMenuItem asChild>
                    <Link to="/login">Sign In</Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuLabel>
                      Signed in as {user?.name}
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
