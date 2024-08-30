import React from 'react';
import { format, isValid } from 'date-fns';
import Spinner from '../../Spinner'; 
import { Box, Typography, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



interface Service {
  id: number;
  type: string;
  price: string;
  currency: string;
  createdAt: string; 
}


interface MyServicesProps {
  loading?: boolean;
  services: Service[];
  onEditClick: (service: Service) => void;
  onDeleteClick: (service: Service) => void;
}

const MyServices: React.FC<MyServicesProps> = ({
  loading = true,
  services = [],
  onEditClick,
  onDeleteClick
}) => {
  const currencies: { [key: number]: JSX.Element } = { 
    1: <i className="fas fa-dollar-sign" />, // Dollar
    2: <i className="fas fa-euro-sign" />, // Euro
    3: <i className="fas fa-pound-sign" />, // Pound
    4: <i className="fas fa-yen-sign" /> // Yen
  };

  const columns: GridColDef[] = [
    { 
      field: "type", 
      headerName: "Type", 
      flex: 1, 
      cellClassName: "name-column--cell font-bold" 
    },
    { 
      field: "price", 
      headerName: "Price", 
      flex: 1 
    },
    { 
      field: "currency", 
      headerName: "Currency", 
      flex: 1, 
      renderCell: (params) => {
        const currency = params.row.currency as number;
        return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography>
              {currencies[currency] || ''}
            </Typography>
          </Box>
        );
      } 
    },
    { 
      field: "createdAt", 
      headerName: "Created On", 
      flex: 1, 
      valueFormatter: (params) => {
        const date = new Date(params as string);
        return isValid(date) ? format(date, 'MM-dd-yyyy HH:mm:ss') : 'Invalid Date';
      } 
    },
    { 
      field: "actions", 
      headerName: "Actions", 
      renderCell: (params) => (
        <Box display="flex">
          <IconButton
            color="primary"
            onClick={() => onEditClick(params.row as Service)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            sx={{ color: 'red' }}
            onClick={() => onDeleteClick(params.row as Service)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) 
    },
  ];

  return (
    <div className="services-container">
      {services.length === 0 && loading ? (
        <Spinner />
      ) : (
        <Box
          height="100%"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: 'grey',
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
            rows={services} 
            columns={columns} 
            getRowId={(row) => row.id}
          />
        </Box>
      )}
    </div>
  );
};

export default MyServices;
