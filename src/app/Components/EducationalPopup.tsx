"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiBookOpen, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

interface PopupData {
  _id: string;
  title: string;
  content: string;
  detailContent: string;
  frequency: number; // hours between repeats
}

interface EducationalPopupProps {
  currentPage?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const EducationalPopup: React.FC<EducationalPopupProps> = ({ currentPage = "all" }) => {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);


  useEffect(() => {
    let mounted = true;

    const checkAndShowPopup = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/popups/active?page=${currentPage}`);
        if (!response.ok) return;

        const data = await response.json();
        if (data.success && data.data.length > 0) {
          const popupData: PopupData = data.data[0];
          const storageKey = `popup_last_shown_${popupData._id}`;
          const lastShown = localStorage.getItem(storageKey);
          const now = Date.now();

          // frequency logic
          if (lastShown) {
            const hoursElapsed = (now - parseInt(lastShown)) / (1000 * 60 * 60);
            if (hoursElapsed < (popupData.frequency || 24)) return;
          }

          if (mounted) {
            setPopup(popupData);
            setTimeout(() => {
              setIsVisible(true);
              trackView(popupData._id);
            }, 1000);
            localStorage.setItem(storageKey, now.toString());
          }
        }
      } catch (err) {
        console.error("Error fetching popup:", err);
      }
    };

    checkAndShowPopup();
    return () => { mounted = false };
  }, [currentPage]);

  const trackView = async (popupId: string) => {
    try {
      await fetch(`${API_BASE}/api/v1/popups/${popupId}/view`, { method: "POST" });
    } catch (err) {
      console.error("Error tracking popup view:", err);
    }
  };

  const trackClick = async (popupId: string) => {
    try {
      await fetch(`${API_BASE}/api/v1/popups/${popupId}/click`, { method: "POST" });
    } catch (err) {
      console.error("Error tracking popup click:", err);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setPopup(null), 300);
  };

  const handleLearnMore = async () => {
    if (popup) {
      await trackClick(popup._id);
      handleClose();
    }
  };

  if (!popup) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <FiX size={24} />
              </button>
              <div className="flex items-center mb-2">
                <FiBookOpen className="mr-3 text-2xl" />
                <span className="text-sm font-medium opacity-90">Educational Tip</span>
              </div>
              <h2 className="text-xl font-bold leading-tight">{popup.title}</h2>
            </div>

            {/* Content */}
            {/* Content */}
<div className="p-6">
  <p className="text-gray-700 leading-relaxed mb-3">
    {isExpanded
      ? popup.content
      : popup.content.length > 50
        ? popup.content.slice(0, 50) + "..."
        : popup.content}
  </p>

  {popup.content.length > 50 && (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className="text-emerald-600 hover:underline text-sm mb-4"
    >
      {isExpanded ? "Show less" : "Read more"}
    </button>
  )}

  <div className="flex flex-col sm:flex-row gap-3">
    <button
      onClick={handleClose}
      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
    >
      Got it
    </button>
    {popup.detailContent && (
      <Link
        href={`/education/popup/${popup._id}`}
        onClick={handleLearnMore}
        className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center justify-center"
      >
        Learn More <FiArrowRight className="ml-2" />
      </Link>
    )}
  </div>
</div>
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EducationalPopup;
