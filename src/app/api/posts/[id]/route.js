import Post from '../../../models/Post.js';
import { connect } from '../../../lib/config/mongoose.js';
import { currentUser } from '@clerk/nextjs/server';

export const DELETE = async (req, { params }) => {
  const user = await currentUser();
  try {
    await connect();
    
    if (!user?.publicMetadata?.isAdmin) {
      return new Response('Unauthorized', { status: 401 });
    }

    const post = await Post.findById(params.id);
    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    if (post.userId !== user.publicMetadata.userMongoId) {
      return new Response('Unauthorized', { status: 401 });
    }

    await Post.findByIdAndDelete(params.id);
    return new Response('Post deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response('Error deleting post', { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  const user = await currentUser();
  try {
    await connect();
    const data = await req.json();
    
    if (!user?.publicMetadata?.isAdmin) {
      return new Response('Unauthorized', { status: 401 });
    }

    const post = await Post.findById(params.id);
    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    if (post.userId !== user.publicMetadata.userMongoId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      {
        $set: {
          title: data.title,
          content: data.content,
          category: data.category,
          image: data.image,
        },
      },
      { new: true }
    );

    return new Response(JSON.stringify(updatedPost), { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return new Response('Error updating post', { status: 500 });
  }
};

// method for fetching a single post
export const GET = async (req, { params }) => {
  try {
    await connect();
    
    const post = await Post.findById(params.id);
    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response('Error fetching post', { status: 500 });
  }
};