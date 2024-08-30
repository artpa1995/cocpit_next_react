"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Box, TextField, Button, Typography, FormControl, Select, MenuItem, InputLabel, Chip } from "@mui/material";

import CoachLayout from '../coach/CoachLayout';
import MyClients from '../components/coach/clients/MyClients';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

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

const ClientsPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    // const [clients, setClients] = useState([]);
    const [clients, setClients] = useState<Client[]>([]);
    
    const [clientId, setClientId] = useState(null);
    const [loading, setLoading] = useState(true);

    let source_data = {1: 'Referral (People)', 2: 'Event', 3: "Social Media", 4: 'Advertising', 5: 'Other'}
    let type_data = { 1: 'Inactive Client',  2: 'Active Client', 3: 'Prospect', 4: 'Network - Family',  5: 'Network - Friend', 6: 'Network - Other', 7: 'Interviewee',  8: 'Unclassified'}; 
    let status_data = { 1: 'Current',  2: 'Needs Attention', 3: 'Incomplete',};
    let agreedMeetingFrequency_data = { 1: 'Day',  2: 'Week', 3: 'Month', 4: 'Quarter',  5: 'Year',};
    let billingType_data = {1: 'Credit Card', 2: 'Invoice'};
    let pronouns_data = {1: 'He / His', 2: 'She / Hers', 3 : 'They / Theirs'};

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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientDelete, setClientDelete] = useState<Client | null>(null);
  
    const handleDeleteClick = (client: any) => {
      setClientDelete(client);
      setShowDeleteModal(true);
    };
  
    const confirmDelete = async () => {
      if (clientDelete) {
        await handleDelete(clientDelete); 
        setClientDelete(null);
        setShowDeleteModal(false);
      }
    };
  
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
            console.error('Error fetching companies:', error);
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients()
    }, []);

    const handleCloseModal = () => {
        setModalOpen(false);
        setIsEdit(false);
        setClientId(null);
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

    return (
    <CoachLayout>
    <div className='flex h-full w-full flex-col justify-between'>
      <div>
        <div className="flex justify-between p-5 mt-5">
          <div>
            <h2 className="font-bold">My Clients</h2>
          </div>
          <div className="flex justify-end">
            <div>
              <button className="text-white bg-sky-900 rounded-lg px-5 py-3" onClick={() => setModalOpen(true)}>
                Add Client
              </button>
            </div>
          </div>
        </div>
        <div className="px-5">
          <MyClients
           loading={loading}
           clients={clients} 
           onEditClick={handleEditClick}
           onDeleteClick={handleDeleteClick}
           source_data={source_data}
           type_data={type_data}
           status_data={status_data}
           agreedMeetingFrequency_data={agreedMeetingFrequency_data}
           billingType_data={billingType_data}
           pronouns_data={pronouns_data}
           />
        </div>
      </div>

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
    </div>
    <DeleteConfirmationModal 
          showModal={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title={clientDelete ? 'Are you sure you want to delete the Client: ' +  clientDelete.first_name +' '+ clientDelete.last_name +' ?' : ''}
    />
    </CoachLayout>
  );
};

export default ClientsPage;
