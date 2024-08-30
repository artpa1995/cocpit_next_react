import { NextResponse } from 'next/server';
import Clients from '../../../../models/Clients';
import Bookings from '../../../../models/Bookings';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    user: {
      id: number;
    };
}

function getYearLabels(year: number) {
    const labels = [];
    const currentMonth = new Date().getMonth();
  
    for (let i = 0; i < 12; i++) {
      const month = (currentMonth + i) % 12;
      const currentYear = year + Math.floor((currentMonth + i) / 12);
      const date = new Date(currentYear, month, 1);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      labels.push(formattedDate);
    }
  
    return labels;
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

    if(!user_id){
        return NextResponse.json({ error: 'User Not found' }, { status: 401 });
    }
 
    try {
        const {  first_name, last_name, email, phone, source, source_user_id, ltv, type, status, estimated_salary, intention, agreed_meetings, agreed_meetings_frequency, billing_type, positive_impression, how_well_do_they_know_you, combined_network_rank, days_since_last_contact, pronouns} = await req.json();
        const newClients = await Clients.create({ 
            user_id: user_id,
            first_name,
            last_name,
            email,
            phone,
            source,
            source_user_id,
            ltv,
            type,
            status,
            estimated_salary,
            intention,
            agreed_meetings,
            agreed_meetings_frequency,
            billing_type,
            positive_impression,
            how_well_do_they_know_you,
            combined_network_rank,
            days_since_last_contact,
            pronouns,
        });  
        
        const currentYear = new Date().getFullYear();
        let date = getYearLabels(currentYear)
        
        if(newClients.id){
            for (let index = 0; index < date.length; index++) {
                const element = date[index] + ' 00:00:01+00';
                
                const newBookings = await Bookings.create({ 
                    user_id: user_id,
                    client_id: newClients.id,
                    status: 1,
                    ltv,
                    date:element
                })
            }
        }

        return NextResponse.json({ success: true, Clients: []});
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
