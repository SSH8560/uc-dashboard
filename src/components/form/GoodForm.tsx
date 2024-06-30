"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandItem, CommandList } from "../ui/command";
import { CommandGroup } from "cmdk";
import { getItemsFromMarket, postItem } from "@/app/items/actions";
import type { Item, MarketItem } from "@/app/items/actions.d";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Label } from "../ui/label";
import ImagePreview from "../ImagePreview";
import CategoryView, { CategoryHierarchy } from "../CategoryView";
import { Category } from "@/app/categories/actions.d";
import { getCategories } from "@/app/categories/actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const goodFormSchema = z.object({
  image: z
    .any()
    .nullable()
    .refine((fileList) => fileList === null || fileList instanceof FileList, {
      message: "파일 형식이 아닙니다.",
    })
    .refine(
      (fileList: FileList | null) => {
        if (fileList === null || fileList.length === 0) return true;
        const MB = 1024 * 1024;
        const fileSizeMB = fileList[0].size / MB;
        if (fileSizeMB > 5) return false;
        return true;
      },
      { message: "파일이 너무 큽니다. (5MB 이하)" }
    ),
  name: z.string().min(1).max(20),
  barcode: z.string().min(1),
  buyPrice: z.number(),
  sellPrice: z.number(),
  unit: z.string(),
  categoryId: z.number(),
});
type goodFormSchemaType = z.infer<typeof goodFormSchema>;
type Props = {};

const calculatePriceMargin = (buyPrice: number, sellPrice: number) =>
  parseFloat((((sellPrice - buyPrice) / buyPrice) * 100).toFixed(2));

