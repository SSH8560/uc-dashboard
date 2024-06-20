"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function SideNavBar() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <nav className="flex flex-col p-10">
      <Link href="/dashboard">대시보드</Link>
      <Link href="/dashboard/categories">카테고리</Link>
      <Link href="/dashboard/items">상품</Link>
    </nav>
  );
}
