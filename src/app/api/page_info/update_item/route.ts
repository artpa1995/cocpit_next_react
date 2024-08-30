import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server'; 
import  PageData from '../../../../models/PageData'

export async function POST(req: any) {
    const { id, value } = await req.json();
    
    try {
      const pageInfo = await PageData.findByPk(id); 

      if (!pageInfo) {
        return NextResponse.json({ message: 'Page not found' }, { status: 404 });
      }

      pageInfo.page_value = value;
      pageInfo.save();
  
      return new Response(JSON.stringify(pageInfo), { status: 200 });
    } catch (error) {
      console.error('Error fetching page data:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
  }