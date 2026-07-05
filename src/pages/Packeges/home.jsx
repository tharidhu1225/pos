import { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    packageName: "",
    price: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  // 🔄 Button loading states
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/package`
      );
      setPackages(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URI}/api/package/${editingId}`,
          form
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URI}/api/package`,
          form
        );
      }

      setForm({ packageName: "", price: "", description: "" });
      setEditingId(null);
      fetchPackages();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (pkg) => {
    setForm({
      packageName: pkg.packageName,
      price: pkg.price,
      description: pkg.description,
    });
    setEditingId(pkg._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    setDeletingId(id);

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/package/${id}`
      );
      fetchPackages();
    } catch (err) {
      console.log(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Package Management
        </h1>
        <p className="text-gray-400 text-sm">
          Create, update and manage photography packages
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
        <h2 className="text-lg font-semibold mb-4 text-white">
          {editingId ? "Update Package" : "Add New Package"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            name="packageName"
            placeholder="Package Name"
            value={form.packageName}
            onChange={handleChange}
            className="p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="p-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none"
          />

          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition py-3 rounded-xl font-semibold"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <FiPlus />
                {editingId ? "Update Package" : "Add Package"}
              </>
            )}
          </button>
        </form>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-gray-400">Loading packages...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:scale-[1.02] transition"
            >
              <h3 className="text-xl font-bold text-white">
                {pkg.packageName}
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                {pkg.description || "No description"}
              </p>

              <h2 className="text-2xl font-bold text-green-400 mt-3">
                Rs. {pkg.price}
              </h2>

              <div className="flex gap-3 mt-5">

                {/* EDIT */}
                <button
                  onClick={() => handleEdit(pkg)}
                  disabled={deletingId}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg disabled:opacity-50"
                >
                  <FiEdit /> Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() => handleDelete(pkg._id)}
                  disabled={deletingId === pkg._id}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg disabled:opacity-50"
                >
                  {deletingId === pkg._id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 /> Delete
                    </>
                  )}
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}