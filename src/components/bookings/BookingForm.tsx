
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";

const bookingSchema = z.object({
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.number().min(1).max(10),
}).refine((data) => data.checkOut > data.checkIn, {
  message: "Check-out must be after check-in",
  path: ["checkOut"], // This targets the error at the checkOut field
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  hotelId: string;
  hotelPrice: number;
  onBookingComplete: () => void;
}

export default function BookingForm({ hotelId, hotelPrice, onBookingComplete }: BookingFormProps) {
  const { user, isAuthenticated } = useAuth();
  const [checkInDate, setCheckInDate] = useState<Date>(new Date());
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: new Date(),
      checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days later
      guests: 2,
    },
  });

  const checkIn = form.watch("checkIn");
  const checkOut = form.watch("checkOut");
  
  // Update the checkInDate state when the form's checkIn value changes
  useEffect(() => {
    setCheckInDate(checkIn);
  }, [checkIn]);
  
  const numberOfDays = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = numberOfDays * hotelPrice;

  async function onSubmit(data: BookingFormValues) {
    if (!isAuthenticated || !user) {
      toast.error("You must be signed in to book a hotel");
      return;
    }

    try {
      const bookingData = {
        hotelId,
        consumerId: user.id,
        checkIn: format(data.checkIn, "yyyy-MM-dd"),
        checkOut: format(data.checkOut, "yyyy-MM-dd"),
        guests: data.guests,
        totalPrice,
      };

      // Normally we'd use the API service to store this
      const bookings = JSON.parse(localStorage.getItem("hotelquick_bookings") || "[]");
      const newBooking = {
        ...bookingData,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      bookings.push(newBooking);
      localStorage.setItem("hotelquick_bookings", JSON.stringify(bookings));

      toast.success("Booking request submitted successfully!");
      onBookingComplete();
    } catch (error) {
      toast.error("There was an error submitting your booking");
      console.error(error);
    }
  }

  return (
    <div className="booking-form">
      <h3 className="text-lg font-semibold mb-4">Book Your Stay</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-in</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="checkOut"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-out</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          return date < checkInDate;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <span>Price per night:</span>
              <span>${hotelPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Number of nights:</span>
              <span>{numberOfDays}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-hotel-primary hover:bg-blue-700"
            disabled={!isAuthenticated}
          >
            {isAuthenticated ? "Book Now" : "Sign in to Book"}
          </Button>
          
          {!isAuthenticated && (
            <p className="text-sm text-red-500 text-center">
              You must be signed in as a consumer to make a booking.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
