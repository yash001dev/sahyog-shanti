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

function CustomizedAlertDialog({
  open,
  closeDialog,
  action,
  deleteMessage = "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
  isLoading,
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger />
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{deleteMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={action}>
            {isLoading ? (
              <Button isLoading>Deleting...</Button>
            ) : (
              <Button>Continue</Button>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CustomizedAlertDialog;
