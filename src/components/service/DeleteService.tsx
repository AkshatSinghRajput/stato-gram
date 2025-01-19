"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { deleteServiceAction } from "@/server/actions/service/service.actions";
import { useRouter } from "next/navigation";

export function DeleteServiceModal({ service_id }: { service_id: string }) {
  const router = useRouter();

  async function handleDeleteService() {
    // Call the delete service action
    try {
      const deleted = await deleteServiceAction(service_id);
      if (deleted.success) {
        toast({
          title: "Success",
          description: "Service deleted successfully.",
        });
        router.push("/dashboard/services");
      } else {
        toast({
          title: "Error",
          description: "An error occurred while deleting the service.",
          variant: "destructive",
        });
      }
      return;
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the service.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-500 text-2xl">
            Delete Service
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this service? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleDeleteService}
            variant="destructive"
          >
            <span className="flex items-center gap-2">Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
