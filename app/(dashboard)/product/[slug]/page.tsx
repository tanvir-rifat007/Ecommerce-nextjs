import { getMyCart } from "@/actions/cart";
import { getProductBySlug, getProducts } from "@/actions/product";
import { auth } from "@/auth";
import AddToCart from "@/components/shared/product/addToCart";
import ProductImages from "@/components/shared/product/ProductImages";
import ProductPrice from "@/components/shared/product/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

const ProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const cart = await getMyCart();

  // console.log(cart);

  const newCart = {
    ...cart,
    itemsPrice: String(cart?.itemsPrice),
    shippingPrice: String(cart?.shippingPrice),
    taxPrice: String(cart?.taxPrice),
    totalPrice: String(cart?.totalPrice),
  };

  // console.log("newCart", newCart);

  if (!product) {
    return notFound();
  }

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Images Column */}
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>

          {/* Details Column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {String(product.rating)} of {product.numReviews} reviews
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProductPrice
                  value={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p>Description:</p>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Action Column */}
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In stock</Badge>
                  ) : (
                    <Badge variant="destructive">Unavailable</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className=" flex-center">
                    <AddToCart
                      cart={newCart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        price: String(product.price),
                        slug: product.slug,
                        image: product.images[0],
                        qty: 1,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
