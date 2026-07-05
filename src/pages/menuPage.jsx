import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import LoadingScreen from "../component/loadingEffect";

export default function MenuPage() {
  const API = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [availabilityLoading, setAvailabilityLoading] = useState(null);

  // FETCH MENU
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/menu`);
      setMenuItems(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/menu/${id}`);
      toast.success("Deleted successfully");
      fetchMenu();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };
  
  const handleAvailability = async (id, value) => {
  try {
    setAvailabilityLoading(id);

    await axios.put(
      `${API}/api/menu/${id}/availability`,
      {
        isAvailable: value,
      }
    );

    setMenuItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, isAvailable: value }
          : item
      )
    );

    toast.success("Availability Updated");
  } catch (err) {
    console.log(err);
    toast.error("Update Failed");
  } finally {
    setAvailabilityLoading(null);
  }
};

  // SAFE PRICE EXTRACTOR (🔥 MAIN FIX)
  const getPrice = (priceObj) => {
    if (!priceObj) return 0;

    if (typeof priceObj === "object") {
      return Number(
        priceObj.discountedPrice ??
        priceObj.originalPrice ??
        0
      );
    }

    return Number(priceObj) || 0;
  };

  const filtered = menuItems.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  

  return (

<div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl">
  <table className="w-full text-left">
    <thead className="bg-yellow-500 text-black">
      <tr>
        <th className="p-3">Image</th>
        <th className="p-3">Title</th>
        <th className="p-3">Category</th>
        <th className="p-3">Price</th>
        <th className="p-3">Special</th>
        <th className="p-3">Available</th>
        <th className="p-3">Action</th>
      </tr>
    </thead>

    <tbody>
      {filtered.map((item) => {
        const prices = item.prices || {};

        const originalPrice = getPrice(
          prices.large?.originalPrice ??
          prices.large
        );

        return (
          <tr
            key={item._id}
            className="border-b border-white/10 hover:bg-white/5"
          >
            <td className="p-3">
              <img
                src={item.images?.[0]}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </td>

            <td className="p-3 font-semibold">
              {item.title}
            </td>

            <td className="p-3">
              {item.category?.Cat}
            </td>

            <td className="p-3 text-yellow-400 font-bold">
              Rs.{originalPrice}
            </td>

            <td className="p-3">
              {item.isSpecial ? (
                <span className="text-yellow-400">
                  ⭐ Yes
                </span>
              ) : (
                <span className="text-gray-400">
                  No
                </span>
              )}
            </td>

            <td className="p-3">
  {availabilityLoading === item._id ? (
    <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
  ) : (
    <input
      type="checkbox"
      checked={item.isAvailable}
      onChange={(e) =>
        handleAvailability(
          item._id,
          e.target.checked
        )
      }
      className="w-5 h-5 accent-green-500 cursor-pointer"
    />
  )}
</td>

            <td className="p-3">
              <button
                onClick={() =>
                  handleDelete(item._id)
                }
                className="bg-red-500/20 text-red-400 px-3 py-2 rounded-lg"
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

  );
}