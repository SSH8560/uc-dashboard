import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/categories/actions";

interface CategoryEditProps {
  open: boolean;
  mode: EditMode;
  category: {
    id: number;
    name: string;
  };
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export default function CategoryEdit({
  open,
  mode,
  category: { id, name },
  onOpenChange,
  onSubmit,
}: CategoryEditProps) {
  const form = useForm<z.infer<typeof categoryEditSchema>>({
    resolver: zodResolver(categoryEditSchema),
  });
  console.log(name);
  useEffect(() => {
    open && form.reset();
    if (mode === "UPDATE") form.setValue("name", name);
    if (mode === "CREATE") form.setValue("name", "");
  }, [open, mode]);

  const handleFormSubmit = ({ name }: { name: string }) => {
    switch (mode) {
      case "CREATE":
        createCategory({ name, parent: id });
        break;
      case "UPDATE":
        updateCategory(id, { name });
        break;
      case "DELETE":
        deleteCategory(id);
        break;
    }
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {mode === "CREATE"
            ? "하위 카테고리 생성"
            : mode === "UPDATE"
            ? "카테고리 수정"
            : mode === "DELETE"
            ? "카테고리 삭제"
            : ""}
        </DialogHeader>
        {mode !== "DELETE" ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Input
                      {...field}
                      placeholder={
                        mode === "CREATE"
                          ? `${name}의 하위 카테고리`
                          : undefined
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">입력</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div>
            <p>정말로 이 카테고리를 삭제하시겠습니까?</p>
            <DialogFooter>
              <Button
                onClick={() => handleFormSubmit({ name: "" })}
                variant={"destructive"}
              >
                삭제
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const categoryEditSchema = z.object({
  name: z.string().min(1),
});

export type EditMode = "CREATE" | "UPDATE" | "DELETE";
