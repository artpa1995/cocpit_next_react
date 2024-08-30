"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import CoachLayout from '../coach/CoachLayout';
import MyServices from '../components/coach/services/MyServices';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

interface Service {
  id: number;
  type: string;
  price: string;
  currency: string;
  createdAt: string; 
}

const ServicesPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [type, setType] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [serviceDelete, setServiceDelete] = useState<Service | null>(null);

  const handleDeleteClick = (service: Service) => {
    setServiceDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (serviceDelete) {
      await handleDelete(serviceDelete); 
      setServiceDelete(null);
      setShowDeleteModal(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.post('/api/service/getServices');
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSaveService = async () => {
    if (type && price && currency) {
      try {
        const endpoint = editMode ? '/api/service/updateService' : '/api/service/createService';
        const payload = { type, price, currency, id: selectedService?.id };
        const response = await axios.post(endpoint, payload);

        if (response.data.success) {
          if (editMode) {
            setServices((prevServices) =>
              prevServices.map((service) =>
                service.id === response.data.service.id ? response.data.service : service
              )
            );
          } else {
            setServices((prevServices) => [...prevServices, response.data.service]);
          }
          setType("");
          setPrice("");
          setCurrency("");
          setSelectedService(null);
          setModalOpen(false);
          setEditMode(false);
        }
      } catch (error) {
        console.error('Error saving service:', error);
      }
    }
  };

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setType(service.type);
    setPrice(service.price);
    setCurrency(service.currency);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async (service: Service) => {
    try {
      const response = await axios.post('/api/service/delete', { id: service.id });
      
      if (response.data.id) {
        setServices((prevServices) =>
          prevServices.filter((s) => s.id !== service.id)
        );
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <CoachLayout>
      <div className='flex h-full w-full flex-col justify-between'>
        <div>
          <div className="flex justify-between p-5 mt-5">
            <div>
              <h2 className="font-bold">Services</h2>
            </div>
            <div className="flex justify-end">
              <div>
                <button className="text-white bg-sky-900 rounded-lg px-5 py-3" onClick={() => {
                  setType("");
                  setPrice("");
                  setCurrency("");
                  setSelectedService(null);
                  setEditMode(false);
                  setModalOpen(true);
                }}>
                  Add Service
                </button>
              </div>
            </div>
          </div>
          <div className="px-5">
            <MyServices loading={loading} services={services} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick}/>
          </div>
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2" className="text-center font-bold">
              {editMode ? "Edit Service" : "Add Service"}
            </Typography>
            <TextField
              fullWidth
              label="Type"
              margin="normal"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <TextField
              fullWidth
              label="Price"
              margin="normal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as string)}
              >
                <MenuItem value="1">Dollars</MenuItem>
                <MenuItem value="2">Euros</MenuItem>
                <MenuItem value="3">UK Pounds</MenuItem>
                <MenuItem value="4">Yen</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveService}
              sx={{ mt: 2 }}
            >
              {editMode ? "Update Service" : "Save Service"}
            </Button>
          </Box>
        </Modal>
      </div>
      <DeleteConfirmationModal 
          showModal={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title={serviceDelete ? `Are you sure you want to delete the Service: ${serviceDelete.type}?` : ''}
        />
    </CoachLayout>
  );
};

export default ServicesPage;
