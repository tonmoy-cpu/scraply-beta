"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const AddBlog: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [photo, setPhoto] = useState("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/v1/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, author, photo, featured }),
      });
      if (!response.ok) {
        throw new Error("Failed to add blog");
      }
      toast.success("Blog added successfully!");
      setTitle("");
      setContent("");
      setAuthor("");
      setPhoto("");
      setFeatured(false);
    } catch (error) {
      toast.error("Error adding blog");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 pt-28 pb-16">
    <ToastContainer />
    <div className="container mx-auto px-4 max-w-2xl mt-36">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Add New <span className="text-go-green">Blog</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-go-green transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Content
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-3 h-36 resize-none focus:outline-none focus:ring-2 focus:ring-go-green transition"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Author
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-go-green transition"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Photo URL
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-go-green transition"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-go-green"
              id="featured"
            />
            <label
              htmlFor="featured"
              className="text-gray-700 font-semibold"
            >
              Featured blog
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-go-green text-white font-semibold py-3 rounded-lg hover:bg-eco-green transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Blog"}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-go-green font-semibold hover:text-eco-green transition-colors"
          >
            Back to Blogs
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
);
}


export default AddBlog;
