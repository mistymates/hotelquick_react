
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

const hotelSchema = z.object({
  name: z.string().min(3, {
    message: "Hotel name must be at least 3 characters",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }),
  address: z.string().min(5, {
    message: "Address is required",
  }),
  price: z.number().min(1, {
    message: "Price must be greater than 0",
  }),
  image: z.string().url({
    message: "Please enter a valid image URL",
  }),
  rooms: z.number().min(1, {
    message: "Number of rooms must be at least 1",
  }),
  amenities: z.string(),
});

type HotelFormValues = z.infer<typeof hotelSchema>;

interface HotelFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isEditing?: boolean;
}

export default function HotelForm({
  initialData,
  onSubmit,
  isEditing = false,
}: HotelFormProps) {
  const { user } = useAuth();
  
  const defaultValues: Partial<HotelFormValues> = {
    name: "",
    description: "",
    address: "",
    price: 100,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    rooms: 1,
    amenities: "Free WiFi, Air conditioning",
  };

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelSchema),
    defaultValues: initialData || defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        amenities: initialData.amenities.join(", "),
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: HotelFormValues) => {
    try {
      const formattedData = {
        ...data,
        price: Number(data.price),
        rooms: Number(data.rooms),
        amenities: data.amenities.split(",").map((item) => item.trim()),
        providerId: user?.id,
      };
      
      await onSubmit(formattedData);
    } catch (error) {
      toast.error("Failed to save hotel");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter hotel name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your hotel" 
                  className="min-h-24" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter hotel address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Night</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    placeholder="100" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Rooms</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    placeholder="10" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="WiFi, Pool, Gym" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="bg-hotel-primary hover:bg-blue-700">
            {isEditing ? "Update Hotel" : "Add Hotel"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
