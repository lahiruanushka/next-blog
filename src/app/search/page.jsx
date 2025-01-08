'use client';

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Alert,
  Button,
  Select,
  Spinner,
  TextInput,
  Card,
} from "flowbite-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { HiArrowRight, HiFilter, HiSearch, HiX } from "react-icons/hi";
import PostCard from "../components/PostCard";

export default function SearchPage() {
  const defaultFilters = {
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  };

  const [sidebarData, setSidebarData] = useState(defaultFilters);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchTermFromUrl = searchParams.get("searchTerm");
    const sortFromUrl = searchParams.get("sort");
    const categoryFromUrl = searchParams.get("category");
    
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      const queryString = searchParams.toString();
      try {
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?${queryString}`);
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data.posts);
        setShowMore(data.posts.length === 9);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]);

  const handleChange = (e) => {
    setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(sidebarData).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/search?${params.toString()}`);
  };

   const handleClearFilters = () => {
    setSidebarData(defaultFilters);
    router.push('/search');
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?${urlParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load more posts");
      }
      const data = await res.json();
      setPosts(prevPosts => [...prevPosts, ...data.posts]);
      setShowMore(data.posts.length === 9);
    } catch (error) {
      console.error("Error loading more posts:", error);
      setError("Failed to load more posts. Please try again.");
    }
  };

  const animations = {
    pageVariants: {
      initial: { opacity: 0 },
      in: { opacity: 1 },
      out: { opacity: 0 },
    },
    containerVariants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
      },
    },
    itemVariants: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 },
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={animations.pageVariants}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-fit sticky top-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label htmlFor="searchTerm" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <HiSearch />
                  <span>Search Term</span>
                </label>
                <TextInput
                  id="searchTerm"
                  type="text"
                  value={sidebarData.searchTerm}
                  onChange={handleChange}
                  placeholder="Search posts..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="sort" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <HiFilter />
                  <span>Sort Order</span>
                </label>
                <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
                  <option value="desc">Latest Posts</option>
                  <option value="asc">Oldest Posts</option>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <HiFilter />
                  <span>Category</span>
                </label>
                <Select id="category" value={sidebarData.category} onChange={handleChange}>
                  <option value="uncategorized">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" gradientDuoTone="purpleToPink">
                  Apply Filters
                  <HiArrowRight className="ml-2" />
                </Button>
                <Button type="button" color="gray" onClick={handleClearFilters}>
                  Clear Filters
                  <HiX className="ml-2" />
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">
            Search Results
          </h1>

          {error && (
            <Alert color="failure" className="mb-6">
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Spinner size="xl" />
            </div>
          ) : posts.length === 0 ? (
            <Alert color="info">
              No posts found. Try adjusting your search filters.
            </Alert>
          ) : (
            <motion.div
              variants={animations.containerVariants}
              initial="hidden"
              animate="visible"
              className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {posts.map((post) => (
                  <motion.div
                    key={post._id}
                    variants={animations.itemVariants}
                    layout
                    whileHover={{ scale: 1.02 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {showMore && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-8"
            >
              <Button onClick={handleShowMore} gradientDuoTone="purpleToPink">
                Load More
                <HiArrowRight className="ml-2" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}