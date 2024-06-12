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

const columns = [
  { field: 'DIDid', headerName: 'DID', width: 100 },
  {
    field: 'name',
    headerName: 'name',
    width: 120,
  },
  {
    field: 'time',
    headerName: 'issued time',
    type: 'date',
    width: 120,
  },
  {
    field: 'issued',
    headerName: 'Issue',
    renderCell: (params) => (
      <IssueButton
        issuerDID={'did1'}
        subjectDID={params.row.DIDid}
        name={params.row.name}
        age={params.row.age}
        time={params.row.time}
      ></IssueButton>
    ),
  },
];


export default function DriverData() {
  const { theme } = usePage();
  const [rows, setRows] = useState([]);
  const { loading, error, data } = useQuery(GET_DRIVERS);
  useEffect(() => {
    if (!data) return
    const newRows = data.getDrivers.map((driver, id) => ({
      id,
      DIDid: driver.DIDid,
      name: driver.lastName + driver.firstName,
      time: new Date(2013, 6, 7)
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