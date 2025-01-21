"use client";

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
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { deleteServiceAction } from "@/server/actions/service/service.actions";
import { useOrganization } from "@clerk/nextjs";

export default function DeleteServiceModal({
  service_id,
}: {
  service_id: string;
}) {
  const { organization } = useOrganization();
  const handleDelete = async () => {
    // delete service
    if (!organization?.id) {
      toast({
        title: "Unauthorized, Please join with an organization",
        description: "You are not authorized to delete the service",
        variant: "destructive",
      });
      return;
    }
    const response = await deleteServiceAction(service_id);
    if (!response.success) {
      toast({
        title: "Failed to delete the Service",
        description: response.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successfully deleted the Service",
        description: "Service deleted successfully.",
      });
      // Close the dialog box
      return;
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleDelete} variant="destructive">
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
