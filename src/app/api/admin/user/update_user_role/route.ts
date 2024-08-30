import User from '../../../../../models/User';

export async function POST(req: any) {
  const { id, role } = await req.json();

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    user.role = role;
    await user.save();
    return new Response(JSON.stringify({ message: 'Role updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating user role:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
