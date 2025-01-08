import PostCard from "./PostCard";

export default async function RecentPosts({ limit }) {
  let posts = null;
  try {
    const queryParams = new URLSearchParams({
      limit: limit || 9,
      order: "desc",
    }).toString();

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts?${queryParams}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    const data = await result.json();
    posts = data.posts;
  } catch (error) {
    console.error("Error getting posts:", error);
  }

  return (
    <div className="flex flex-col justify-center items-center mb-5">
      <h1 className="text-xl mt-5">Recent articles</h1>
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {posts && posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
}
