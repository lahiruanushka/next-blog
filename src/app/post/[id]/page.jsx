import RecentPosts from "@/app/components/RecentPosts";
import { Button } from "flowbite-react";
import Link from "next/link";

export default async function PostPage({ params }) {
  const fetchPost = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}`
      );


      console.log(response)

      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  };

  const post = await fetchPost();

  if (!post) {
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
      </main>
    );
  }

  const readingTime = post.content
    ? Math.max(1, Math.ceil(post.content.length / 1000))
    : 0;

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>

      {post.category && (
        <Link
          href={`/search?category=${post.category}`}
          className="self-center mt-5"
        >
          <Button color="gray" pill size="xs">
            {post.category}
          </Button>
        </Link>
      )}

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
        />
      )}

      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">{readingTime} mins read</span>
      </div>

      {post.content && (
        <div
          className="p-3 max-w-2xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      <RecentPosts limit={3} />
    </main>
  );
}
