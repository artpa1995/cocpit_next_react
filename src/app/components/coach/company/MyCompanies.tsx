import React from 'react';
import { format, isValid } from 'date-fns';
import Spinner from '../../Spinner'; 
import { Box, Typography, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

interface MyCompaniesProps {
  loading?: boolean;
  companies: Company[];
  onEditClick: (company: Company) => void;
  onDeleteClick: (company: Company) => void;
}

const MyCompanies: React.FC<MyCompaniesProps> = ({
  loading = true,
  companies = [],
  onEditClick,
  onDeleteClick
}) => {
  const columns: GridColDef[] = [
    { 
      field: "title", 
      headerName: "Title", 
      flex: 1, 
      cellClassName: "name-column--cell font-bold" 
    },
    { 
      field: "revenue", 
      headerName: "Revenue", 
      headerAlign: "left", 
      align: "left" 
    },
    { 
      field: "employees",
      headerName: "Employees",
      headerAlign: "left", 
      align: "left" 
    },
    { 
      field: "country", 
      headerName: "Country", 
      flex: 1, 
      cellClassName: "name-column--cell font-bold" 
    },
    { 
      field: "state", 
      headerName: "State", 
      flex: 1, 
      cellClassName: "name-column--cell font-bold" 
    },
    { 
      field: "city", 
      headerName: "City", 
      flex: 1, 
      cellClassName: "name-column--cell font-bold" 
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
            onClick={() => onEditClick(params.row as Company)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            sx={{ color: 'red' }}
            onClick={() => onDeleteClick(params.row as Company)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) 
    },
  ];

  return (
    <div className="companies-container">
      {companies.length === 0 && loading ? (
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
            "& .name-column--cell": {
              color: 'grey',
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              backgroundColor: 'white',
              borderBottom: "none",
              fontWeight: 'bold'
            },
            "& .MuiDataGrid-virtualScroller": {
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
            },
            "& .MuiCheckbox-root": {
            },
          }}
        >
          <DataGrid
            rows={companies}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </Box>
      )}
    </div>
  );
};

export default MyCompanies;
