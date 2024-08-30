import { NextResponse } from 'next/server';
import Events from '../../../../../models/Events';
import EventType from '../../../../../models/EventType';
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
    user: {
      id: number;
    };
}

export async function POST(req: any) {
    const token = req.cookies.get('token');
    
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    let decodedToken: DecodedToken;
    try {
      decodedToken = jwtDecode<DecodedToken>(token.value);
    } catch (error) {
      console.error('Error decoding token:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const userId = decodedToken.user?.id;
    if (!userId) {
        return NextResponse.json({ error: 'User ID not found in token' }, { status: 401 });
    }

    try {
        const events = await Events.findAll({
            include: [{ model: EventType }],
            where: { user_id: userId }
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
    }
}
