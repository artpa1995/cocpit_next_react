"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from 'next/dynamic';
import CoachLayout from '../CoachLayout';
import ResizableComponent from '../../components/ResizableComponent';
import PageInfo from '../../components/coach/PageData';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

import { useSelector } from 'react-redux';
import { RootState } from '../../../lib/store'; 

type Series = {
  name: string;
  data: number[];
  type: "area" | "line" | "column" | "bar" | "radar" | "pie" | "donut";
};

interface Currency {
  id: string;
  name: string;
  icon: string;
}


interface DecodedToken {
  user: {
    // id: number;
    // first_name: string;
    // last_name: string;
    // role: number;
    // avatar: string;
    currency?: number;
  };
} 

const ChartComponent = dynamic(() => import('../../components/coach/ChartComponent'), { ssr: false });

export default function Home() {
  const [clients, setClients] = useState<number[]>([]);
  const [currency, setCurrency] = useState<Currency | null>(null);
  const token = Cookies.get('token');
  const [projectedIncome, setprojectedIncome] = useState(0);
  const [BookedIncomeData, setBookedIncomeData] = useState<number[]>([]);
  
  const [pageData, setPageData] = useState<{
    dashboard_title: string;
    dashboard_description: string;
    dashboard_button_text: string;
    dashboard_button_link: string;
    dashboard_video: string;
  } | null>(null);

  const data1 = [30, 40, 45, 50, 49, 60, 70, 91, 125];
  const currentYear = new Date().getFullYear();

  const getCurrency = async (id: number) => {
    try {
     const response = await axios.get(`/api/currency/${id}`);

     if(response && response.data && response.data.currency){
      setCurrency(response.data.currency); 
     }
    } catch (error) {
      console.error('Error currency :', error);
    }
  };

  const fetchBookedIncome = async () => {
    try {
      const response = await axios.post('/api/bookings/getBookedIncome');

      if(response.data){
        let count_array = [];
        let data = response.data;
        for (let count of data) {
          count_array.push(count.count);
        }
        setBookedIncomeData(count_array);
      }
    } catch (error) {
      console.error('Error fetching Clients:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.post('/api/company/getClients');
      setClients(response.data || []);
    } catch (error) {
      console.error('Error fetching Clients:', error);
    }
  };

  const fetchPageData = async (id:number) => {
    try {
      const response = await axios.get(`/api/page_info/get_page_info/${id}`);
      setPageData(response.data || null);
    } catch (error) {
      console.error('Error fetching page info:', error);
    }
  };

  useEffect(() => {
    fetchClients();
   
    fetchBookedIncome()
  }, []);

  const series1: Series[] = [
    {
      name: 'Booked Income',
      data: BookedIncomeData,
      type: 'column',
    },
    {
      name: 'Sustainable',
      data: BookedIncomeData,
      type: 'line',
    },
    {
      name: 'Target Income',
      data: BookedIncomeData,
      type: 'line',
    },
  ];

  const series2: Series[] = [
    {
      name: 'Booked Clients',
      data: clients,
      type: 'bar',
    },
    {
      name: 'Target Clients',
      data: [20, 30, 40, 50],
      type: 'line',
    },
  ];

  const colors = ['#0B5394', '#FFC300', '#6AA84F'];
  const colors2 = ['#0B5394', '#6AA84F'];

  const activeClientsCount = useSelector((state: RootState) => state.ActiveClients.count);
  const LTV = useSelector((state: RootState) => state.LTV.count);
  const settings = useSelector((state: RootState) => state.settings); 


  useEffect(() => {
    if (LTV) {
      fetchPageData(1);
    }else if(LTV && LTV > 100000 && LTV < 200000){
      fetchPageData(4);
    }
  }, [LTV]);

  useEffect(() => {
    if (settings && settings.currency) {
      setCurrency(settings.currency);
    }
  }, [settings]);

  useEffect(() => {
    if (token) {
      let decodedToken: DecodedToken;
      decodedToken = jwtDecode<DecodedToken>(token);

      if(decodedToken.user.currency){
        getCurrency(decodedToken.user.currency)   
      }
    }

    const contactGmail = localStorage.getItem('Contact_gmail');
    getprojectedIncome()
}, [token]);

const getprojectedIncome = async () => {
  try {
   const response = await axios.post(`/api/bookings/getprojectedIncome`);

   

   if(response && response.data){
    setprojectedIncome(response.data); 
   }
  } catch (error) {
    console.error('Error currency :', error);
  }
};

  return (
    <CoachLayout>
      <main className="pb-5">
        <ResizableComponent initialWidth={1000} initialHeight={700} settings={true}>
          {({ showPart }) => (
            <>
              <div className={`flex ${showPart === 3 ? 'justify-between' : 'justify-center'}`}>
                {showPart === 1 || showPart === 3 ? (
                  <div>
                    <div className='flex gap-3  mb-5'>
                      <span>LTV</span>
                      <span className="font-bold">
                        {currency && currency.icon && (
                          <span dangerouslySetInnerHTML={{ __html: currency.icon }} />
                        )}
                         {LTV}
                         </span>
                    </div>
                    <div className="cart_block">
                      <div className="chart_legends">
                        <div>
                          <div className="cube" style={{ backgroundColor: colors[0] }}></div>
                          <span>Booked Income</span>
                        </div>
                        <div>
                          <div className="small_line" style={{ backgroundColor: colors[1] }}></div>
                          <span>Sustainable</span>
                        </div>
                        <div>
                          <div className="big_line" style={{ backgroundColor: colors[2] }}></div>
                          <span>Target Income</span>
                        </div>
                      </div>
                      <ChartComponent series={series1} chartTitle="Financial Overview" colors={colors} />
                    </div>
                  </div>
                ) : null}

                {showPart === 2 || showPart === 3 ? (
                  <div>
                    <div className='flex gap-3 mb-5'>
                      <span>Projected Income {currentYear}</span>
                      <span className="font-bold">
                      {currency && currency.icon && (
                          <span dangerouslySetInnerHTML={{ __html: currency.icon }} />
                        )}
                      {projectedIncome}
                      0</span>
                    </div>
                    <div className="cart_block">
                      <div className="chart_legends">
                        <div>
                          <div className="cube" style={{ backgroundColor: colors[0] }}></div>
                          <span>Booked Client</span>
                        </div>
                        <div>
                          <div className="big_line" style={{ backgroundColor: colors[2] }}></div>
                          <span>Target Clients</span>
                        </div>
                      </div>
                      <ChartComponent series={series2} chartTitle="Financial Overview" colors={colors2} />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="calcugation_blocks">
                {showPart === 1 || showPart === 3 ? (
                  <div className="calcugation_block">
                    <div>
                      <span className="title">Active Clients</span>
                      <span className="result font-bold">{activeClientsCount}</span>
                    </div>
                    <div>
                      <span className="title"># Clients for sustainable</span>
                      <span className="result font-bold">5</span>
                    </div>
                    <div>
                      <span className="title"># Clients for target</span>
                      <span className="result font-bold">27</span>
                    </div>
                  </div>
                ) : null}

                {showPart === 2 || showPart === 3 ? (
                  <div className="calcugation_block">
                    <div>
                      <span className="title">Average Rate:</span>
                      <span className="result font-bold">
                        {currency && currency.icon && (
                          <span dangerouslySetInnerHTML={{ __html: currency.icon }} />
                        )}
                        4,592</span>
                    </div>
                    <div>
                      <span className="title">Sustainable Income</span>
                      <span className="result font-bold">
                        {currency && currency.icon && (
                          <span dangerouslySetInnerHTML={{ __html: currency.icon }} />
                        )}
                        264,000</span>
                    </div>
                    <div>
                      <span className="title">Target Income</span>
                      <span className="result font-bold">
                        {currency && currency.icon && (
                          <span dangerouslySetInnerHTML={{ __html: currency.icon }} />
                        )}
                        1,100,00</span>
                    </div>
                  </div>
                ) : null}

                {showPart === 1 || showPart === 3 ? (
                  <div className="calcugation_block">
                    <div>
                      <span className="title">Active Prospects</span>
                      <span className="result font-bold">42</span>
                    </div>
                    <div>
                      <span className="title">Client Acquisition Blocks</span>
                      <span className="result font-bold">18</span>
                    </div>
                    <div>
                      <span className="title">Sales Conversations (30 days)</span>
                      <span className="result font-bold">2</span>
                    </div>
                  </div>
                ) : null}

                {showPart === 2 || showPart === 3 ? (
                  <div className="calcugation_block">
                    <div>
                      <span className="title">Price Sensitivity</span>
                      <span className="result font-bold">Low (but OK)</span>
                    </div>
                    <div>
                      <span className="title">Accounts Receivable</span>
                      <span className="result font-bold">
                        {currency && currency.icon && (
                          <span dangerouslySetInnerHTML={{ __html: currency.icon }} />
                        )}
                        140,000</span>
                    </div>
                    <div>
                      <span className="title">Change in Proj Income</span>
                      <span className="result font-bold text-red-600">
                        {currency && currency.icon && (
                          <span dangerouslySetInnerHTML={{ __html: currency.icon }} />
                        )}
                        -19,000</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </ResizableComponent>

        {pageData && (
          <PageInfo
            title={pageData.dashboard_title} 
            description={pageData.dashboard_description} 
            button_text={pageData.dashboard_button_text} 
            button_link={pageData.dashboard_button_link} 
            video={pageData.dashboard_video} 
          />
        )}
      </main>
    </CoachLayout>
  );
}
