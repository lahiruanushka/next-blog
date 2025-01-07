import Post from "../../../models/Post.js";
import { connect } from "../../../lib/config/mongoose.js";

export const GET = async (req, { params }) => {
  try {
    await connect();
    const slug = params.slug;

    const posts = await Post.find({ slug });
    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return new Response(JSON.stringify({ posts, totalPosts, lastMonthPosts }), {
      status: 200,
    });
  } catch (error) {
    console.log("Error getting post:", error);
    return new Response("Error getting post", { status: 500 });
  }
};
