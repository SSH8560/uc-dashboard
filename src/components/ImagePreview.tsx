import React, { useEffect, useState } from "react";
import Image from "next/image";

const ImagePreview = ({ file }: { file: File }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  if (!file || !imageUrl) {
    return null;
  }

  return <Image src={imageUrl} alt="Image Preview" width={60} height={60} />;
};

export default ImagePreview;
