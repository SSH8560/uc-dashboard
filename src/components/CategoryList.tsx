"use client";

import { Category } from "@/app/dashboard/categories/actions.d";
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

export default function CategoryList({
  categories,
  onClickCategory,
}: {
  categories: Category[];
  onClickCategory: (category: Category) => void;
}) {
  return (
    <Card className="w-[200px] h-[400px]">
      <Command>
        <CommandGroup>
          <CommandList className="w-full">
            {categories.map((category) => (
              <CommandItem key={category.id} asChild>
                <CategoryItem
                  category={category}
                  onClickCategory={onClickCategory}
                />
              </CommandItem>
            ))}
          </CommandList>
        </CommandGroup>
      </Command>
    </Card>
  );
}

function CategoryItem({
  category,
  onClickCategory,
}: {
  category: Category;
  onClickCategory: (category: Category) => void;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button
          className="pt-0 pb-0 w-full justify-start"
          onClick={() => onClickCategory(category)}
          variant="ghost"
          type="button"
        >
          {category.name}
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>카테고리 삭제</ContextMenuItem>
        <ContextMenuItem>카테고리 이름 변경</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
