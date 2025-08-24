"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiUser, FiArrowLeft, FiMessageCircle } from "react-icons/fi";
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

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBlog();
      fetchRelatedBlogs();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/blogs/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBlog(data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError("Failed to load blog. Please try again later.");
      toast.error("Failed to load blog");
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/blogs");
      if (response.ok) {
        const data = await response.json();
        const blogs = Array.isArray(data) ? data : [];
        // Filter out current blog and get random 3 blogs
        const filtered = blogs.filter((b: Blog) => b._id !== id);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRelatedBlogs(shuffled.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching related blogs:", error);
    } finally {
      setLoading(false);
    }
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
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="shimmer h-64 w-full"></div>
            <div className="p-8">
              <div className="shimmer h-8 w-3/4 mb-4 rounded"></div>
              <div className="shimmer h-4 w-1/2 mb-6 rounded"></div>
              <div className="space-y-3">
                <div className="shimmer h-4 w-full rounded"></div>
                <div className="shimmer h-4 w-full rounded"></div>
                <div className="shimmer h-4 w-2/3 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The blog you're looking for doesn't exist."}</p>
          <Link href="/blog" className="btn btn-primary">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ToastContainer />
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center text-go-green hover:text-eco-green transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Blogs
          </Link>
        </motion.div>

        {/* Main Blog Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-12"
        >
          {/* Hero Image */}
          <div className="relative h-64 md:h-96">
            <Image
              src={blog.photo || "/api/placeholder/800/400"}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
            {blog.featured && (
              <div className="absolute top-6 left-6">
                <span className="bg-go-green text-white px-4 py-2 rounded-full text-sm font-medium">
                  Featured Article
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Meta Information */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <FiUser className="mr-2" />
              <span className="mr-6">{blog.author}</span>
              <FiCalendar className="mr-2" />
              <span className="mr-6">{formatDate(blog.createdAt)}</span>
              {blog.comments && blog.comments.length > 0 && (
                <>
                  <FiMessageCircle className="mr-2" />
                  <span>{blog.comments.length} comment{blog.comments.length !== 1 ? "s" : ""}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </div>
            </div>

            {/* Comments Section */}
            {blog.comments && blog.comments.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Comments ({blog.comments.length})
                </h3>
                <div className="space-y-6">
                  {blog.comments.map((comment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-go-green rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {comment.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 font-semibold text-gray-900">
                          {comment.username}
                        </span>
                      </div>
                      <p className="text-gray-700 ml-11">{comment.comment}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.article>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.div
                  key={relatedBlog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
                >
                  <div className="relative h-40">
                    <Image
                      src={relatedBlog.photo || "/api/placeholder/300/200"}
                      alt={relatedBlog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {relatedBlog.content.substring(0, 100)}...
                    </p>
                    <Link
                      href={`/blog/${relatedBlog._id}`}
                      className="text-go-green font-semibold text-sm hover:text-eco-green transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
