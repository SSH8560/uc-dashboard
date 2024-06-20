"use client";

import { Category } from "@/app/dashboard/categories/actions.d";
import { makeFlatTree } from "@/lib/utils/dataTransform";
import TreeView from "react-accessible-treeview";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { MouseEventHandler, useState } from "react";
import CategoryEdit, { EditMode } from "./dialog/CategoryEdit";

const MAX_LEVEL = 3;
const ROOT_CATEGORY_ID = 1;

export default function CategoryTreeView({
  categories,
}: {
  categories: Category[];
}) {
  const data = makeFlatTree(categories).sort((a, b) => a.id - b.id);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("UPDATE");
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  }>();

  const handleOpenEditDialog = (
    mode: EditMode,
    category: { id: number; name: string }
  ) => {
    setSelectedCategory(category);
    setEditMode(mode);
    setOpenEditDialog(true);
  };
  const createHandleClick =
    (
      mode: EditMode,
      category: { id: number; name: string }
    ): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      e.preventDefault();
      handleOpenEditDialog(mode, category);
    };

  return (
    <>
      <CategoryItem
        level={0}
        name={"전체"}
        onClickAdd={createHandleClick("CREATE", {
          id: ROOT_CATEGORY_ID,
          name: "전체",
        })}
      />
      <TreeView
        data={data}
        defaultExpandedIds={data.map((node) => node.id)}
        nodeRenderer={({ getNodeProps, element: { name, id }, level }) => (
          <div {...getNodeProps()}>
            <CategoryItem
              level={level}
              name={name}
              onClickAdd={createHandleClick("CREATE", {
                id: +id,
                name,
              })}
              onClickEdit={createHandleClick("UPDATE", {
                id: +id,
                name,
              })}
              onClickDelete={createHandleClick("DELETE", {
                id: +id,
                name,
              })}
            />
          </div>
        )}
      />
      {selectedCategory && (
        <CategoryEdit
          open={openEditDialog}
          onOpenChange={setOpenEditDialog}
          category={selectedCategory}
          mode={editMode}
          onSubmit={() => setOpenEditDialog(false)}
        />
      )}
    </>
  );
}

function CategoryItem({
  level,
  name,
  onClickAdd,
  onClickEdit,
  onClickDelete,
}: {
  level: number;
  name: string;
  onClickAdd: MouseEventHandler<HTMLButtonElement>;
  onClickEdit?: MouseEventHandler<HTMLButtonElement>;
  onClickDelete?: MouseEventHandler<HTMLButtonElement>;
}) {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const paddingLeft = level * 20;
  return (
    <>
      <div
        className="flex justify-between items-center h-10 hover:bg-black/5"
        onMouseOver={() => setIsMouseOver(true)}
        onMouseOut={() => setIsMouseOver(false)}
        style={{ paddingLeft }}
      >
        <Label>{name}</Label>
        <div className="flex flex-row gap-2">
          {isMouseOver && (
            <>
              {level !== MAX_LEVEL && (
                <Button onClick={onClickAdd} variant={"outline"}>
                  추가
                </Button>
              )}
              {onClickEdit && <Button onClick={onClickEdit}>수정</Button>}
              {onClickDelete && <Button onClick={onClickDelete}>삭제</Button>}
            </>
          )}
        </div>
      </div>
    </>
  );
}