const GoodForm = ({}: Props) => {
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [selectedCategories, setSelectedCategories] =
    useState<CategoryHierarchy | null>(null);
  const [priceMargin, setPriceMargin] = useState<number>();
  const form = useForm<goodFormSchemaType>({
    resolver: zodResolver(goodFormSchema),
  });
  const { watch } = form;

  const sellPrice = watch("sellPrice");
  const buyPrice = watch("buyPrice");
  const image = watch("image");

  useEffect(() => {
    if (buyPrice && sellPrice) {
      const calculatedMargin = calculatePriceMargin(buyPrice, sellPrice);
      setPriceMargin(calculatedMargin);
    }
  }, [buyPrice, sellPrice]);

  const handleChangePriceMargin = (margin: number) => {
    if (buyPrice) {
      form.setValue("sellPrice", Math.floor(buyPrice * (1 + margin / 100)));
      setPriceMargin(margin);
    }
  };
  const handleChangeSelectedCategories = (categories: CategoryHierarchy) => {
    setSelectedCategories(categories);
    form.setValue("categoryId", categories.detailedCategory.id);
  };
  const handleSelectItem = useCallback(
    ({ name, barcode, buyPrice, sellPrice, unit }: MarketItem) => {
      const { setValue, trigger } = form;
      setValue("name", name);
      setValue("barcode", barcode);
      setValue("buyPrice", buyPrice);
      setValue("unit", unit);
      setValue("sellPrice", sellPrice);
      trigger();
    },
    [form]
  );
  const onSubmit = async ({
    name,
    barcode,
    buyPrice,
    sellPrice,
    unit,
    categoryId,
  }: goodFormSchemaType) => {
    postItem({
      name,
      unit,
      barcode,
      buy_price: buyPrice,
      sell_price: sellPrice,
      category_id: categoryId,
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-[400px] gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상품명</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="상품명을 입력해주세요." {...field} />
                </FormControl>
                <SearchDialog onSelectItem={handleSelectItem} />
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>카테고리</FormLabel>
              <FormControl>
                <Button
                  className="w-full justify-start"
                  variant={"outline"}
                  type="button"
                  onClick={async () => {
                    if (!categories) setCategories(await getCategories());
                    setOpenCategoryModal(true);
                  }}
                >
                  {selectedCategories ? (
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          {selectedCategories.majorCategory.name}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {selectedCategories.subCategory.name}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {selectedCategories.detailedCategory.name}
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  ) : (
                    "카테고리 선택"
                  )}
                </Button>
              </FormControl>
              <Dialog
                open={openCategoryModal}
                onOpenChange={setOpenCategoryModal}
              >
                <DialogContent className="min-w-fit">
                  {categories && (
                    <CategoryView
                      categories={categories}
                      onClickDetailedCategory={(categories) => {
                        setOpenCategoryModal(false);
                        handleChangeSelectedCategories(categories);
                      }}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>바코드</FormLabel>
              <FormControl>
                <Input placeholder="바코드를 입력해주세요." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>단위</FormLabel>
              <FormControl>
                <Input placeholder="단위를 입력해주세요." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end">
          <FormField
            control={form.control}
            name="sellPrice"
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <div className="basis-4/5">
                    <FormLabel>판매가</FormLabel>
                    <FormControl className="mt-2">
                      <Input
                        placeholder="판매가를 입력해주세요."
                        {...form.register("sellPrice", {
                          valueAsNumber: true,
                          onChange: (event) => console.log(event.target.value),
                        })}
                      />
                    </FormControl>
                  </div>
                  <div className="basis-1/5">
                    <Label>마진</Label>
                    <Input
                      type="number"
                      className="mt-2"
                      step={0.01}
                      value={priceMargin}
                      onChange={(event) =>
                        handleChangePriceMargin(
                          parseFloat(event.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div></div>
        </div>
        <FormField
          control={form.control}
          name="buyPrice"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row justify-between items-center">
                <FormLabel>매입가</FormLabel>
                <FormMessage />
              </div>

              <Input
                placeholder="매입가를 입력해주세요."
                {...form.register("buyPrice", { valueAsNumber: true })}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상품사진</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...form.register("image")}
                />
              </FormControl>
              <FormMessage />
              {image && image[0] && <ImagePreview file={image[0]} />}
            </FormItem>
          )}
        />
        <Button type="submit">등록하기</Button>
      </form>
    </Form>
  );
};

function SearchDialog({
  onSelectItem,
}: {
  onSelectItem: (item: MarketItem) => void;
}) {
  const [searchType, setSearchType] = useState<"name" | "barcode">("barcode");
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MarketItem[] | null>(null);

  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      searchButtonRef.current?.click();
    }
  };
  const handleOnClickSearch = async () => {
    const { content } = await getItemsFromMarket({
      query: searchQuery,
      type: searchType,
    });
    setItems(content);
  };

  return (
    <Dialog onOpenChange={setOpenDialog} open={openDialog}>
      <DialogTrigger asChild>
        <Button>불러오기</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-[800px] max-h-[600px]">
        <DialogHeader>
          <div className="flex gap-2 mr-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  className="w-[100px] flex-shrink-0 justify-between"
                  variant="outline"
                  role="combobox"
                >
                  {SearchTypes.find((type) => type.value === searchType)?.label}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[100px] p-0 ">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {SearchTypes.map(({ label, value }) => (
                        <CommandItem
                          key={label}
                          onSelect={() => {
                            setSearchType(value);
                            setOpen(false);
                          }}
                        >
                          {label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Input
              onKeyDown={handleKeyDown}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <Button ref={searchButtonRef} onClick={handleOnClickSearch}>
              검색
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-grow overflow-y-scroll">
          {items && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">상품명</TableHead>
                  <TableHead className="w-[100px]">바코드</TableHead>
                  <TableHead className="w-[60px]">단위</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => {
                      onSelectItem(item);
                      setOpenDialog(false);
                    }}
                  >
                    <TableCell className="p-2 font-medium max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.name}
                    </TableCell>
                    <TableCell className="p-2">{item.barcode}</TableCell>
                    <TableCell className="p-2">{item.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <Button>다음</Button>
              </TableFooter>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const SearchTypes: { label: string; value: "name" | "barcode" }[] = [
  {
    label: "바코드",
    value: "barcode",
  },
  {
    label: "상품명",
    value: "name",
  },
];

export default GoodForm;
