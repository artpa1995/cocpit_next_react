import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server'; 
import  Currencies from '../../../../models/Currencies'


export async function POST() {
  try {
    const currencies = await Currencies.findAll({});
    if (currencies.length === 0) {
      return NextResponse.json({ message: 'No data found ' }, { status: 404 });
    }    

    return NextResponse.json(currencies, { status: 200 });
  } catch (error) {
    console.error('Error fetching page info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// export async function POST(req: any) {
//   const { name, icon } = await req.json();
  
//   try {
//     const isset_currency = await Currencies.findOne({ where: { name } });

//     if(isset_currency){
//       return NextResponse.json({ error: 'A currency with this name already exists' });
//     }

//     const currency = await Currencies.create({
//         name,
//         icon,
//     });
//     return NextResponse.json({ currency });
 

//   } catch (error) {
//     console.error('Error inserting user:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }