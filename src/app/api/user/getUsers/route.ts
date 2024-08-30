import User from '../../../../models/User';

export async function POST() {
  try {
    const users = await User.findAll();
    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
