import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  jobName?: string;
}

export function DeleteConfirm({
  open,
  onOpenChange,
  onConfirm,
  jobName,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent data-ocid="delete.dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Job Sheet?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the job for{" "}
            <span className="font-semibold">{jobName ?? "this customer"}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-ocid="delete.cancel_button">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:opacity-90"
            onClick={onConfirm}
            data-ocid="delete.confirm_button"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
