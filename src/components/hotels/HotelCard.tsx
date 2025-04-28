import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface HotelCardProps {
  id: string;
  name: string;
  description: string;
  address: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
}

export default function HotelCard({ 
  id, 
  name, 
  description, 
  address, 
  price, 
  rating, 
  image, 
  amenities 
}: HotelCardProps) {
  // Format price to IDR
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Card className="hotel-card group overflow-hidden h-full flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-hotel-primary hover:bg-hotel-primary flex items-center">
            <Star className="h-3 w-3 fill-white mr-1" />
            {rating.toFixed(1)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold truncate">{name}</h3>
        <p className="text-sm text-gray-500 line-clamp-1 mb-1">{address}</p>
        <p className="text-sm line-clamp-2 mb-3 text-gray-600">{description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs font-normal">
              {amenity}
            </Badge>
          ))}
          {amenities.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{amenities.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="font-semibold text-lg">{formattedPrice}</span>
            <span className="text-sm text-gray-500"> / malam</span>
          </div>
          
          <Button asChild className="bg-hotel-primary hover:bg-blue-700">
            <Link to={`/hotels/${id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
