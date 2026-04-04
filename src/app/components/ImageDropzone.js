"use client";

import { cn } from "@src/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@src/lib/utils";
import { BiImageAdd } from "react-icons/bi";
import { toast } from "sonner";
import { Button } from "@src/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegFilePdf } from "react-icons/fa";

const ImageDropzone = ({
  className,
  onFileSelect,
  isNewProfilePic = false,
  setProfilImage,
  hideConfirmButton = false,
  isPdfOnly = false,
  isAdmin = false
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropAreaPixels, setCropAreaPixels] = useState(null);

  const [isSavingCrop, setIsSavingCrop] = useState(false);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  const handleCropComplete = (_, pixels) => {
    setCropAreaPixels(pixels);
  };

  // ========= FILE HANDLING =========
  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";

    if ((isImage && isPdfOnly) || (isPDF && !isPdfOnly) || (!isImage && !isPDF)) {
      toast.error("Formatul documentului este gresit");
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview({
      url,
      type: isImage ? "image" : "pdf",
    });

    onFileSelect?.(file);
  };

  // ========= SAVE CROP (IMAGES ONLY) =========
  const saveCroppedImage = async () => {
    if (!preview || preview.type !== "image") return;

    try {
      setIsSavingCrop(true);

      const croppedBlob = await getCroppedImg(
        preview.url,
        cropAreaPixels
      );

      const croppedFile = new File([croppedBlob], "profile.jpg", {
        type: "image/jpeg",
      });

      const newUrl = URL.createObjectURL(croppedFile);

      setPreview({
        url: newUrl,
        type: "image",
      });

      onFileSelect?.(croppedFile);

      return croppedFile;
    } catch (err) {
      console.error("Crop error:", err);
      toast.error("Eroare la decupare");
    } finally {
      setIsSavingCrop(false);
      setIsConfirmDisabled(false)
    }
  };

  // ========= CONFIRM =========
  const handleConfirm = async () => {
    setIsConfirmDisabled(true);
    setIsSavingCrop()

    if (preview?.type === "image" && isNewProfilePic) {
      const croppedFile = await saveCroppedImage();
      if (croppedFile) {
        setProfilImage?.(croppedFile);
      }
    } else {
      // PDF or normal image (no crop)
      setProfilImage?.();
    }
  };

  // ========= REMOVE =========
  const removeFile = () => {
    setPreview(null);
    onFileSelect?.(null);
    if (inputRef.current) inputRef.current.value = "";
    setIsConfirmDisabled(false);
  };

  return (
    <>
      {preview && isNewProfilePic && preview.type === "image" && (
        <span className="block mb-2 text-lg">
          Selectează zona dorită
        </span>
      )}

      <div
        className={cn(
          className,
          !preview && "cursor-pointer",
          "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition relative group"
        )}
        onClick={() => !preview && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        {preview && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        )}

        {/* ========= IMAGE + CROP ========= */}
        {preview?.type === "image" && isNewProfilePic ? (
          <div className="relative w-72 h-72 rounded-full overflow-hidden">
            <Cropper
              image={preview.url}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={handleCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        ) : preview?.type === "image" ? (
          <Image
            src={preview.url}
            alt="preview"
            width={300}
            height={300}
            className="object-cover rounded-xl"
          />
        ) : preview?.type === "pdf" ? (
          <div className="flex flex-col items-center gap-4">
            {/* <FaRegFilePdf size={96} className="text-red-500" /> */}
            <iframe
              src={preview.url}
              className="w-full h-120 rounded-lg border"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            <span className="text-gray-500 opacity-50 text-4xl text-center select-none">
              Ataseaza {isPdfOnly ? "PDF-ul" : "imaginea"}
            </span>
            {!isPdfOnly ? (
              <BiImageAdd size={128} className="opacity-50" />
            ) : (
              <FaRegFilePdf size={128} className="opacity-50" />  
            )}
          </div>
        )}

        {/* SAVE CROP */}
        {preview?.type === "image" && isNewProfilePic && (
          <Button
            disabled={isSavingCrop}
            onClick={(e) => {
              e.stopPropagation();
              saveCroppedImage();
            }}
            className="mt-4"
          >
            Salvează decupajul
          </Button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={!isPdfOnly ? "image/*" : "application/pdf"}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* CONFIRM */}
      {isNewProfilePic && !hideConfirmButton && (
        <Button
          disabled={isConfirmDisabled}
          onClick={handleConfirm}
          className={cn("mt-4 bg-[var(--color-primary)]", isAdmin && "bg-black!")}
        >
          {isSavingCrop ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            "Confirmă"
          )}
        </Button>
      )}
    </>
  );
};

export default ImageDropzone;