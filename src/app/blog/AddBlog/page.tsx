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
    <div className="min-h-screen bg-gray-50 py-12">
      <ToastContainer />
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden p-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Add New <span className="text-go-green">Blog</span>
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Title</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-go-green"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Content</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-go-green"
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Author</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-go-green"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Photo URL</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-go-green"
                value={photo}
                onChange={e => setPhoto(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="mr-2"
                id="featured"
              />
              <label htmlFor="featured" className="text-gray-700 font-semibold">Featured</label>
            </div>
            <button
              type="submit"
              className="w-full bg-go-green text-white font-bold py-3 rounded-lg hover:bg-eco-green transition-colors"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Blog"}
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link href="/blog" className="text-go-green font-semibold hover:text-eco-green transition-colors">
              Back to Blogs
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddBlog;
