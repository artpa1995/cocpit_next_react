import { NextResponse } from 'next/server';
import Company from '../../../../models/Company';
import CompanyUserRelation from '../../../../models/CompanyUserRelation';
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

    if(!user_id){
        return NextResponse.json({ error: 'User Not found' }, { status: 401 });
    }
 
    try {
        const { title, clients, location, industry } = await req.json();
        const newCompany = await Company.create({ 
            title,
            user_id,
            city: location.city,
            state: location.state,
            country: location.country,
            industry,
        });        

        if (clients && clients.length > 0) {
            const CompanyUserRelations = clients.map((client:any) => ({
              client_id: client,
              company_id :newCompany.id,
              coach_id: user_id
            }));        

            await CompanyUserRelation.bulkCreate(CompanyUserRelations);
        }

        const newCompanyUserRelations = await CompanyUserRelation.findAll({ 
          where: { company_id: newCompany.id },
          include: [{
              model: Clients
            }],
       });

       const companyData = newCompany.toJSON(); 
       companyData.CompanyUserRelations = newCompanyUserRelations;

        return NextResponse.json({ success: true, company: companyData});
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
