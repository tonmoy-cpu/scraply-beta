"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiMousePointer,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Popup {
  _id: string;
  title: string;
  content: string;
  detailContent: string;
  isActive: boolean;
  frequency: number;
  priority: number;
  targetPages: string[];
  viewCount: number;
  clickCount: number;
  createdAt: string;
}

const PopupManagement: React.FC = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    detailContent: "",
    isActive: true,
    frequency: 24,
    priority: 1,
    targetPages: ["all"],
  });

  // 🔑 Get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/v1/popups/admin/all", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPopups(data.data || []);
      } else {
        toast.error("Failed to fetch popups (unauthorized?)");
      }
    } catch (error) {
      console.error("Error fetching popups:", error);
      toast.error("Failed to fetch popups");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getToken();
      const url = editingPopup
        ? `http://localhost:5000/api/v1/popups/${editingPopup._id}`
        : "http://localhost:5000/api/v1/popups";

      const method = editingPopup ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          `Popup ${editingPopup ? "updated" : "created"} successfully!`
        );
        setShowModal(false);
        setEditingPopup(null);
        resetForm();
        fetchPopups();
      } else {
        toast.error("Failed to save popup (unauthorized?)");
      }
    } catch (error) {
      console.error("Error saving popup:", error);
      toast.error("Failed to save popup");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this popup?")) return;

    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:5000/api/v1/popups/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (response.ok) {
        toast.success("Popup deleted successfully!");
        fetchPopups();
      } else {
        toast.error("Failed to delete popup (unauthorized?)");
      }
    } catch (error) {
      console.error("Error deleting popup:", error);
      toast.error("Failed to delete popup");
    }
  };

  const toggleActive = async (popup: Popup) => {
    try {
      const token = getToken();
      const response = await fetch(
        `http://localhost:5000/api/v1/popups/${popup._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ ...popup, isActive: !popup.isActive }),
        }
      );

      if (response.ok) {
        toast.success(
          `Popup ${!popup.isActive ? "activated" : "deactivated"}!`
        );
        fetchPopups();
      } else {
        toast.error("Failed to update popup status (unauthorized?)");
      }
    } catch (error) {
      console.error("Error updating popup:", error);
      toast.error("Failed to update popup status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      detailContent: "",
      isActive: true,
      frequency: 24,
      priority: 1,
      targetPages: ["all"],
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleTargetPagesChange = (page: string) => {
    setFormData((prev) => ({
      ...prev,
      targetPages: prev.targetPages.includes(page)
        ? prev.targetPages.filter((p) => p !== page)
        : [...prev.targetPages, page],
    }));
  };

  if (loading && popups.length === 0) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <div className="loading-text">Loading popups...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ToastContainer />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Educational Popups</h1>
        <button
          onClick={() => {
            setEditingPopup(null);
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Popup
        </button>
      </div>

      {/* Popups List */}
      <div className="grid grid-cols-1 gap-6">
        {popups.map((popup) => (
          <motion.div
            key={popup._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {popup.title}
                  </h3>
                  <button
                    onClick={() => toggleActive(popup)}
                    className={`ml-3 ${
                      popup.isActive ? "text-green-500" : "text-gray-400"
                    }`}
                  >
                    {popup.isActive ? (
                      <FiToggleRight size={24} />
                    ) : (
                      <FiToggleLeft size={24} />
                    )}
                  </button>
                </div>
                <p className="text-gray-600 mb-3">{popup.content}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiEye className="mr-1" />
                    {popup.viewCount} views
                  </div>
                  <div className="flex items-center">
                    <FiMousePointer className="mr-1" />
                    {popup.clickCount} clicks
                  </div>
                  <div>Priority: {popup.priority}</div>
                  <div>Frequency: {popup.frequency}h</div>
                  <div>Pages: {popup.targetPages.join(", ")}</div>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(popup)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(popup._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Created: {new Date(popup.createdAt).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingPopup ? "Edit Popup" : "Create New Popup"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Content (Optional)
                  </label>
                  <textarea
                    name="detailContent"
                    value={formData.detailContent}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="This content will be shown on the detail page..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority (1-10)
                    </label>
                    <input
                      type="number"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency (hours)
                    </label>
                    <input
                      type="number"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      min="1"
                      max="168"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Pages
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {["all", "home", "recycle", "facilities", "education"].map(
                      (page) => (
                        <label key={page} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.targetPages.includes(page)}
                            onChange={() => handleTargetPagesChange(page)}
                            className="mr-2"
                          />
                          <span className="capitalize">{page}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : editingPopup
                      ? "Update"
                      : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PopupManagement;
