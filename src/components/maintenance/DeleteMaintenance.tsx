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
import { deleteMaintenance } from "@/server/actions/maintenance/maintenance.actions";
import { useOrganization } from "@clerk/nextjs";

export default function DeleteMaintenanceModal({
  maintenance_id,
}: {
  maintenance_id: string;
}) {
  const { organization } = useOrganization();
  const handleDelete = async () => {
    // delete incident
    if (!organization?.id) {
      toast({
        title: "Unauthorized, Please join with an organization",
        variant: "destructive",
      });
      return;
    }
    const response = await deleteMaintenance({
      maintenance_id: maintenance_id,
      organization_id: organization?.id,
    });
    if (!response.success) {
      toast({
        title: "Failed to delete the Maintenance",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successfully deleted the Maintenance",
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
