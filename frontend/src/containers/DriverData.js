import * as React from 'react';
import {CssBaseline, Box, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { usePage } from '../hooks/usePage';
import CustomizedAppBar from '../components/CustomizedAppBar';
import IssueButton from '../components/IssueButton'
import { GET_DRIVERS } from "../graphql/query";
import { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client";

export default function DriverData() {
  const { theme, userDID } = usePage();
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([]);
  const { loading, error, data } = useQuery(GET_DRIVERS);

  useEffect(() => {
    setColumns([
      { field: 'name', headerName: 'Name',  width: 80 },
      { field: 'DIDid', headerName: 'DID', width: 180 },
      { field: 'licenseNumber', headerName: 'License Number', width: 120 },
      { field: 'dueDate', headerName: 'License Due Date', width: 120 },
      { field: 'email', headerName: 'Email', width: 180 },
      { field: 'issued', headerName: 'Issue VC',
        renderCell: (params) => (
          <IssueButton
            subjectDID={params.row.DIDid}
            name={params.row.name}
            licenseNumber={params.row.licenseNumber}
            dueDate={params.row.dueDate}
            email={params.row.email}
          ></IssueButton>
        ),
      },
    ]);
  }, [userDID])

  useEffect(() => {
    if (!data) return
    const newRows = data.getDrivers.map((driver, id) => ({
      id,
      DIDid: driver.DIDid,
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      dueDate: driver.dueDate,
      email: driver.email
    }))
    setRows(newRows);
    console.log(data.getDrivers);
  }, [data]);
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* top */}
      <CustomizedAppBar/>
      {/* main content */}
      <Box sx={{ height: 500, width: '70%', margin: '100px auto' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </ThemeProvider>
  );
}