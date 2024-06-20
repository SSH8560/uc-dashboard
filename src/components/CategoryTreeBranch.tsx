"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Category } from "@/app/dashboard/categories/actions.d";
import { memo } from "react";
import { CategoryNode } from "@/app/dashboard/categories/page";

function CategoryTreeBranch({
  category,
  onClickUpdate,
  onClickDelete,
  onClickCreate,
}: {
  category: CategoryNode;
  onClickUpdate: (category: CategoryNode) => void;
  onClickDelete: (category: CategoryNode) => void;
  onClickCreate: (category: CategoryNode) => void;
}) {
  const { children, name } = category;
  return (
    <Accordion type="multiple" className="w-[100%]">
      <AccordionItem value={name}>
        <ContextMenu>
          <ContextMenuTrigger className="w-[100%] h-[100%]">
            <AccordionTrigger>{name}</AccordionTrigger>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>{name}</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={(event) => {
                onClickUpdate(category);
                event.stopPropagation();
              }}
            >
              이름 변경
            </ContextMenuItem>
            <ContextMenuItem
              onClick={(event) => {
                onClickDelete(category);
                event.stopPropagation();
              }}
            >
              카테고리 삭제
            </ContextMenuItem>
            <ContextMenuItem
              onClick={(event) => {
                onClickCreate(category);
                event.stopPropagation();
              }}
            >
              하위 카테고리 생성
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <AccordionContent>
          {children.map((child) => (
            <CategoryTreeBranch
              key={child.id}
              category={child}
              onClickUpdate={onClickUpdate}
              onClickCreate={onClickCreate}
              onClickDelete={onClickDelete}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default memo(
  CategoryTreeBranch,
  (prev, curr) => prev.category === curr.category
);
