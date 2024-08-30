import User from '../../../../../models/User';

export async function POST(req: any) {

  const { id, status } = await req.json();
    
  try {
    const user = await User.findByPk(id); 
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    user.status = status;
    await user.save();
    return new Response(JSON.stringify({ message: 'Status updated successfully' }));
  
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
