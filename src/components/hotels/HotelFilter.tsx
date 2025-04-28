
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const filterSchema = z.object({
  search: z.string(),
  minPrice: z.number(),
  maxPrice: z.number(),
}).refine((data) => data.maxPrice >= data.minPrice, {
  message: "Max price must be greater than min price",
  path: ["maxPrice"], // This targets the error at the maxPrice field
});

type FilterValues = z.infer<typeof filterSchema>;

interface HotelFilterProps {
  onFilter: (values: any) => void;
  minPrice: number;
  maxPrice: number;
}

export default function HotelFilter({ onFilter, minPrice, maxPrice }: HotelFilterProps) {
  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      minPrice: 1000000,  // Changed to 1 million IDR
      maxPrice: 10000000, // Changed to 10 million IDR
    },
  });

  function onSubmit(data: FilterValues) {
    onFilter(data);
  }

  function handleReset() {
    form.reset({
      search: "",
      minPrice,
      maxPrice,
    });
    onFilter({
      search: "",
      minPrice,
      maxPrice,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search hotels by name or location..."
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={handleReset}
            title="Reset filters"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button type="submit" className="bg-hotel-primary hover:bg-blue-700">
            Filter
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Price Range</span>
            <span className="font-medium">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(form.watch("minPrice"))} - 
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(form.watch("maxPrice"))}
            </span>
          </div>
          
          <FormField
            control={form.control}
            name="minPrice"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Slider
                    min={minPrice}
                    max={maxPrice}
                    step={10}
                    value={[form.watch("minPrice"), form.watch("maxPrice")]}
                    onValueChange={(value) => {
                      form.setValue("minPrice", value[0]);
                      form.setValue("maxPrice", value[1]);
                    }}
                    className="py-4"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
