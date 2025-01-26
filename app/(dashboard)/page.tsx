import { getProducts } from "@/actions/product";
import ProductList from "@/components/shared/product/ProductList";
import sampleData from "@/db/sample-data";
import { Product } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

const HomePage = async () => {
  const products = await getProducts() as Product[];

  return (
    <>
      <ProductList data={products} title="Featured Product" limit={4} />
    </>
  );
};

export default HomePage;
