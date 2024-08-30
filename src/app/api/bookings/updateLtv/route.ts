import { NextResponse } from 'next/server';
import  Bookinkgs from '../../../../models/Bookings'

export async function POST(req: any) {
    const { id, ltv } = await req.json();
    
    try {
      const booking = await Bookinkgs.findByPk(id);
  
      if (!booking) {
        return NextResponse.json({ error: 'A booking with this id not found' });
      }



      booking.ltv = ltv;
      await booking.save();

      if(ltv == 0){
        booking.destroy();
      }

      return NextResponse.json({ booking });
  
    } catch (error) {
      console.error('Error updating currency:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  