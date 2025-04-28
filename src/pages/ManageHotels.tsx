
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  fetchHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  apiErrorHandler,
} from "@/services/api";
import Layout from "@/components/layout/Layout";
import HotelCard from "@/components/hotels/HotelCard";
import HotelForm from "@/components/hotels/HotelForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash } from "lucide-react";

export default function ManageHotels() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isProvider } = useAuth();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  // Redirect if not authenticated or not a provider
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  if (!isProvider) {
    navigate("/");
    return null;
  }

  // Fetch hotels data
  const {
    data: allHotels = [],
    isLoading,
  } = useQuery({
    queryKey: ["hotels"],
    queryFn: fetchHotels,
  });

  // Filter hotels to show only those belonging to this provider
  const providerHotels = allHotels.filter(
    (hotel: any) => hotel.providerId === user?.id
  );

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Hotel added successfully!");
      setAddDialogOpen(false);
    },
    onError: apiErrorHandler,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateHotel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Hotel updated successfully!");
      setEditDialogOpen(false);
      setSelectedHotel(null);
    },
    onError: apiErrorHandler,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Hotel deleted successfully!");
    },
    onError: apiErrorHandler,
  });

  const handleAddHotel = async (data: any) => {
    await createMutation.mutateAsync(data);
  };

  const handleEditHotel = async (data: any) => {
    if (!selectedHotel) return;
    await updateMutation.mutateAsync({ id: selectedHotel.id, data });
  };

  const handleDeleteHotel = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const openEditDialog = (hotel: any) => {
    setSelectedHotel(hotel);
    setEditDialogOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Hotels</h1>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-hotel-primary hover:bg-blue-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Hotel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Hotel</DialogTitle>
                <DialogDescription>
                  Add your hotel details below. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <HotelForm onSubmit={handleAddHotel} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-end">
                  <Skeleton className="h-9 w-20 mr-2" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : providerHotels.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No hotels yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't added any hotels. Add your first hotel now.
            </p>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-hotel-primary hover:bg-blue-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Hotel
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {providerHotels.map((hotel: any) => (
              <div key={hotel.id} className="border rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 space-x-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => openEditDialog(hotel)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete {hotel.name}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this hotel and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteHotel(hotel.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{hotel.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">{hotel.address}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">${hotel.price} / night</span>
                    <span className="text-sm text-gray-500">
                      {hotel.rooms} rooms
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hotel</DialogTitle>
            <DialogDescription>
              Make changes to your hotel details below.
            </DialogDescription>
          </DialogHeader>
          {selectedHotel && (
            <HotelForm
              initialData={selectedHotel}
              onSubmit={handleEditHotel}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
