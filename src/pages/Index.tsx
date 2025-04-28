
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import HotelCard from "@/components/hotels/HotelCard";
import HotelFilter from "@/components/hotels/HotelFilter";
import { fetchHotels } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isProvider } = useAuth();
  const [filteredHotels, setFilteredHotels] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    minPrice: 0,
    maxPrice: 1000,
  });

  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: fetchHotels,
  });

  useEffect(() => {
    if (hotels.length > 0) {
      applyFilters(filters);
    }
  }, [hotels]);

  const applyFilters = (filterValues: any) => {
    setFilters(filterValues);

    const filtered = hotels.filter((hotel: any) => {
      const matchesSearch =
        !filterValues.search ||
        hotel.name.toLowerCase().includes(filterValues.search.toLowerCase()) ||
        hotel.address.toLowerCase().includes(filterValues.search.toLowerCase());

      const matchesPrice =
        hotel.price >= filterValues.minPrice &&
        hotel.price <= filterValues.maxPrice;

      return matchesSearch && matchesPrice;
    });

    setFilteredHotels(filtered);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight mb-4">
              Find Your Perfect Stay with HOTELQUICK
            </h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Connecting consumers and providers for seamless hotel booking experiences
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider CTA */}
        {isProvider && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-hotel-secondary mb-1">Hotel Provider Dashboard</h2>
              <p className="text-gray-600">Manage your hotels and bookings from your dashboard</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button asChild className="bg-hotel-secondary hover:bg-green-600">
                <Link to="/manage-hotels" className="flex items-center">
                  Manage Hotels
                  <MoveRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <HotelFilter
            onFilter={applyFilters}
            minPrice={0}
            maxPrice={1000}
          />
        </div>

        {/* Hotel Listings */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Hotels</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-9 w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-500">No hotels found matching your criteria.</p>
              <Button 
                variant="link" 
                onClick={() => applyFilters({ search: "", minPrice: 0, maxPrice: 1000 })}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel: any) => (
                <HotelCard
                  key={hotel.id}
                  id={hotel.id}
                  name={hotel.name}
                  description={hotel.description}
                  address={hotel.address}
                  price={hotel.price}
                  rating={hotel.rating}
                  image={hotel.image}
                  amenities={hotel.amenities}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
