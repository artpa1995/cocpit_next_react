"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Box, TextField, Button, Typography, FormControl, Select, MenuItem, InputLabel, Chip } from "@mui/material";
import MyCompanies from '../components/coach/company/MyCompanies';
import CoachLayout from '../coach/CoachLayout';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

interface Client {
  id: string;  // Убедитесь, что тип `id` совпадает с типом в данных
  first_name: string;
  last_name: string;
  email: string;  // Добавлено поле email для использования в Chip
}

interface Company {
  id: string;
  title: string;
  city: string;
  state: string;
  country: string;
  industry: string;
  clients: string[];
  CompanyUserRelations?: {
    client: Client;
  }[];
}

const CompanyPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyDelete, setCompanyDelete] = useState<Company | null>(null);

  const handleDeleteClick = (company: Company) => {
    setCompanyDelete(company);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (companyDelete) {
      await handleDelete(companyDelete); 
      setCompanyDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleDelete = async (company: Company) => {
    try {
      const response = await axios.post('/api/company/delete', { id: company.id });
      
      if (response.data.id) {
        setCompanies((prevCompanies) =>
          prevCompanies.filter((s) => s.id !== company.id)
        );
      }
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.post('/api/clients/getUserClients');
      if (response.data) {
        setClients(response.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.post('/api/company/getUserCompanies');
      setCompanies(response.data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchCompanies();
  }, []);

  const handleSaveCompany = async () => {
    if (companyName) {
      try {
        let response;
        if (isEdit && companyId) {
          response = await axios.post('/api/company/update', {
            id: companyId,
            title: companyName,
            clients: selectedClients,
            location: {
              city,
              state,
              country,
            },
            industry,
          });
        } else {
          response = await axios.post('/api/company/create', {
            title: companyName,
            clients: selectedClients,
            location: {
              city,
              state,
              country,
            },
            industry,
          });
        }
        if (response.data.success) {
          setCompanies((prevCompanies) => {
            if (isEdit) {
              return prevCompanies.map((company) =>
                company.id === companyId ? response.data.company : company
              );
            } else {
              return [...prevCompanies, response.data.company];
            }
          });
          handleCloseModal();
        }
      } catch (error) {
        console.error('Error saving company:', error);
      }
    }
  };

  const handleEditClick = (company: Company) => {
    setIsEdit(true);
    setCompanyId(company.id);
    setCompanyName(company.title);
    setCity(company.city);
    setState(company.state);
    setCountry(company.country);
    setIndustry(company.industry);
    const clientIds = company.CompanyUserRelations?.map(relation => relation.client.id) || [];
    setSelectedClients(clientIds);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setIsEdit(false);
    setCompanyId(null);
    setCompanyName("");
    setSelectedClients([]);
    setCity("");
    setState("");
    setCountry("");
    setIndustry("");
  };

  return (
    <CoachLayout>
      <div className='flex h-full w-full flex-col justify-between'>
        <div>
          <div className="flex justify-between p-3 mt-5">
            <div>
              <h2 className="font-bold">My Companies</h2>
            </div>
            <div className="flex justify-end">
              <button className="text-white bg-sky-900 rounded-lg px-5 py-3" onClick={() => setModalOpen(true)}>
                Add Company
              </button>
            </div>
          </div>
          <div className="px-5">
            <MyCompanies loading={loading} companies={companies} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
          </div>
        </div>

        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius : "8px",
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" className="text-center font-bold">
              {isEdit ? "Edit Company" : "Add Company"}
            </Typography>
            <div className="h-96 overflow-y-auto px-2">
              <TextField
                fullWidth
                label="Company Name"
                margin="normal"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <TextField
                fullWidth
                label="City"
                margin="normal"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <TextField
                fullWidth
                label="State"
                margin="normal"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <TextField
                fullWidth
                label="Country"
                margin="normal"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <TextField
                fullWidth
                label="Industry"
                margin="normal"
                multiline
                rows={4}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Clients</InputLabel>
                <Select
                  multiple
                  value={selectedClients}
                  onChange={(e) => setSelectedClients(e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={clients.find((client) => client.id === value)?.email} />
                      ))}
                    </Box>
                  )}
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveCompany}
                sx={{ mt: 2 }}
              >
                {isEdit ? "Update Company" : "Save Company"}
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
      <DeleteConfirmationModal 
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={companyDelete ? 'Are you sure you want to delete the Company: ' + companyDelete.title + ' ?' : ''}
      />
    </CoachLayout>
  );
};

export default CompanyPage;
