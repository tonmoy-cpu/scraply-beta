"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiMapPin } from "react-icons/fi";
import { getUserID, isAuthenticated } from "../sign-in/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Booking {
  _id: string;
  recycleItem: string;
  recycleItemPrice: number;
  facility: string;
  pickupDate: string;
  pickupTime: string;
  fullName: string;
  address: string;
  bookStatus: string;
  createdAt: string;
}

const TrackingPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserBookings();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserBookings = async () => {
    try {
      const userId = getUserID();
      if (!userId) {
        toast.error("User not found. Please login again.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/v1/booking/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.data || []);
      } else {
        toast.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "in-progress":
        return <FiTruck className="text-blue-500" />;
      case "completed":
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "pending":
        return 25;
      case "in-progress":
        return 75;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-xl shadow-lg"
        >
          <FiPackage className="text-6xl text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">Please login to track your pickups.</p>
          <a href="/sign-in" className="btn btn-primary">
            Login
          </a>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <div className="loading-text">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <ToastContainer />
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Pickups</h1>
          <p className="text-xl text-gray-600">
            Monitor the status of your e-waste recycling bookings
          </p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 bg-white rounded-xl shadow-lg"
          >
            <FiPackage className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Bookings Found</h2>
            <p className="text-gray-600 mb-6">You haven't made any recycling bookings yet.</p>
            <a href="/recycle" className="btn btn-primary">
              Book a Pickup
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bookings List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Bookings</h2>
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                    selectedBooking?._id === booking._id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(booking.bookStatus)}
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.recycleItem}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Booking ID: {booking._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.bookStatus)}`}>
                      {booking.bookStatus.replace("-", " ").toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Pickup Date:</span>
                      <span>{new Date(booking.pickupDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Facility:</span>
                      <span className="truncate ml-2">{booking.facility}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Value:</span>
                      <span className="font-semibold text-green-600">₹{booking.recycleItemPrice}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{getProgressPercentage(booking.bookStatus)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(booking.bookStatus)}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detailed View */}
            <div className="lg:sticky lg:top-8">
              {selectedBooking ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <div className="flex items-center mb-6">
                    {getStatusIcon(selectedBooking.bookStatus)}
                    <div className="ml-3">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedBooking.recycleItem}
                      </h2>
                      <p className="text-gray-600">
                        Booking ID: {selectedBooking._id.slice(-8)}
                      </p>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Timeline</h3>
                    <div className="space-y-4">
                      <div className={`flex items-center ${
                        ["pending", "in-progress", "completed"].includes(selectedBooking.bookStatus) 
                          ? "text-green-600" : "text-gray-400"
                      }`}>
                        <FiCheckCircle className="mr-3" />
                        <span>Booking Confirmed</span>
                      </div>
                      <div className={`flex items-center ${
                        ["in-progress", "completed"].includes(selectedBooking.bookStatus) 
                          ? "text-green-600" : "text-gray-400"
                      }`}>
                        <FiTruck className="mr-3" />
                        <span>Pickup In Progress</span>
                      </div>
                      <div className={`flex items-center ${
                        selectedBooking.bookStatus === "completed" 
                          ? "text-green-600" : "text-gray-400"
                      }`}>
                        <FiCheckCircle className="mr-3" />
                        <span>Pickup Completed</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Customer:</span>
                        <p className="font-medium">{selectedBooking.fullName}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Value:</span>
                        <p className="font-medium text-green-600">₹{selectedBooking.recycleItemPrice}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Pickup Date:</span>
                        <p className="font-medium">
                          {new Date(selectedBooking.pickupDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Pickup Time:</span>
                        <p className="font-medium">{selectedBooking.pickupTime}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-600">Pickup Address:</span>
                      <p className="font-medium flex items-start mt-1">
                        <FiMapPin className="mr-2 mt-1 text-gray-400" />
                        {selectedBooking.address}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-600">Facility:</span>
                      <p className="font-medium">{selectedBooking.facility}</p>
                    </div>

                    <div>
                      <span className="text-gray-600">Booked On:</span>
                      <p className="font-medium">
                        {new Date(selectedBooking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 space-y-3">
                    {selectedBooking.bookStatus === "completed" && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <FiCheckCircle className="text-green-500 mr-3" />
                          <div>
                            <p className="font-medium text-green-800">Pickup Completed!</p>
                            <p className="text-sm text-green-600">
                              Your e-waste has been successfully collected and will be recycled responsibly.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => window.print()}
                      className="w-full btn btn-secondary"
                    >
                      Print Booking Details
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <FiPackage className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Booking
                  </h3>
                  <p className="text-gray-600">
                    Click on a booking from the list to view detailed information
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;