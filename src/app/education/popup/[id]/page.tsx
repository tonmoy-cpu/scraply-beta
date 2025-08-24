"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiBookOpen, FiEye, FiMousePointer } from "react-icons/fi";
import Link from "next/link";

interface PopupDetail {
  _id: string;
  title: string;
  content: string;
  detailContent: string;
  viewCount: number;
  clickCount: number;
  createdAt: string;
}

const PopupDetailPage = () => {
  const { id } = useParams();
  const [popup, setPopup] = useState<PopupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPopupDetail();
    }
  }, [id]);

  const fetchPopupDetail = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/popups/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPopup(data.data);
        } else {
          setError("Popup not found");
        }
      } else {
        setError("Failed to load popup details");
      }
    } catch (error) {
      console.error("Error fetching popup detail:", error);
      setError("Failed to load popup details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !popup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <FiBookOpen className="text-6xl text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link href="/" className="btn btn-primary">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </motion.div>

          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white">
              <div className="flex items-center mb-4">
                <FiBookOpen className="mr-3 text-3xl" />
                <span className="text-sm font-medium opacity-90">Educational Content</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                {popup.title}
              </h1>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm opacity-90">
                <div className="flex items-center">
                  <FiEye className="mr-2" />
                  <span>{popup.viewCount} views</span>
                </div>
                <div className="flex items-center">
                  <FiMousePointer className="mr-2" />
                  <span>{popup.clickCount} clicks</span>
                </div>
                <div>
                  Published: {new Date(popup.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Brief Content */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {popup.content}
                </p>
              </div>

              {/* Detailed Content */}
              {popup.detailContent && (
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Information</h2>
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: popup.detailContent }}
                    />
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="mt-12 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Make a Difference?
                </h3>
                <p className="text-gray-600 mb-4">
                  Start your e-waste recycling journey with Scraply today.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/recycle" className="btn btn-primary">
                    Start Recycling
                  </Link>
                  <Link href="/e-facilities" className="btn btn-secondary">
                    Find Facilities
                  </Link>
                  <Link href="/education" className="btn btn-secondary">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Related Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/education" className="group">
                <div className="p-6 border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all">
                  <FiBookOpen className="text-2xl text-emerald-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Education Hub</h3>
                  <p className="text-gray-600 text-sm">Explore more educational content about e-waste management</p>
                </div>
              </Link>
              
              <Link href="/blog" className="group">
                <div className="p-6 border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all">
                  <FiBookOpen className="text-2xl text-emerald-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Blog Articles</h3>
                  <p className="text-gray-600 text-sm">Read the latest insights and tips from our experts</p>
                </div>
              </Link>
              
              <Link href="/rules" className="group">
                <div className="p-6 border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all">
                  <FiBookOpen className="text-2xl text-emerald-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Rules & Regulations</h3>
                  <p className="text-gray-600 text-sm">Stay updated with e-waste management regulations</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PopupDetailPage;