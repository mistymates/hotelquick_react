
import { Hotel } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Hotel className="h-6 w-6 text-hotel-primary mr-2" />
              <span className="text-xl font-bold text-hotel-primary">HOTELQUICK</span>
            </div>
            <p className="text-gray-500 text-sm">
              Connecting consumers and providers with seamless hotel booking experiences.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">For Consumers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-500 hover:text-hotel-primary text-sm">
                  Find Hotels
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-500 hover:text-hotel-primary text-sm">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">For Providers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/manage-hotels" className="text-gray-500 hover:text-hotel-primary text-sm">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/manage-bookings" className="text-gray-500 hover:text-hotel-primary text-sm">
                  Manage Bookings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-hotel-primary text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-hotel-primary text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} HOTELQUICK. All rights reserved. This is a demonstration app.
          </p>
        </div>
      </div>
    </footer>
  );
}
