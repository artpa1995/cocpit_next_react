"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Box, TextField, Button, Typography, FormControl, Select, MenuItem, InputLabel, Chip } from "@mui/material";
// import Clients from '../../models/Clients';
import CoachLayout from '../coach/CoachLayout';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import PageInfo from '../components/coach/PageData';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";

import { useSelector } from 'react-redux';
import { RootState } from '../../lib/store'; 

interface UserPayload extends JwtPayload {
  user: {
    currency?: number;
  };
}

interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  source?: string;
  source_user_id?: string;
  ltv?: number;
  type?: number;
  status?: number;
  estimated_salary?: number;
  intention?: string;
  agreed_meetings?: number;
  agreed_meetings_frequency?: number;
  billing_type?: number;
  positive_impression?: string;
  how_well_do_they_know_you?: string;
  combined_network_rank?: number;
  days_since_last_contact?: number;
  pronouns?: number;
}

interface Company {
  id: string;
  title: string;
  city: string;
  state: string;
  country: string;
  industry: string;
  clients: string[];
}

interface Bookings {
  id: number;
  status?: number;
  ltv?: number;
  state: string;
  client_id?: number;
  date : string;
}


interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  source?: string;
  source_user_id?: string;
  ltv?: number;
  type?: number;
  status?: number;
  estimated_salary?: number;
  intention?: string;
  agreed_meetings?: number;
  agreed_meetings_frequency?: number;
  billing_type?: number;
  positive_impression?: string;
  how_well_do_they_know_you?: string;
  combined_network_rank?: number;
  days_since_last_contact?: number;
  pronouns?: number;
  Bookings: Bookings[]; 
}

interface Currency {
  id: string;
  name: string;
  icon: string;
}

interface SettingsState {
  time_zone: string;
  start_date: string;
  end_date: string;
  week_days: string;
  currency: Currency[];
}

const initialState: SettingsState = {
  time_zone: '',
  start_date: '',
  end_date: '',
  week_days: '',
  currency: [],
};

interface DateLtvSum {
  date: string;
  ltvSum: number;
}

const Bookings = () => {
  let source_data = {1: 'Referral (People)', 2: 'Event', 3: "Social Media", 4: 'Advertising', 5: 'Other'}
  let type_data = { 1: 'Inactive Client',  2: 'Active Client', 3: 'Prospect', 4: 'Network - Family',  5: 'Network - Friend', 6: 'Network - Other', 7: 'Interviewee',  8: 'Unclassified'}; 
  let status_data = { 1: 'Current',  2: 'Needs Attention', 3: 'Incomplete',};
  let agreedMeetingFrequency_data = { 1: 'Day',  2: 'Week', 3: 'Month', 4: 'Quarter',  5: 'Year',};
  let billingType_data = {1: 'Credit Card', 2: 'Invoice'};
  let pronouns_data = {1: 'He / His', 2: 'She / Hers', 3 : 'They / Theirs'};

  const token = Cookies.get('token');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  // const [clients, setClients] = useState([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClient, setActiveClients] = useState(0);
  const [projectedIncome, setprojectedIncome] = useState(0);
  const [monthPercent, setMonthPercent] = useState(0);
  const [yearPercent, seYearPercent] = useState(0);
  const [clientId, setClientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState<number>(1);
  const [changeLtv, setchangeLtv] = useState<Bookings[]>([]);
  const [changeLtvModal, setchangeLtvModal] = useState(false);
  const [tableTitles, setTableTitles] = useState<string[]>([]);
  const [ltvInput, setLtvInput] = useState<number | null>(null);
  const [ClientLtv, setClientLtv] = useState<number>(1);
  const [AddLtvModal, setAddLtvModal] = useState(false);
  const [BookingDay, setBookingDay] = useState('');
  const [totalResults, setTotalResults] = useState<DateLtvSum[]>([]);
  const [newBookingVal, setNewBookingVal] = useState('');
  const [currency, setCurrency] = useState<Currency | null>(null);
  const settings = useSelector((state: RootState) => state.settings); 

  const handleLtvInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLtvInput(Number(e.target.value));
  };

  const addNewBooking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  
    try {
      const response = await axios.post(`/api/bookings/`, {
        month: BookingDay,
        client_id: ClientLtv,
        ltv: newBookingVal
      });
  
      if (response && response.data && response.data.newBookings) {
        const newBooking = response.data.newBookings;
  
        setClients((prevClients) => {
          return prevClients.map((client) => {
            if (client.id === ClientLtv) {
              return {
                ...client,
                Bookings: client.Bookings
                  ? [...client.Bookings, newBooking]
                  : [newBooking]
              };
            }
            return client;
          });
        });
      }
    } catch (error) {
      console.error('Error adding booking:', error);
    }
  
    setAddLtvModal(false);
  };

  useEffect(() => {
    if (settings && settings.currency) {
      setCurrency(settings.currency);
    }
  }, [settings]);
  
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

  const getMM = async () => {
    try {
     const response = await axios.post(`/api/bookings/getMM`);
     if(response && response.data && response.data.percentChange){
      setMonthPercent(response.data.percentChange); 
     }
    } catch (error) {
      console.error('Error currency :', error);
    }
  };

  const getYY = async () => {
    try {
     const response = await axios.post(`/api/bookings/getYY`);
     if(response && response.data && response.data.percentChange){
      seYearPercent(response.data.percentChange); 
     }
    } catch (error) {
      console.error('Error currency :', error);
    }
  };

  const getCurrency = async (id: number) => {
    try {
     const response = await axios.get(`/api/currency/${id}`);

     if(response && response.data && response.data.currency){
      setCurrency(response.data.currency); 
     }
    } catch (error) {
      console.error('Error currency :', error);
    }
    setchangeLtvModal(false)
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode<UserPayload>(token);  

      if(decodedToken.user.currency){
        getCurrency(decodedToken.user.currency)   
      }
    }
  }, [token]);

  useEffect(() => {
    fetchPageData();
    fetchActiveClients(2)
    fetchClients();
}, []);

