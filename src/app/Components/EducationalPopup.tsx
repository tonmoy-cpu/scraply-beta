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
  frequency: number;
}

interface EducationalPopupProps {
  currentPage?: string;
}

const EducationalPopup: React.FC<EducationalPopupProps> = ({ currentPage = 'all' }) => {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAndShowPopup();
  }, [currentPage]);

  const checkAndShowPopup = async () => {
    try {
      // Check if we should show a popup based on last shown time
      const lastShown = localStorage.getItem(`popup_last_shown_${currentPage}`);
      const now = Date.now();
      
      if (lastShown) {
        const timeSinceLastShown = now - parseInt(lastShown);
        const hoursElapsed = timeSinceLastShown / (1000 * 60 * 60);
        
        // Don't show popup if shown recently (default 24 hours)
        if (hoursElapsed < 24) {
          setIsLoading(false);
          return;
        }
      }

      // Fetch active popup for current page
      const response = await fetch(`http://localhost:5000/api/v1/popups/active?page=${currentPage}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          const popupData = data.data[0];
          setPopup(popupData);
          
          // Show popup after a short delay
          setTimeout(() => {
            setIsVisible(true);
            trackView(popupData._id);
          }, 2000);

          // Store last shown time
          localStorage.setItem(`popup_last_shown_${currentPage}`, now.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching popup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const trackView = async (popupId: string) => {
    try {
      await fetch(`http://localhost:5000/api/v1/popups/${popupId}/view`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error tracking popup view:', error);
    }
  };

  const trackClick = async (popupId: string) => {
    try {
      await fetch(`http://localhost:5000/api/v1/popups/${popupId}/click`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error tracking popup click:', error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setPopup(null), 300);
  };

  const handleLearnMore = () => {
    if (popup) {
      trackClick(popup._id);
      handleClose();
    }
  };

  if (isLoading || !popup) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Popup Content */}
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
                  aria-label="Close popup"
                >
                  <FiX size={24} />
                </button>
                
                <div className="flex items-center mb-2">
                  <FiBookOpen className="mr-3 text-2xl" />
                  <span className="text-sm font-medium opacity-90">Educational Tip</span>
                </div>
                
                <h2 className="text-xl font-bold leading-tight">
                  {popup.title}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {popup.content}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Got it
                  </button>
                  
                  {popup.detailContent && (
                    <Link
                      href={`/education/popup/${popup._id}`}
                      onClick={handleLearnMore}
                      className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
                    >
                      Learn More
                      <FiArrowRight className="ml-2" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Bottom accent */}
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EducationalPopup;