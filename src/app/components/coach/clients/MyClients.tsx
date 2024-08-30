import React from 'react';
import { format, isValid } from 'date-fns';
import Spinner from '../../Spinner';
import { Box, Typography, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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


interface MyClientsProps {
  loading?: boolean;
  clients: Client[];
  onEditClick: (client: Client) => void;
  onDeleteClick: (client: Client) => void;
  source_data: { [key: number]: string };
  type_data: { [key: number]: string };
  status_data: { [key: number]: string };
  agreedMeetingFrequency_data: { [key: number]: string };
  billingType_data: { [key: number]: string };
  pronouns_data: { [key: number]: string };
}

const MyClients: React.FC<MyClientsProps> = ({
  loading , 
  clients,
  onEditClick,
  onDeleteClick,
  source_data,
  type_data,
  status_data,
  agreedMeetingFrequency_data,
  billingType_data,
  pronouns_data,
}) => {

  const columns: GridColDef[] = [
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "source",
      headerName: "Source",
      flex: 1,
      renderCell: (params) => {
        const data = params.row.source;
        return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography>
              {source_data[data] || ''}
            </Typography>
          </Box>
        );
      },
    },
    { field: "source_user_id", headerName: "Source User ID", flex: 1 },
    { field: "ltv", headerName: "LTV", flex: 1 },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      renderCell: (params) => {
        const data = params.row.type;
        return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography>
              {type_data[data] || ''}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const data = params.row.status;
        return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography>
              {status_data[data] || ''}
            </Typography>
          </Box>
        );
      },
    },
    { field: "estimated_salary", headerName: "Estimated Salary", flex: 1 },
    { field: "intention", headerName: "Intention", flex: 1 },
    { field: "agreed_meetings", headerName: "Agreed Meetings", flex: 1 },
    {
      field: "agreed_meetings_frequency",
      headerName: "Meeting Frequency",
      flex: 1,
      renderCell: (params) => {
        const data = params.row.agreed_meetings_frequency;
        return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography>
              {agreedMeetingFrequency_data[data] || ''}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "billing_type",
      headerName: "Billing Type",
      flex: 1,
      renderCell: (params) => {
        const data = params.row.billing_type;
        return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography>
              {billingType_data[data] || ''}
            </Typography>
          </Box>
        );
      },
    },
    { field: "positive_impression", headerName: "Positive Impression", flex: 1 },
    { field: "how_well_do_they_know_you", headerName: "How Well Do They Know You", flex: 1 },
    { field: "combined_network_rank", headerName: "Combined Network Rank", flex: 1 },
    { field: "days_since_last_contact", headerName: "Days Since Last Contact", flex: 1 },
    {
      field: "pronouns",
      headerName: "Pronouns",
      flex: 1,
      renderCell: (params) => {
        const data = params.row.pronouns;
        return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography>
              {pronouns_data[data] || ''}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created On",
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params as string);
        return isValid(date) ? format(date, 'MM-dd-yyyy HH:mm:ss') : 'Invalid Date';
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Box display="flex">
          <IconButton
            color="primary"
            onClick={() => onEditClick(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            sx={{ color: 'red' }}
            onClick={() => onDeleteClick(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <div className="clients-container">
      {clients.length === 0 && loading ? (
        <Spinner />
      ) : (
        <Box
          height="500px"
          minHeight="400px"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              backgroundColor: 'white',
              borderBottom: "none",
              fontWeight: 'bold'
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
            },
          }}
        >
          <DataGrid
            rows={clients}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </Box>
      )}
    </div>
  );
};

export default MyClients;
