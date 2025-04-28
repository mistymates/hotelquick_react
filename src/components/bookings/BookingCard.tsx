
import { format, parseISO } from "date-fns";
import {
  Calendar,
  CheckCircle,
  Clock,
  UserRound,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { updateBookingStatus } from "@/services/api";
import { toast } from "@/components/ui/sonner";

interface BookingCardProps {
  id: string;
  hotelName: string;
  hotelImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  onStatusUpdate?: () => void;
}

export default function BookingCard({
  id,
  hotelName,
  hotelImage,
  checkIn,
  checkOut,
  guests,
  status,
  totalPrice,
  createdAt,
  onStatusUpdate,
}: BookingCardProps) {
  const { isProvider } = useAuth();
  
  // Format dates
  const formattedCheckIn = format(parseISO(checkIn), "MMM dd, yyyy");
  const formattedCheckOut = format(parseISO(checkOut), "MMM dd, yyyy");
  const formattedCreatedAt = format(parseISO(createdAt), "MMM dd, yyyy");
  
  // Calculate number of nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const getStatusBadge = () => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-hotel-success">Confirmed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
    }
  };
  
  const handleConfirm = async () => {
    try {
      await updateBookingStatus(id, "confirmed");
      toast.success("Booking confirmed successfully");
      if (onStatusUpdate) onStatusUpdate();
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error(error);
    }
  };
  
  const handleReject = async () => {
    try {
      await updateBookingStatus(id, "rejected");
      toast.success("Booking rejected");
      if (onStatusUpdate) onStatusUpdate();
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error(error);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/3">
          <img
            src={hotelImage}
            alt={hotelName}
            className="h-full w-full object-cover object-center"
          />
        </div>
        
        <div className="w-full sm:w-2/3">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{hotelName}</h3>
              {getStatusBadge()}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Check-in: {formattedCheckIn}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Check-out: {formattedCheckOut}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-gray-500" />
                <span>{guests} {guests === 1 ? "Guest" : "Guests"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Booked on: {formattedCreatedAt}</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <span className="text-gray-600">
                {nights} {nights === 1 ? "night" : "nights"}
              </span>
              <span className="font-semibold">${totalPrice}</span>
            </div>
          </CardContent>
          
          {isProvider && status === "pending" && (
            <CardFooter className="border-t px-4 py-3 bg-gray-50">
              <div className="flex space-x-2 w-full">
                <Button 
                  onClick={handleConfirm} 
                  className="w-full bg-hotel-success hover:bg-green-600"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
                
                <Button 
                  onClick={handleReject} 
                  variant="destructive" 
                  className="w-full"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardFooter>
          )}
        </div>
      </div>
    </Card>
  );
}
