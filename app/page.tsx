import ProductList from "@/components/StripeProducts";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl mb-6">Home aquí</h1>
      <ProductList></ProductList>
    </main>
  );
}
