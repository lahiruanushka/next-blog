import User from '../../models/User.js';
import { connect } from '../../lib/config/mongoose.js';
import { currentUser } from '@clerk/nextjs/server';

export const GET = async (req) => {
  const user = await currentUser();
  
  try {
    await connect();
    
    // Get query parameters from the URL instead of request body
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    
    if (!user?.publicMetadata?.isAdmin) {
      return new Response('Unauthorized', { status: 401 });
    }

    const startIndex = parseInt(searchParams.get('startIndex')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 9;
    const sort = searchParams.get('sort') || 'desc';
    const sortDirection = sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return new Response(
      JSON.stringify({ 
        users, 
        totalUsers, 
        lastMonthUsers 
      }), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.log('Error getting the users:', error);
    return new Response(
      JSON.stringify({ error: 'Error getting the users' }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};