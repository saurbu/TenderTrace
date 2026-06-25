import React, { useRef, useState } from "react";

const ComplaintModal = ({
  isOpen,
  onClose,
  onSubmit,
  tenderId,
  tenderName,
  itemType
}) => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const remaining = 4 - images.length;
    const selected = files.slice(0, remaining);

    const newImages = selected.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const formDataToSend = new FormData();

    formDataToSend.append("description", description);
    formDataToSend.append("itemId", tenderId);
    formDataToSend.append("itemTitle", tenderName);
    formDataToSend.append("itemType", itemType);

    images.forEach((img) => {
      formDataToSend.append("images", img.file);
    });

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints`, {
      method: "POST",
      body: formDataToSend,
    });

    const data = await res.json();
    console.log(data);

    setDescription("");
    setImages([]);

    onClose();
  } catch (error) {
    console.error("Submit error:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Submit Complaint
          </h2>

          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <textarea
            className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            rows={4}
            placeholder="Describe your issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Images (max 4)
            </label>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleAddClick}
              disabled={images.length >= 4}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50"
            >
              + Add Image
            </button>

            <p className="text-xs text-gray-500 mt-2">
              {images.length}/4 images selected
            </p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative group border rounded-lg overflow-hidden">
                  <img
                    src={img.url}
                    alt="preview"
                    className="h-32 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;