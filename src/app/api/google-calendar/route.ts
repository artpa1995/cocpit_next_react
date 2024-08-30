import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';

export async function POST(req: any) {
    const token = req.cookies.get('token');
    let requestData  = await req.json();


    let session = requestData.session;

    let accessToken = session.accessToken

    // if(!accessToken){
       accessToken =  await  refreshAccessToken(session);
    // }

    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({
      access_token: accessToken,
      scope: 'https://www.googleapis.com/auth/calendar.readonly'
    });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // const response = await calendar.calendarList.list();

    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return NextResponse.json({  /*calendar: response.data.items,*/ events:res.data.items  });
};


async function refreshAccessToken(token:any) {

  try {

    const params = new URLSearchParams();
    
    // Добавляем параметры только если они определены
    if (process.env.GOOGLE_CLIENT_ID) {
      params.append('client_id', process.env.GOOGLE_CLIENT_ID);
    }
    if (process.env.GOOGLE_CLIENT_SECRET) {
      params.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
    }
    params.append('grant_type', 'refresh_token');
    if (token.refreshToken) {
      params.append('refresh_token', token.refreshToken);
    }


    // const url = `https://oauth2.googleapis.com/token?` +
    //   new URLSearchParams({
    //     client_id: process.env.GOOGLE_CLIENT_ID,
    //     client_secret: process.env.GOOGLE_CLIENT_SECRET,
    //     grant_type: 'refresh_token',
    //     refresh_token: token.refreshToken,
    //   });

      const url = `https://oauth2.googleapis.com/token?` + params.toString();

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return refreshedTokens.access_token;

    // return {
    //   ...token,
    //   accessToken: refreshedTokens.access_token,
    //   accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
    //   refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    // };
  } catch (error) {
    console.error('Ошибка при обновлении токена', error);
    
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}