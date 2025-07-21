"use client";

import { ChangeEvent, useRef } from "react";
import { AddAPhoto } from "@mui/icons-material";

export interface ImageUploadProps {
  id: string;
  onInputChange: any;
  imagePreview: string;
}

const ImagesUpload: React.FC<ImageUploadProps> = ({
  id,
  onInputChange,
  imagePreview,
}) => {
  const inputImageRef = useRef<HTMLInputElement>(null);
  let isValid: boolean = false;

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes("image")) {
      alert("Please upload an image!");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;
      isValid = true;
      onInputChange(id, result, isValid);
    };
  };

  function handleImageUpload() {
    inputImageRef.current?.click();
  }

  return (
    <div className="flex justify-center items-center">
      <input
        id="image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleChangeImage(e)}
        ref={inputImageRef}
      />
      {!imagePreview && (
        <div
          className="w-36 h-36 bg-blue-700 rounded-full cursor-pointer flex flex-col gap-3 justify-center items-center"
          onClick={handleImageUpload}
        >
          <div>
            <AddAPhoto style={{ color: "#fff" }} />
          </div>
          <div>
            <h2 className="uppercase text-xs text-white font-bold">Upload</h2>
          </div>
        </div>
      )}
      {imagePreview && (
        <img
          src={imagePreview || ""}
          alt="image"
          className="w-36 h-36 object-cover rounded-full"
          onClick={handleImageUpload}
        />
      )}
    </div>
  );
};

export default ImagesUpload;
