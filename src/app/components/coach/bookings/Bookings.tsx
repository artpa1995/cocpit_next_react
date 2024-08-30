import React from 'react';

// import { format, isValid } from 'date-fns';
// import Spinner from '../../Spinner'; 
// import { Box, Typography, IconButton  } from "@mui/material";
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

interface Company {
  id: string;
  title: string;
  city: string;
  state: string;
  country: string;
  industry: string;
  clients: string[];

}

interface BookinsProps {
  loading: boolean;
  companies?: Company;
  onEditClick: () => void;
  onDeleteClick: () => void;
}


// const Bookings = ({loading = true, companies={}, onEditClick, onDeleteClick}) => {
  const Bookings: React.FC<BookinsProps> = ({ loading = true,  companies={}, onEditClick, onDeleteClick }) => {
  
  
  return (
    <div className="companies-container">
     Not Data
    </div>
  );
};

export default Bookings;