useEffect(() => {
  if (clients && clients.length > 0) {
    const dateSet = new Set<string>();
    const dateMap: Record<string, number[]> = {};

    for (const client of clients) {
      if (client.Bookings && client.Bookings.length > 0) {
        for (const Bookings of client.Bookings) {
          if(Bookings.date){
            let date = Bookings.date.substring(0, 10);
            date = date.replace(/-/g, '/');

            if (!dateMap[date]) {
              dateMap[date] = [];
            }
            if(Bookings.ltv){
              dateMap[date].push(Bookings.ltv);
            }
            dateSet.add(date);
          }
        }
      }
    }
    const date_array = Array.from(dateSet);
    const sortedDates = date_array.sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    const dateLtvSums: DateLtvSum[] = sortedDates.map(date => ({
      date,
      ltvSum: dateMap[date].reduce((acc, ltv) => acc + ltv, 0),
    }));
    
    setTableTitles(sortedDates);
    setTotalResults(dateLtvSums)
  }
  getYY();
  getMM()
  getprojectedIncome()
}, [clients]);


  const updateLtv = async (bookingId: number, newLtv: number) => {
    try {
      await axios.post('/api/bookings/updateLtv', { id: bookingId, ltv: newLtv });

      setClients((prevClients) => {
        return prevClients.map((client) => {
          if (client.Bookings && client.Bookings.length > 0) {
            return {
              ...client,
              Bookings: client.Bookings.map((booking) => {
                if (booking.id === bookingId) {
                  return { ...booking, ltv: newLtv };
                }
                return booking;
              }),
            };
          }
          return client;
        });
      });

    } catch (error) {
      console.error('Error updating LTV:', error);
    }
    setchangeLtvModal(false)
  };
  
  const handleBlur = (bookingId: number) => {
    if (ltvInput !== null) {
      updateLtv(bookingId, ltvInput);
    }
  };

  const [clientData, setClientData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      phone: null,
      source: null,
      source_user_id: null,
      ltv: null,
      type: null,
      status: null,
      estimated_salary: null,
      intention: null,
      agreed_meetings: null,
      agreed_meetings_frequency: null,
      billing_type: null,
      positive_impression: null,
      how_well_do_they_know_you: null,
      combined_network_rank: null,
      days_since_last_contact: null,
      pronouns: null,
  });
  
  const [pageData, setPageData] = useState<{
    dashboard_title: string;
    dashboard_description: string;
    dashboard_button_text: string;
    dashboard_button_link: string;
    dashboard_video: string;
  } | null>(null);

  const handleDelete = async (client: Client) => {
      try {
        const response = await axios.post('/api/clients/delete', { id: client.id });
        
        if (response.data.id) {
          setClients((prevClients) =>
            prevClients.filter((s) => s.id !== client.id)
          );
        }
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    };

  const handleSaveClient = async () => {       
      try {
          const response = isEdit 
          ? await axios.post('/api/clients/updateClient', { id: clientId, ...clientData })
          : await axios.post('/api/clients/create', clientData);
      if (response.status === 200) {
          fetchClients();
          handleCloseModal();
          setClientData({
          first_name: '',
          last_name: '',
          email: '',
          phone: null,
          source: null,
          source_user_id: null,
          ltv: null,
          type: null,
          status: null,
          estimated_salary: null,
          intention: null,
          agreed_meetings: null,
          agreed_meetings_frequency: null,
          billing_type: null,
          positive_impression: null,
          how_well_do_they_know_you: null,
          combined_network_rank: null,
          days_since_last_contact: null,
          pronouns: null,
          });
      }
      } catch (error) {
      console.error('Error saving client data', error);
      }
  };

  const fetchClients = async () => {
      try {
          const response = await axios.post('/api/clients/getUserClients');
          setClients(response.data || []);
      } catch (error) {
          console.error('Error fetching Clients:', error);
      }finally {
          setLoading(false);
      }
  };

  const fetchComplateClients = async () => {
    try {
        const response = await axios.post('/api/clients/getUserComplateClients');
        setClients(response.data || []);
    } catch (error) {
        console.error('Error fetching ComplateClients:', error);
    }
  };

  const fetchProspectClients = async () => {
    try {
        const response = await axios.post('/api/clients/getUserProspectClients');
        setClients(response.data || []);
    } catch (error) {
        console.error('Error fetching ProspectClients:', error);
    }
  };

  const fetchPageData = async () => {
    try {
      const response = await axios.get(`/api/page_info/get_page_info/2`);
      setPageData(response.data || null);
    } catch (error) {
      console.error('Error fetching page info:', error);
    }
  };

  const handleCloseModal = () => {
      setModalOpen(false);
      setIsEdit(false);
      setClientId(null);
  };

  const handleClosechangeLtvModal = () => {
    setchangeLtvModal(false);
    setAddLtvModal(false);
  };

  const handleChange = (e:any) => {
      const { name, value } = e.target;
      setClientData({ ...clientData, [name]: value });
  };

  const handleEditClick = (client:any) => {        
      setIsEdit(true);
      setClientId(client.id);
      setClientData(client);
      setModalOpen(true);
    };
    const handleButtonClick = (buttonName: number) => {
      setActiveButton(buttonName);

      if(buttonName === 1){
        fetchClients()
      }else if(buttonName === 2){
        fetchActiveClients(1)
      }else if(buttonName === 3){
        fetchComplateClients()
      }else if(buttonName === 4){
        fetchProspectClients()
      }
    }

    const fetchActiveClients = async (type:number) => {
      try {
          const response = await axios.post('/api/clients/getUserActiveClients');
          
          if(type === 1){
            setClients(response.data || []);
          }
          if(response.data){
            setActiveClients(response.data.length)
          }
      } catch (error) {
          console.error('Error fetching ActiveClients:', error);
      }
    };
    const currentYear = new Date().getFullYear();

  return (
    <CoachLayout>
      <main className="pb-5 ">
        <div className="buttons_block flex justify-between">
          <div className="left">
            <button 
              className={`my_buttons my_buttons_border ${activeButton === 1 ? 'active' : ''}`} 
              onClick={() => handleButtonClick(1)}
            >Maximize</button>
          </div>
          <div className="right flex gap-3">
            <button
              className={`my_buttons my_buttons_border ${activeButton === 2 ? 'active' : ''}`} 
              onClick={() => handleButtonClick(2)}
            >Active</button>
            <button 
              className={`my_buttons my_buttons_border ${activeButton === 3 ? 'active' : ''}`} 
              onClick={() => handleButtonClick(3)}
            >Complete</button>
            <button 
              className={`my_buttons my_buttons_border ${activeButton === 4 ? 'active' : ''}`} 
              onClick={() => handleButtonClick(4)}
              style={{ color:'#4285F4', borderColor:'#4285F4'}}
            >Prospects</button>
          </div>
        </div>
        <div className="booking_clients_blocks">
          <div className="booking_clients_block">
            <div className="clients_block">
              <div className="header_part">
                <div className="head_block">
                  <a>Client Name</a>
                  <button className="add_client" onClick={() => setModalOpen(true)}>+ Add</button>
                </div>
              </div>
                {clients.length > 0 && clients.map((data, index) => (
                  <div className="items" key={index}  onClick={() => handleEditClick(data)}>
                    <div className="clients">
                      <a>{data.first_name} {data.last_name}</a>
                      <ArrowDropDownOutlinedIcon />
                    </div>
                  </div>
                ))}
            </div>
            <div className="table_block">
              <div className="header_part">
                <div className="flex">
                  {tableTitles && tableTitles.map((title, index) => (
                    <div key={index} className="head_block">
                      <a>{title}</a>
                    </div>
                  ))}
                </div>
              </div>
              {clients.length > 0 && clients.map((cl, index) => (
                <div key={index} className="booking_row">
                  {tableTitles && tableTitles.map((title, titleIndex) => {
                    const booking = cl.Bookings.find(bo => bo.date.substring(0, 10).replace(/-/g, '/') === title);
                    
                    if (booking) {
                      return (
                        <div key={titleIndex} className="booking_column" 
                        onClick={() => {
                          setchangeLtv([booking]);
                          setchangeLtvModal(true);
                          setLtvInput(Number(booking.ltv));
                        }}
                        >
                         {currency && currency.icon && (
                            <span dangerouslySetInnerHTML={{ __html: currency.icon }} />
                          )}
                          {booking.ltv}
                        </div>
                      );
                    } else {
                      return (
                        <div key={titleIndex} className="booking_column empty" 
                          onClick={(e) => {
                            setClientLtv(cl.id);
                            setAddLtvModal(true);
                            setBookingDay(title)
                          }}
                        ></div>
                      );
                    }
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="total_results_block">
            <div className="total">Total</div>
            <div className="total_results">
                  {clients.length > 0 && totalResults && totalResults.map((date,ltvSum) => (
                    <div className="results">
                        {currency && currency.icon && (
                          <span dangerouslySetInnerHTML={{ __html: currency.icon }} />
                        )}
                          {date.ltvSum}
                    </div>
                  ))}
            </div>
          </div>
        </div>
        <div className="bookings_info_blocks">
          <div className="info_block">
            <span className="title">Active Clients</span>
            <span className="info_value font-bold">{activeClient}</span>
          </div>
          <div className="info_block">
            <span className="title">Projected Income {currentYear}</span>
            <span className="info_value font-bold">
              {currency && currency.icon && (
                <span dangerouslySetInnerHTML={{ __html: currency.icon }} />
              )}
              {projectedIncome}
              </span>
          </div>

          <div className="info_block">
            <div>
              <span className="title">m/m </span>
              <span className="info_value font-bold">{monthPercent}%</span>
            </div>
           <div> 
              <span className="title">y/y </span>
              <span className="info_value font-bold">{yearPercent}%</span>
            </div>
          </div>
        </div>
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
          
      <Modal open={AddLtvModal} onClose={handleClosechangeLtvModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: '8px',
            p: 4,
          }}
        >
          <div className="overflow-y-auto px-2">
            <form  onSubmit={addNewBooking}>
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">New LTV For {BookingDay}</label>
              <input
                  className="w-full px-3 py-2 border rounded mb-5"
                  type="text"
                  onChange={(e) => setNewBookingVal(e.target.value)}
              />
              <div className="flex gap-3">
                <button type="submit"  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">Save</button>
                <button type="button" onClick={() => {setAddLtvModal(false)}} className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">Close</button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>

      <Modal open={changeLtvModal} onClose={handleClosechangeLtvModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius : "8px",
            p: 4,
          }}
        >
         <div className="overflow-y-auto px-2">
          {changeLtv && changeLtv.map((booking, index) => (
            <div key={index}>
              <Typography variant="body1">
                <label htmlFor="">LTV: </label>
                <input
                  className="w-full px-3 py-2 border rounded mt-4"
                  type="text"
                  value={ltvInput !== null ? ltvInput : booking.ltv}
                  onChange={handleLtvInputChange}
                  onBlur={() => handleBlur(booking.id)}
                />
              </Typography>
            </div>
          ))}
        </div>
        </Box>
      </Modal>

      <Modal open={modalOpen} onClose={handleCloseModal}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius : "8px",
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" className="text-center font-bold">
            {isEdit ? "Edit " : "Add "} Client
        </Typography>

        <div className="h-96 overflow-y-auto px-2">
            <div className="flex gap-4 ">
                <TextField
                    fullWidth
                    label="First Name"
                    margin="normal"
                    name="first_name"
                    value={clientData.first_name}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    label="Last Name"
                    margin="normal"
                    name="last_name"
                    value={clientData.last_name}
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-4 ">
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    name="email"
                    value={clientData.email}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    label="Phone"
                    margin="normal"
                    name="phone"
                    value={clientData.phone}
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-4 ">
                <FormControl fullWidth margin="normal">
                <InputLabel>Source</InputLabel>
                <Select
                    name="source"
                    value={clientData.source}
                    onChange={handleChange}
                >
                    {Object.entries(source_data).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                        {value}
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Source People ID"
                    margin="normal"
                    name="source_user_id"
                    value={clientData.source_user_id}
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-4 ">
                <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                    name="type"
                    value={clientData.type}
                    onChange={handleChange}
                >
                    {Object.entries(type_data).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                        {value}
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    name="status"
                    value={clientData.status}
                    onChange={handleChange}
                >
                    {Object.entries(status_data).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                        {value}
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>
            </div>
            <div className="flex gap-4 ">
                <TextField
                    fullWidth
                    label="LTV"
                    margin="normal"
                    name="ltv"
                    value={clientData.ltv}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    label="Estimated Salary"
                    margin="normal"
                    name="estimated_salary"
                    value={clientData.estimated_salary}
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-4 ">
                <TextField
                    fullWidth
                    label="Agreed Meetings"
                    margin="normal"
                    name="agreed_meetings"
                    value={clientData.agreed_meetings}
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                <InputLabel>Agreed Meeting Frequency</InputLabel>
                <Select
                    name="agreed_meetings_frequency"
                    value={clientData.agreed_meetings_frequency}
                    onChange={handleChange}
                >
                    {Object.entries(agreedMeetingFrequency_data).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                        {value}
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>
            </div>
            <div className="flex gap-4 ">
                <FormControl fullWidth margin="normal">
                <InputLabel>Billing Type</InputLabel>
                <Select
                    name="billing_type"
                    value={clientData.billing_type}
                    onChange={handleChange}
                >
                    {Object.entries(billingType_data).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                        {value}
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                <InputLabel>Pronouns</InputLabel>
                <Select
                    name="pronouns"
                    value={clientData.pronouns}
                    onChange={handleChange}
                >
                    {Object.entries(pronouns_data).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                        {value}
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>
            </div>
            <div className="flex gap-4 ">
                <TextField
                    fullWidth
                    label="Positive impression?"
                    margin="normal"
                    name="positive_impression"
                    value={clientData.positive_impression}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    label="How well do they know you?"
                    margin="normal"
                    name="how_well_do_they_know_you"
                    value={clientData.how_well_do_they_know_you}
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-4 ">
                <TextField
                    fullWidth
                    label="Combined Network Rank"
                    margin="normal"
                    name="combined_network_rank"
                    value={clientData.combined_network_rank}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    label="Days since last contact"
                    margin="normal"
                    name="days_since_last_contact"
                    value={clientData.days_since_last_contact}
                    onChange={handleChange}
                />
            </div>
            <TextField
                fullWidth
                label="Intention"
                margin="normal"
                name="intention"
                multiline
                rows={4}
                value={clientData.intention}
                onChange={handleChange}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleSaveClient()}
                sx={{ mt: 2 }}
                >
                {isEdit ? "Update " : "Save "} Client
            </Button>
        </div>
      </Box>
    </Modal>
    </CoachLayout>
  );
};

export default Bookings;
