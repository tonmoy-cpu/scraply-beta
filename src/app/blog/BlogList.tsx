"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiUser, FiArrowRight } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  photo: string;
  featured: boolean;
  createdAt: string;
  comments: Array<{
    username: string;
    comment: string;
  }>;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
    fetchFeaturedBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/blogs");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again later.");
      toast.error("Failed to load blogs");
    }
  };

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/blogs/featured");
      if (response.ok) {
        const data = await response.json();
        setFeaturedBlogs(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching featured blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="shimmer h-48 w-full"></div>
                <div className="p-6">
                  <div className="shimmer h-4 w-3/4 mb-4 rounded"></div>
                  <div className="shimmer h-3 w-full mb-2 rounded"></div>
                  <div className="shimmer h-3 w-2/3 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchBlogs();
              fetchFeaturedBlogs();
            }}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ToastContainer />

      <div className="container mx-auto px-4">
        {/* Add Blog Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end mb-6"
        >
          <Link
            href="/blog/AddBlog"
            className="bg-go-green text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-eco-green transition-colors"
          >
            + Add Blog
          </Link>
        </motion.div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            E-Waste <span className="text-go-green">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed about the latest trends, tips, and innovations in e-waste management and recycling.
          </p>
        </motion.div>

        {/* Featured Blogs */}
        {featuredBlogs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredBlogs.slice(0, 2).map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
                >
                  <div className="relative h-64">
                    <Image
                      src={blog.photo || "/api/placeholder/400/300"}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-go-green text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <FiUser className="mr-2" />
                      <span>{blog.author}</span>
                      <FiCalendar className="ml-4 mr-2" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {truncateContent(blog.content)}
                    </p>
                    <Link
                      href={`/blog/${blog._id}`}
                      className="inline-flex items-center text-go-green font-semibold hover:text-eco-green transition-colors"
                    >
                      Read More
                      <FiArrowRight className="ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* All Blogs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Articles</h2>
          
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No blogs available</h3>
              <p className="text-gray-600">Check back later for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
                >
                  <div className="relative h-48">
                    <Image
                      src={blog.photo || "/api/placeholder/400/300"}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                    {blog.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-go-green text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <FiUser className="mr-2" />
                      <span>{blog.author}</span>
                      <FiCalendar className="ml-4 mr-2" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {truncateContent(blog.content)}
                    </p>
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/blog/${blog._id}`}
                        className="inline-flex items-center text-go-green font-semibold hover:text-eco-green transition-colors"
                      >
                        Read More
                        <FiArrowRight className="ml-2" />
                      </Link>
                      {blog.comments && blog.comments.length > 0 && (
                        <span className="text-sm text-gray-500">
                          {blog.comments.length} comment{blog.comments.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default BlogList;