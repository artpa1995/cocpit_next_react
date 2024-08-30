import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server'; 
import  PageData from '../../../../../models/PageData'
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USERNAME!, //'postgres',
    host: 'localhost',
    database: process.env.DB!, //'cockpit_new',
    password: process.env.DB_PASSWORD!,
    port: 5432,
  });

interface Params {
  id: string; 
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  try {
    const { rows } = await pool.query(
      `SELECT json_object_agg(page_key, page_value) AS page_data
       FROM page_data
       WHERE page_id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: 'No data found for the given ID' }, { status: 404 });
    }

    if (!rows[0].page_data) {
      return NextResponse.json({ message: 'Data not available' }, { status: 404 });
    }

    return NextResponse.json(rows[0].page_data, { status: 200 });
  } catch (error) {
    console.error('Error fetching page info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: any) {
  const { page_id } = await req.json();
  
  try {
    const pageInfo = await PageData.findAll({
      where: { page_id: page_id },
      attributes: ['id', 'page_key', 'page_value'], 
    });

    const pageDataObject: { [key: string]: { [id: number]: string } } = {};

    pageInfo.forEach(data => {
      pageDataObject[data.page_key] = { [data.id]: data.page_value };
    });

    return new Response(JSON.stringify(pageDataObject), { status: 200 });
  } catch (error) {
    console.error('Error fetching page data:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}




// const pageInfo = await PageData.findAll({
//     where: { page_id: id },
//     attributes: ['page_key', 'page_value'], 
// });
// const pageDataObject = pageInfo.reduce((acc: Record<string, string>, data) => {
//     acc[data.page_key] = data.page_value;
//     return acc;
// }, {});

// const pageDataArray = pageInfo.map(data => ({
//     [data.page_key]: data.page_value    
// }));