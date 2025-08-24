"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminDashboard from "./AdminDashboard";
import { getUser } from "../sign-in/auth";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (user && user.role === "admin") {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <div className="loading-text">Checking permissions...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-xl shadow-lg"
        >
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <a href="/" className="btn btn-primary">
            Go Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="md:mt-20 mt-16 pt-8">
        <AdminDashboard />
      </div>
    </motion.div>
  );
};

export default AdminPage;