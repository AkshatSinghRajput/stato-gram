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
import { deleteIncident } from "@/server/actions/incident/incident.actions";
import { useOrganization } from "@clerk/nextjs";

export default function DeleteIncidentModal({
  incident_id,
}: {
  incident_id: string;
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
    const response = await deleteIncident({
      incident_id: incident_id,
      organization_id: organization?.id,
    });
    if (!response.success) {
      toast({
        title: "Failed to delete the Incident",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Successfully deleted the Incident",
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
