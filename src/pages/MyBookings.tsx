
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchBookings, fetchHotels } from "@/services/api";
import Layout from "@/components/layout/Layout";
import BookingCard from "@/components/bookings/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyBookings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isConsumer } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  // Redirect if not authenticated or not a consumer
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (!isConsumer) {
    navigate("/");
    return null;
  }

  // Fetch bookings and hotels data
  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: () => fetchBookings(user?.id as string, "consumer"),
    enabled: !!user?.id,
  });

  const { data: hotels = [], isLoading: isLoadingHotels } = useQuery({
    queryKey: ["hotels"],
    queryFn: fetchHotels,
  });

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((booking: any) => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  });

  // Get hotel details for each booking
  const getHotelDetails = (hotelId: string) => {
    return hotels.find((hotel: any) => hotel.id === hotelId) || {};
  };

  const isLoading = isLoadingBookings || isLoadingHotels;

  const handleStatusUpdate = () => {
    refetchBookings();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row">
                  <Skeleton className="w-full sm:w-1/3 h-40" />
                  <div className="w-full sm:w-2/3 p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === "all"
                ? "You haven't made any bookings yet."
                : `You don't have any ${activeTab} bookings.`}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-hotel-primary hover:bg-blue-700"
            >
              Find a Hotel
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking: any) => {
              const hotel = getHotelDetails(booking.hotelId);
              return (
                <BookingCard
                  key={booking.id}
                  id={booking.id}
                  hotelName={hotel.name}
                  hotelImage={hotel.image}
                  checkIn={booking.checkIn}
                  checkOut={booking.checkOut}
                  guests={booking.guests}
                  status={booking.status}
                  totalPrice={booking.totalPrice}
                  createdAt={booking.createdAt}
                  onStatusUpdate={handleStatusUpdate}
                />
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
