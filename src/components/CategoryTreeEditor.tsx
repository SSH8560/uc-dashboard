"use client";

import { useForm } from "react-hook-form";
import CategoryBranch from "./CategoryTreeBranch";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCallback, useState } from "react";
import { Category } from "@/app/dashboard/categories/page";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/dashboard/categories/actions";
import CategoryEdit from "./dialog/CategoryEdit";

export default function CategoryTreeEditor({
  categoryTree,
}: {
  categoryTree: Category;
}) {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("CREATE");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleOpenDialog = useCallback((mode: EditMode, category: Category) => {
    setEditMode(mode);
    setSelectedCategory(category);
    setOpenEditDialog(true);
  }, []);

  const handleSubmit = useCallback(
    (name: string) => {
      if (!selectedCategory) return;

      const { id } = selectedCategory;
      if (editMode === "CREATE") {
        createCategory({ name, parent_id: selectedCategory.id });
      } else if (editMode === "UPDATE") {
        updateCategory(id, { name });
      } else if (editMode === "DELETE") {
        deleteCategory(id);
      }
      setOpenEditDialog(false);
    },
    [editMode, selectedCategory]
  );

  return (
    <>
      <CategoryBranch
        category={categoryTree}
        onClickCreate={(category) => handleOpenDialog("CREATE", category)}
        onClickUpdate={(category) => handleOpenDialog("UPDATE", category)}
        onClickDelete={(category) => handleOpenDialog("DELETE", category)}
      />
      {selectedCategory && (
        <CategoryEdit
          key={selectedCategory.id}
          open={openEditDialog}
          mode={editMode}
          category={selectedCategory}
          onOpenChange={setOpenEditDialog}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
