"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={images[selectedImage]}
        width={1000}
        height={1000}
        alt="Product Image"
        className="min-h-[300px] object-cover object-center "
      />

      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            className={cn(
              "border mr-2 cursor-pointer hover:border-green-600",
              selectedImage === index && "  border-green-500"
            )}
            onClick={() => setSelectedImage(index)}
          >
            <Image src={image} alt={"image"} width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
