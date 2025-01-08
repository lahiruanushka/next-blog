"use client";

import { useEffect, useState } from "react";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import { useSearchParams } from "next/navigation";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashboardComp from "../components/DashboardComp";
import DashUpdatePost from "../components/DashUpdatePost";
import DashCreatePost from "../components/DashCreatePost";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("");
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get("tab");
    const postIdFromUrl = urlParams.get("postId");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    if (postIdFromUrl) {
      setPostId(postIdFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>

      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
      {tab === "create-post" && <DashCreatePost />}
      {tab === "update-post" && <DashUpdatePost postId={postId} />}
      {tab === "users" && <DashUsers />}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
}
