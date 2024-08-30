import { NextResponse } from 'next/server';
import Currencies  from '../../../../models/Currencies';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const currency = await Currencies.findByPk(id);
    
    if (!currency) {
      return NextResponse.json({ error: 'Currency not found' }, { status: 404 });
    }

    await currency.destroy();

    return NextResponse.json({ message: 'Currency deleted successfully' });
  } catch (error) {
    console.error('Error deleting currency:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  
  try {
    const currency = await Currencies.findByPk(id);
    if (!currency) {
      return NextResponse.json({ error: 'Currency not found' }, { status: 405 });
    }

    return NextResponse.json({ currency });
  } catch (error) {
    console.error('Error deleting currency:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}