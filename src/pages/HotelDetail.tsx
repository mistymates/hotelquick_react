
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchHotelById } from "@/services/api";
import Layout from "@/components/layout/Layout";
import BookingForm from "@/components/bookings/BookingForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Star, Wifi, Dumbbell, Utensils, Waves, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const { data: hotel, isLoading, error } = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => fetchHotelById(id as string),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-64 mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-80 w-full rounded-lg" />
              <div className="mt-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
            <div>
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !hotel) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Hotel Not Found</h2>
            <p className="text-gray-500 mb-6">We couldn't find the hotel you were looking for.</p>
            <Button onClick={() => navigate("/")} className="bg-hotel-primary hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hotels
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getAmenityIcon = (amenity: string) => {
    const lowerCaseAmenity = amenity.toLowerCase();
    if (lowerCaseAmenity.includes("wifi")) return <Wifi className="h-4 w-4" />;
    if (lowerCaseAmenity.includes("gym") || lowerCaseAmenity.includes("fitness")) return <Dumbbell className="h-4 w-4" />;
    if (lowerCaseAmenity.includes("restaurant") || lowerCaseAmenity.includes("breakfast")) return <Utensils className="h-4 w-4" />;
    if (lowerCaseAmenity.includes("pool") || lowerCaseAmenity.includes("beach") || lowerCaseAmenity.includes("spa")) return <Waves className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const handleBookingComplete = () => {
    setBookingSubmitted(true);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6 pl-0 hover:bg-transparent hover:text-hotel-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hotels
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{hotel.address}</span>
                <div className="ml-4 flex items-center">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="ml-1">{hotel.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={hotel.image} 
                alt={hotel.name}
                className="w-full h-80 object-cover"
              />
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">About this hotel</h2>
              <p className="text-gray-600">{hotel.description}</p>
            </div>
            
            <Separator className="mb-6" />
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="mb-6" />
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Price per night</span>
                  <p className="text-lg font-semibold">${hotel.price}</p>
                </div>
                <div>
                  <span className="text-gray-500">Number of rooms</span>
                  <p className="text-lg font-semibold">{hotel.rooms}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            {bookingSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="rounded-full bg-green-100 h-12 w-12 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Booking Requested!</h3>
                <p className="text-gray-600 mb-4">
                  Your booking request has been submitted. The hotel provider will review your request shortly.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/my-bookings")}
                  className="w-full"
                >
                  View My Bookings
                </Button>
              </div>
            ) : (
              <div className="sticky top-24">
                <BookingForm
                  hotelId={hotel.id}
                  hotelPrice={hotel.price}
                  onBookingComplete={handleBookingComplete}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
