import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MaterialDashboardPanel = () => {
  const { id: tenderId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const todayDate = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    total: 0,
    images: {
      product: null,
      bill: null,
      barcode: null,
    },
  });

  const calculateItemTotal = (price, quantity) =>
    (Number(price) || 0) * (Number(quantity) || 0);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      total: calculateItemTotal(form.price, form.quantity),
    }));
  }, [form.price, form.quantity]);

  useEffect(() => {
    const fetchToday = async () => {
      try {
       const { id: tenderId } = useParams();

        const res = await fetch(
          `http://localhost:5000/api/materials/single/${tenderId}/${todayDate}`
        );

        const data = await res.json();

        if (data?.data?.materials) {
          setMaterials(data.data.materials);
        }
      } catch (err) {
        console.log("No previous data");
      }
    };

    if (tenderId) fetchToday();
  }, [tenderId]);

  const handleImage = async (e, type) => {
  const file = e.target.files[0];
  if (!file) return;

  const url = await uploadToImageKit(file);

  setForm((prev) => ({
    ...prev,
    images: {
      ...prev.images,
      [type]: url,
    },
  }));
};

  const removeImage = (type) => {
    setForm((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [type]: null,
      },
    }));
  };
  // image kit 

 const uploadToImageKit = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("http://localhost:5000/api/images/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.url;
};
  const addMaterial = () => {
  if (isLocked) return;

  if (!form.name) return;

  setMaterials((prev) => [...prev, form]);

  setForm({
    name: "",
    price: "",
    quantity: "",
    total: 0,
    images: { product: null, bill: null, barcode: null },
  });

  setShowModal(false);
}; 

  const getFinalTotal = () =>
    materials.reduce((sum, m) => sum + (Number(m.total) || 0), 0);

  const handleSubmitToday = async () => {
  if (isLocked) return;

  const payload = {
    date: todayDate,
    materials,
    totalSpend: getFinalTotal(),
    tenderId,
  };

  const res = await fetch("http://localhost:5000/api/materials/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  setIsLocked(true);
};
  const saveDraft = async () => {
  await fetch("http://localhost:5000/api/materials/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tenderId,
      date: todayDate,
      materials,
      totalSpend: getFinalTotal(),
    }),
  });
};
  useEffect(() => {
  if (!tenderId || materials.length === 0) return;

  const timeout = setTimeout(() => {
    saveDraft();
  }, 800);

  return () => clearTimeout(timeout);
}, [materials]);

useEffect(() => {
  const fetchData = async () => {
    const res = await fetch(
      `http://localhost:5000/api/materials/single/${tenderId}/${todayDate}`
    );

    const data = await res.json();

    if (data?.data) {
      setMaterials(data.data.materials || []);

      if (data.data._id) {
        setIsLocked(true); 
      }
    }
  };

  fetchData();
}, [tenderId, todayDate]);
  if (isSubmitted) {
    return (
      <div className="h-screen flex flex-col bg-white p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600">
            ✔ Submitted Successfully
          </h2>
          <p className="text-gray-500 mt-1">Date: {todayDate}</p>
          <p className="text-blue-600 font-bold mt-2">
            Total Spend: ₹{getFinalTotal()}
          </p>
        </div>

        <div className="mt-6 overflow-y-auto flex-1 space-y-3 pr-2">
          {materials.map((m, i) => (
            <div key={i} className="border p-3 rounded-xl">
              <p className="font-bold">{m.name}</p>
              <p className="text-sm text-gray-600">
                ₹{m.price} × {m.quantity} = ₹{m.total}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white rounded-2xl shadow-2xl">

      <div className="px-6 py-4 flex justify-between items-center shadow">
        <div>
          <h2 className="text-xl font-bold">Material Dashboard</h2>
          <p className="text-sm text-gray-500">
            Date: <span className="font-semibold">{todayDate}</span>
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold"
        >
          + Add Material
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {materials.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            No materials added yet
          </div>
        )}

        {materials.map((m, i) => (
          <div
            key={i}
            className="bg-white border rounded-2xl p-4 flex justify-between hover:shadow-md transition"
          >
            <div>
              <h3 className="font-bold text-lg">{m.name}</h3>
              <p className="text-sm text-gray-500">
                ₹{m.price} × {m.quantity} ={" "}
                <span className="font-bold text-green-600">
                  ₹{m.total}
                </span>
              </p>

              <div className="flex gap-2 mt-3">
                <img className="w-12 h-12 rounded object-cover" src={m.images.product} />
                <img className="w-12 h-12 rounded object-cover" src={m.images.bill} />
                <img className="w-12 h-12 rounded object-cover" src={m.images.barcode} />
              </div>
            </div>
          </div>
        ))}

      </div>

      {materials.length > 0 && (
        <div className="border-t p-4 space-y-3">

          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Spend Today</span>
            <span className="text-2xl font-bold text-blue-600">
              ₹{getFinalTotal()}
            </span>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={isLocked}
            className={`w-full py-3 rounded-xl font-bold text-white ${
              isLocked ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLocked ? "Already Submitted" : "Submit Today's Details"}
</button>

        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-3xl w-full max-w-lg p-6">

            <h2 className="text-xl font-bold mb-4">Add Material</h2>

            <input
              className="w-full border p-3 rounded-xl mb-3"
              placeholder="Material Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                className="border p-3 rounded-xl"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />

              <input
                type="number"
                className="border p-3 rounded-xl"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />
            </div>
            <div className="mt-3 bg-gray-100 p-3 rounded-xl text-center">
              <p className="text-xs text-gray-500">Item Total</p>
              <p className="text-lg font-bold text-green-600">
                ₹{form.total}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">

              {["product", "bill", "barcode"].map((type) => (
                <div key={type} className="text-center">

                  {!form.images[type] ? (
                    <label className="border-2 border-dashed p-3 rounded-xl block cursor-pointer text-xs">
                      Upload {type}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleImage(e, type)}
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={form.images[type]}
                        className="w-full h-20 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removeImage(type)}
                        className="absolute top-1 right-1 bg-black text-white text-xs px-2 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                </div>
              ))}

            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={addMaterial}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl"
              >
                Add
              </button>
            </div>

          </div>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md">

            <h2 className="text-xl font-bold text-red-600">
              Confirm Submission
            </h2>

            <p className="text-gray-600 mt-2">
              After submitting, you cannot edit or add materials for today.
            </p>

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleSubmitToday();
                  setIsLocked(true);
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl"
              >
                Submit Final
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MaterialDashboardPanel;