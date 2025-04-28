
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import HotelDetail from "./pages/HotelDetail";
import MyBookings from "./pages/MyBookings";
import ManageHotels from "./pages/ManageHotels";
import ManageBookings from "./pages/ManageBookings";
import ApiDocs from "./pages/ApiDocs";
import NotFound from "./pages/NotFound";

// Context
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/manage-hotels" element={<ManageHotels />} />
            <Route path="/manage-bookings" element={<ManageBookings />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
