import { NextResponse, NextRequest } from 'next/server';
import  Currencies from '../../../models/Currencies'


export async function GET() {
  try {
    const currencies = await Currencies.findAll({ order: [['id', 'ASC']]});

    if (currencies.length === 0) {
      return NextResponse.json({ message: 'No data found ' }, { status: 404 });
    }    

    return NextResponse.json(currencies, { status: 200 });
  } catch (error) {
    console.error('Error fetching page info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: any) {
  const { name, icon } = await req.json();
  
  try {
    const isset_currency = await Currencies.findOne({ where: { name } });

    if(isset_currency){
      return NextResponse.json({ error: 'A currency with this name already exists' });
    }

    const currency = await Currencies.create({
        name,
        icon,
    });
    return NextResponse.json({ currency });
 

  } catch (error) {
    console.error('Error inserting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(req: any) {
    const { id, field, value }: { id: string; field: keyof Currencies; value: string | number | boolean } = await req.json();
  
    try {
      const currency = await Currencies.findByPk(id);
  
      if (!currency) {
        return NextResponse.json({ error: 'A currency with this id not found' });
      }
      
      if (field === 'name' || field === 'icon') {
        currency[field] = value as string;
      } else {
        return NextResponse.json({ error: 'Invalid field' }, { status: 400 });
      }
      
      await currency.save();
  
      return NextResponse.json({ currency });
  
    } catch (error) {
      console.error('Error updating currency:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  