import * as React from 'react';
import {CssBaseline, Box, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { usePage } from '../hooks/usePage';
import CustomizedAppBar from '../components/CustomizedAppBar';
import IssueButton from '../components/IssueButton'

const columns = [
  { field: 'DIDid', headerName: 'DID', width: 400 },
  {
    field: 'name',
    headerName: 'name',
    width: 120,
  },
  {
    field: 'age',
    headerName: 'age',
    type: 'number',
    width: 120,
    headerAlign: 'left',
    align:'left'
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
        subjectDID={'did2'}
        name={params.row.name}
        age={params.row.age}
        time={params.row.time}
      ></IssueButton>
    ),
  },
];

const rows = [
  { DIDid: "did:iota:tst:0xef390554159e55733ab9e3dc3f7538d56007e04d2fd4641a648e52427d16bf79", id: 1, name: 'Jon', age: 14, time: new Date(2013, 2, 1) },
  { id: 2, name: 'Cersei', age: 31, time: new Date(2013, 2, 1) },
  { id: 3, name: 'Jaime', age: 31, time: new Date(2013, 3, 1) },
  { id: 4, name: 'Arya', age: 11, time: new Date(2013, 12, 1) },
  { id: 5, name: 'Daenerys', age: null, time: new Date(2013, 2, 11) },
  { id: 6, name: null, age: 150, time: new Date(2013, 6, 7) },
  { id: 7, name: 'Ferrara', age: 44, time: new Date(2013, 3, 1) },
  { id: 8, name: 'Rossini', age: 36, time: new Date(2013, 2, 1) },
  { id: 9, name: 'Harvey', age: 65, time: new Date(2013, 2, 1) },
];

export default function DriverData() {
  const { theme } = usePage();
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