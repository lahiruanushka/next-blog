
import Post from '../../models/Post.js';
import { connect } from '../../lib/config/mongoose.js';
import { currentUser } from '@clerk/nextjs/server';

export const POST = async (req) => {
  const user = await currentUser();
  try {
    await connect();
    const data = await req.json();
    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const slug = data.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');
      
    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      content: data.content,
      title: data.title,
      image: data.image,
      category: data.category,
      slug,
    });
    
    return new Response(JSON.stringify(newPost), { status: 200 });
  } catch (error) {
    console.log('Error creating post:', error);
    return new Response('Error creating post', { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    await connect();
    
    // Get URL parameters using searchParams
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    const startIndex = parseInt(searchParams.get('startIndex')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 9;
    const order = searchParams.get('order');
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');
    const searchTerm = searchParams.get('searchTerm');
    
    const sortDirection = order === 'asc' ? 1 : -1;
    
    const query = {
      ...(userId && { userId }),
      ...(category && category !== 'null' && category !== 'undefined' && { category }),
      ...(searchTerm && {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { content: { $regex: searchTerm, $options: 'i' } },
        ],
      }),
    };

    const posts = await Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
      
    const totalPosts = await Post.countDocuments(query);
    
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
    console.log('Error getting posts:', error);
    return new Response('Error getting posts', { status: 500 });
  }
};

