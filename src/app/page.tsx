import Category from "@/components/CategoryTreeBranch";
import Example from "@/components/chart/ChartExample";
import GoodForm from "@/components/form/GoodForm";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <GoodForm />
    </main>
  );
}
