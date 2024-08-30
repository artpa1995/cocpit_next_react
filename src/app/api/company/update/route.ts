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
        const { id, title, clients, location, industry } = await req.json();

        const company = await Company.findByPk(id);

        if (!company) {
            return NextResponse.json({ error: 'company Not found' }, { status: 401 });
        }

        company.title = title;
        company.state = location.state;
        company.city = location.city;
        company.country = location.country;
        company.industry = industry;
        
        const issetCompanyUserRelations = await CompanyUserRelation.findAll({ 
            where: { company_id: id },
            attributes: [ 'client_id'],
            raw: true
         });
         const existingClientIds = issetCompanyUserRelations.map((relation:any) => relation.client_id);
         const newClientIds = clients || [];
 
         
         const clientsToAdd = newClientIds.filter((clientId:any) => !existingClientIds.includes(clientId));
 
         const clientsToRemove = existingClientIds.filter(clientId => !newClientIds.includes(clientId));
 
  
         if (clientsToAdd.length > 0) {
             const newRelations = clientsToAdd.map((clientId:any)=> ({
                 client_id: clientId,
                 company_id: id,
                 coach_id: user_id
             }));
             await CompanyUserRelation.bulkCreate(newRelations);
         }
 
         if (clientsToRemove.length > 0) {
             await CompanyUserRelation.destroy({
                 where: {
                     client_id: clientsToRemove,
                     company_id: id
                 }
             });
         }
 
         await company.save();


         const newCompanyUserRelations = await CompanyUserRelation.findAll({ 
            where: { company_id: id },
            // include: [Clients],
            include: [{
                model: Clients
              }],
            // raw: true
         });
        //  company.CompanyUserRelations = newCompanyUserRelations;

         const companyData = company.toJSON(); 
        companyData.CompanyUserRelations = newCompanyUserRelations;

        return NextResponse.json({ success: true, company: companyData });
         

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

