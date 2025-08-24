"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiTrendingUp, FiZap } from "react-icons/fi";
import { FaRupeeSign } from 'react-icons/fa';

<FaRupeeSign />


interface PredictionData {
  brand: string;
  model: string;
  category: string;
  condition: string;
  age_years: number;
  original_price: number;
  weight_kg: number;
  screen_size_inches?: number;
  storage_gb?: number;
  ram_gb?: number;
  processor_type?: string;
  has_accessories: boolean;
  body_type: string;
  recycle_possible: boolean;
  reuse_possible: boolean;
  running: boolean;
}

const PricePrediction: React.FC = () => {
  const [formData, setFormData] = useState<PredictionData>({
    brand: "",
    model: "",
    category: "",
    condition: "",
    age_years: 0,
    original_price: 0,
    weight_kg: 0,
    screen_size_inches: 0,
    storage_gb: 0,
    ram_gb: 0,
    processor_type: "",
    has_accessories: false,
    body_type: "",
    recycle_possible: true,
    reuse_possible: false,
    running: true,
  });

  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>("checking");

  React.useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch("https://scraply-price-prediction-model.onrender.com/health");
      if (response.ok) {
        setApiStatus("online");
      } else {
        setApiStatus("offline");
      }
    } catch (error) {
      setApiStatus("offline");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : 
               type === "number" ? (value === "" ? null : parseFloat(value) || 0) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = {
      brand: formData.brand,
      category: formData.category,
      condition: formData.condition,
      original_price: formData.original_price,
      age_years: formData.age_years,
      body_type: formData.body_type
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || (typeof value === 'number' && value <= 0))
      .map(([key]) => key.replace('_', ' '));

    if (missingFields.length > 0) {
      toast.error("Please fill out all required fields.");
      return;
    }

    if (apiStatus === "offline") {
      toast.error("Prediction service is currently offline. Please try again later.");
      return;
    }

    setLoading(true);

    const apiPayload = {
      Category: formData.category,
      Brand: formData.brand,
      Condition: formData.condition,
      BodyType: formData.body_type,
      ActualPrice: formData.original_price,
      RecyclePossible: formData.recycle_possible,
      ReusePossible: formData.reuse_possible,
      YearsUsed: formData.age_years,
      Running: formData.running,
    };

    try {
      const response = await fetch("https://scraply-price-prediction-model.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.predicted_price === 'number') {
          setPredictedPrice(Math.round(data.predicted_price));
        } else {
          throw new Error("Invalid prediction response");
        }
        toast.success("Price prediction successful!");
      } else {
        const errorData = await response.json();
        console.log("Server error details:", errorData);
        toast.error(`Prediction failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error predicting price:", error);
      if (error.name === 'AbortError') {
        toast.error("Request timed out. Please try again.");
      } else if (error.message.includes('fetch')) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("Failed to connect to prediction service. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const brands = ["Acer", "Anker", "Apple", "Asus", "Bosch", "Dell", "Generic", "Godrej", "HP", "Haier", "Hisense", "JBL", "LG", "Lenovo", "Logitech", "MI", "MSI", "Motorola", "Nokia", "OPPO", "OnePlus", "Panasonic", "Philips", "Realme", "Samsung", "Sharp", "Sony", "TCL", "Toshiba", "Vivo", "Vizio", "Whirlpool", "Xiaomi", "boAt"];
  const categories = ["Accessories", "Laptop", "Other", "Refrigerator", "Smartphone", "Television"];
  const conditions = ["Average", "Broken", "Excellent", "Good", "Poor"];
  const bodyTypes = ["Metal", "Mixed", "Plastic"];
  const processorTypes = ["Intel i3", "Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "ARM", "Snapdragon", "MediaTek"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <ToastContainer />
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center mb-4">
            <FaRupeeSign className="text-5xl text-indigo-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900">E-Waste Price Predictor</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get an accurate price estimate for your electronic devices using our AI-powered prediction model
          </p>
          
          {/* API Status Indicator */}
          <div className="mt-6 flex justify-center">
            <div className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              apiStatus === "online" ? "bg-green-100 text-green-800" :
              apiStatus === "offline" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                apiStatus === "online" ? "bg-green-500" :
                apiStatus === "offline" ? "bg-red-500" :
                "bg-yellow-500"
              }`}></div>
              Prediction Service: {apiStatus === "checking" ? "Checking..." : apiStatus}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FiZap className="mr-3 text-indigo-600" />
                Device Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., iPhone 13, MacBook Pro"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Condition</option>
                      {conditions.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      name="age_years"
                      value={formData.age_years}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="20"
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      name="weight_kg"
                      value={formData.weight_kg}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.1"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Body Type *
                    </label>
                    <select
                      name="body_type"
                      value={formData.body_type}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Body Type</option>
                      {bodyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Technical Specifications */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Technical Specifications (Optional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Screen Size (inches)
                      </label>
                      <input
                        type="number"
                        name="screen_size_inches"
                        value={formData.screen_size_inches}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage (GB)
                      </label>
                      <input
                        type="number"
                        name="storage_gb"
                        value={formData.storage_gb}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RAM (GB)
                      </label>
                      <input
                        type="number"
                        name="ram_gb"
                        value={formData.ram_gb}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Processor Type
                      </label>
                      <select
                        name="processor_type"
                        value={formData.processor_type}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select Processor</option>
                        {processorTypes.map(processor => (
                          <option key={processor} value={processor}>{processor}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="has_accessories"
                        checked={formData.has_accessories}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Includes original accessories (charger, box, etc.)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="recycle_possible"
                        checked={formData.recycle_possible}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Recycle Possible
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="reuse_possible"
                        checked={formData.reuse_possible}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Reuse Possible
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="running"
                        checked={formData.running}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Device is Running/Functional
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || apiStatus === "offline"}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Predicting Price...
                    </>
                  ) : (
                    <>
                      <FiTrendingUp className="mr-2" />
                      Predict Price
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaRupeeSign className="mr-3 text-green-600" />
                Price Prediction
              </h2>

              {predictedPrice !== null ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
                    <p className="text-sm text-gray-600 mb-2">Estimated Value</p>
                    <p className="text-4xl font-bold text-green-600">
                      ₹{predictedPrice.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Original Price:</span>
                      <span>₹{formData.original_price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Depreciation:</span>
                      <span className="text-red-600">
                        {((1 - predictedPrice / formData.original_price) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Condition:</span>
                      <span className="capitalize">{formData.condition}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 This is an estimated value based on current market conditions. 
                      Actual prices may vary depending on local demand and facility policies.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center text-gray-500">
                  <FaRupeeSign className="text-6xl mx-auto mb-4 opacity-30" />
                  <p>Fill out the form to get your price prediction</p>
                </div>
              )}

              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-gray-900">Why Choose Our Prediction?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    AI-powered accurate predictions
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Real-time market analysis
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Multiple factors considered
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Updated pricing models
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PricePrediction;