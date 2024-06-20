"use client";

import { useState } from "react";
import CategoryList from "./CategoryList";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Category } from "@/app/dashboard/categories/actions.d";
import { Label } from "./ui/label";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { ContextMenuContent } from "@radix-ui/react-context-menu";

const ROOT_CATEGORY_ID = 1;

export default function CategoryView({
  categories,
  onClickDetailedCategory,
}: {
  categories: Category[];
  onClickDetailedCategory?: ({
    majorCategory,
    subCategory,
    detailedCategory,
  }: CategoryHierarchy) => void;
}) {
  const [majorCategory, setMajorCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<Category | null>(null);
  const [detailedCategory, setDetailedCategory] = useState<Category | null>(
    null
  );

  const filterCategoriesByParent = (parent: number | null) =>
    categories.filter((category) => category.parent === parent);

  const majorCategories = filterCategoriesByParent(ROOT_CATEGORY_ID);
  const subCategories = majorCategory
    ? filterCategoriesByParent(majorCategory.id)
    : [];
  const detailedCategories = subCategory
    ? filterCategoriesByParent(subCategory.id)
    : [];

  const handleClickDetailedCategory = (detailedCategory: Category) => {
    setDetailedCategory(detailedCategory);
    onClickDetailedCategory &&
      majorCategory &&
      subCategory &&
      onClickDetailedCategory({
        majorCategory,
        subCategory,
        detailedCategory,
      });
  };

  return (
    <Card className="w-min">
      <CardContent>
        <div className="flex gap-4">
          <CategorySection
            label="대분류"
            categories={majorCategories}
            onClickCategory={setMajorCategory}
          />
          <CategorySection
            label="중분류"
            categories={subCategories}
            onClickCategory={setSubCategory}
          />

          <CategorySection
            label="소분류"
            categories={detailedCategories}
            onClickCategory={handleClickDetailedCategory}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function CategorySection({
  label,
  categories,
  onClickCategory,
}: {
  label: string;
  categories: Category[];
  onClickCategory: (category: Category) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <CategoryList categories={categories} onClickCategory={onClickCategory} />
    </div>
  );
}

export type CategoryHierarchy = {
  majorCategory: Category;
  subCategory: Category;
  detailedCategory: Category;
};
