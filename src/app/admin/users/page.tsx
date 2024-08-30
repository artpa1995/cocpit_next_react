"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal, { Styles } from 'react-modal';
import { format, isValid } from 'date-fns';
import AdminLayout from '../AdminLayout';
import Spinner from '../../components/Spinner';
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalRole, setShowModalRole] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number>(1);
  const [selectedRole, setSelectedRole] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const statuses: Record<number, string> = { 1: 'Pending', 2: 'Approved', 3: 'Rejected' };
  const roles: Record<number, string> = { 1: 'User', 2: 'Admin', 3: 'Coach' };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const customStyles: Styles = {
    content: {
      width: '480px',
      height: '210px',
      margin: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column' as 'column',
      justifyContent: 'start',
      alignItems: 'center',
      gap: '10px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.post('/api/admin/user/getUsers');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    try {
      await axios.post('/api/admin/user/update_user_status', {
        id: selectedUserId,
        status: selectedStatus,
      });
      alert('Status updated successfully');
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async () => {
    try {
      await axios.post('/api/admin/user/update_user_role', {
        id: selectedUserId,
        role: selectedRole,
      });
      alert('Role updated successfully');
      fetchUsers();
      setShowModalRole(false);
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    {
      field: "first_name",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell font-bold",
    },
    {
      field: "last_name",
      headerName: "Last Name",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
   
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const status = params.row.status;
        return (
          <Box
            width="125px"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            sx={{
              backgroundColor: 
                status === 2
                  ? 'rgb(36, 129, 36)'
                  : status === 1
                  ? 'orange'
                  : 'brown',
              cursor: 'pointer',
            }}
            borderRadius="4px"
            onClick={() => { setSelectedUserId(params.row.id); setSelectedStatus(status); setShowModal(true); }}
           
          >
            {status === 1 && <AdminPanelSettingsOutlinedIcon />}
            {status === 2 && <SecurityOutlinedIcon />}
            {status === 3 && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {statuses[status]}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: (params) => {
        const role = params.row.role;
        return (
          <Box
            width="100px"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
          
            sx={{
              backgroundColor: 
              role === 2
              ? 'rgb(36, 129, 36)'
              : role === 1
              ? '#2270cd'
              :'brown',
              cursor: 'pointer',
            }}
            borderRadius="4px"
            onClick={() => { setSelectedUserId(params.row.id); setSelectedRole(role); setShowModalRole(true); }}
         
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {roles[role]}
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
  ];

  return (
    <AdminLayout>
      <div className=' w-full  admin_user_main'>
        {loading ? (
          <Spinner />
        ) : (
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                backgroundColor: 'white',
                borderBottom: "none",
                fontWeight:'bold'
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
            }}
          >
            <DataGrid checkboxSelection rows={users} columns={columns} getRowId={(row) => row.id} />
          </Box>
        )}

        <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} style={customStyles}>
          <h2 className='font-bold'>Change Status</h2>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(Number(e.target.value))}  className="rounded-lg px-5 py-3 border border-gray-600">
            <option value={1}>Pending</option>
            <option value={2}>Approved</option>
            <option value={3}>Rejected</option>
          </select>
          <div className='mt-5 flex gap-4'>
            <button className='text-white bg-sky-900 rounded-lg px-5 py-3' onClick={updateStatus}>Save</button>
          <button className='text-white bg-red-900 rounded-lg px-5 py-3' onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </Modal>

        <Modal isOpen={showModalRole} onRequestClose={() => setShowModalRole(false)} style={customStyles}>
          <h2 className='font-bold'>Change Role</h2>
          <select value={selectedRole} onChange={(e) => setSelectedRole(Number(e.target.value))}  className="rounded-lg px-5 py-3 border border-gray-600">
            <option value={1}>User</option>
            <option value={2}>Admin</option>
            <option value={3}>Coach</option>
          </select>
          <div className='mt-5 flex gap-4'>
            <button className='text-white bg-sky-900 rounded-lg px-5 py-3' onClick={updateRole}>Save</button>
          <button className='text-white bg-red-900 rounded-lg px-5 py-3' onClick={() => setShowModalRole(false)}>Cancel</button>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default UserTable;
