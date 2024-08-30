import { NextResponse } from 'next/server';
import Clients from '../../../../models/Clients';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user: {
    id: number;
  };
}


export async function POST(req:any) {
    const token = req.cookies.get('token');
  
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    let decodedToken: DecodedToken;
    try {
      decodedToken = jwtDecode<DecodedToken>(token.value);
    } catch (error) {
      console.error('Error decoding token:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const user_id = decodedToken.user.id;
  
    if (!user_id) {
      return NextResponse.json({ error: 'User Not found' }, { status: 401 });
    }
  
    try {
      const { id, first_name, last_name, email, phone, source, source_user_id, ltv, type, status, estimated_salary, intention, agreed_meetings, agreed_meetings_frequency, billing_type, positive_impression, how_well_do_they_know_you, combined_network_rank, days_since_last_contact, pronouns} = await req.json();

      if (!id) {
        return NextResponse.json({ error: 'clients ID Not found' }, { status: 401 });
      }
      const client = await Clients.findByPk(id);

      if (!client) {
        return NextResponse.json({ error: 'clients Not found' }, { status: 401 });
      }
    
      client.type = type;
      client.first_name = first_name;
      client.last_name = last_name;
      client.type = type;
      client.email = email;
      client.phone = phone;
      client.type = type;
      client.source = source;
      client.source_user_id = source_user_id;
      client.type = type;
      client.ltv = ltv;
      client.status = status;
      client.type = type;
      client.estimated_salary = estimated_salary;
      client.intention = intention;
      client.agreed_meetings = agreed_meetings;
      client.agreed_meetings_frequency = agreed_meetings_frequency;
      client.billing_type = billing_type;
      client.positive_impression = positive_impression;
      client.how_well_do_they_know_you = how_well_do_they_know_you;
      client.combined_network_rank = combined_network_rank;
      client.days_since_last_contact = days_since_last_contact;
      client.pronouns = pronouns;

      await client.save();
  
      return NextResponse.json({ success: true, client: client });
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }