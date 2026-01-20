"use client";

import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RiCloseLargeLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { FiMaximize2 } from "react-icons/fi";
import Image from "next/image";

export default function UploadProductModal({ open, setOpen, onSuccess }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // multiple files
  const [files, setFiles] = useState([]); // [{ file, previewUrl }]
  const [loading, setLoading] = useState(false);

  // image viewer modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  if (!open) return null;

  function openImage(index) {
    setActiveImageIndex(index);
    setShowImageModal(true);
  }

  function closeImage() {
    setShowImageModal(false);
    setActiveImageIndex(null);
  }

  // Add more images (append mode)
  function handleFilesChange(e) {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const maxSize = 5 * 1024 * 1024; // 5MB per image

    const newItems = [];

    for (let f of selectedFiles) {
      if (!f.type.startsWith("image/")) {
        alert("Only images are allowed!");
        continue;
      }

      if (f.size > maxSize) {
        alert(`${f.name} is too large. Max 5MB allowed.`);
        continue;
      }

      newItems.push({
        file: f,
        previewUrl: URL.createObjectURL(f),
      });
    }

    // Append new images
    setFiles((prev) => [...prev, ...newItems]);

    // IMPORTANT: reset input value so user can re-select same file again
    e.target.value = "";
  }

  function removeImage(index) {
    setFiles((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });

    // If user removed currently open image
    if (activeImageIndex === index) closeImage();
  }

  function clearAllImages() {
    files.forEach((x) => URL.revokeObjectURL(x.previewUrl));
    setFiles([]);
    closeImage();
  }

  async function handleUpload() {
    try {
      if (!name || !price || !description || files.length === 0) {
        alert("All fields + at least 1 image are required!");
        return;
      }

      setLoading(true);

      // 1) Upload all images to S3 and collect filenames
      const uploadedFilenames = [];

      for (let item of files) {
        const file = item.file;

        const mime = file.type.split("/")[1]; // e.g., image/png => png
        // Get presigned URL
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/get-presigned-url`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mime,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not get presigned URL");
        }

        // console.log(data, "data:-");

        if (!data.filename) {
          throw new Error("Invalid presigned URL response (missing filename)");
        }

        uploadedFilenames.push(data.filename);

        // Upload to S3

        const uploadRes = await fetch(data.url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error("S3 Upload failed");
        }
      }

      // 2) Save product in DB (store array of filenames)
      const saveRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            price,
            description,
            filenames: uploadedFilenames,
          }),
        },
      );

      // const saveData = await saveRes.json();
      // if (!saveRes.ok) throw new Error(saveData.message || "Save failed");
      if (!saveRes.ok) {
        const text = await saveRes.text();
        throw new Error(text || "Product save failed");
      }

      const saveData = await saveRes.json();
      alert("Product uploaded successfully!");
      onSuccess();

      // reset
      setName("");
      setPrice("");
      setDescription("");
      clearAllImages();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const activeImage =
    activeImageIndex !== null ? files[activeImageIndex] : null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upload Product</h3>

            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-zinc-800 px-3 py-1 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-red-500"
            >
              <RiCloseLargeLine />
            </button>
          </div>

          {/* Form */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <input
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none"
                placeholder="Price"
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />

              <textarea
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none resize-none scrollbar-hide"
                placeholder="Description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <button
                disabled={loading}
                onClick={handleUpload}
                className="w-full rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Upload Product"}
              </button>
            </div>

            {/* Images Section */}
            <div className="space-y-3">
              <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400 hover:bg-zinc-800">
                <IoCloudUploadOutline size={22} />
                <p className="text-center">Click to select images to upload.</p>

                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                />
              </label>

              {files.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-300">
                    Selected:{" "}
                    <span className="font-semibold">{files.length}</span>
                  </p>

                  <button
                    onClick={clearAllImages}
                    className="rounded-lg border border-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-red-400"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Preview Grid */}
              {files.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {files.map((item, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
                    >
                      <button
                        type="button"
                        onClick={() => openImage(index)}
                        className="block w-full"
                      >
                        <Image
                          width={400}
                          height={300}
                          loading="eager"
                          src={item.previewUrl}
                          alt={`preview-${index}`}
                          className="h-24 w-full object-cover"
                        />
                      </button>

                      {/* Actions */}
                      <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => openImage(index)}
                          className="rounded-lg bg-black/60 p-2 text-zinc-200 hover:bg-black/80"
                          title="View"
                        >
                          <FiMaximize2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="rounded-lg bg-black/60 p-2 text-zinc-200 hover:bg-black/80 hover:text-red-400"
                          title="Remove"
                        >
                          <MdDeleteOutline size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No images selected yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Viewer Modal */}
      {showImageModal && activeImage && (
        <div
          onClick={closeImage}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <p className="text-sm text-zinc-300 truncate">
                {activeImage.file.name}
              </p>

              <button
                onClick={closeImage}
                className="rounded-lg border border-zinc-800 px-3 py-1 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-red-500"
              >
                <RiCloseLargeLine />
              </button>
            </div>

            <div className="bg-black">
              <Image
                src={activeImage.previewUrl}
                loading="eager"
                alt="Full Preview"
                width={800}
                height={600}
                className="max-h-[75vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
