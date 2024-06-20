import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

export default function ConfirmDialog({
  open,
  message,
}: {
  open;
  message: string;
}) {
  return (
    <Dialog modal>
      <DialogContent>
        {message}
        <DialogFooter>
          <Button variant={"destructive"}>삭제</Button>
          <Button>취소</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
