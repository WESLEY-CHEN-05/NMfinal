import * as React from 'react';
import {CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { usePage } from '../hooks/usePage';
import CustomizedAppBar from '../components/CustomizedAppBar';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: '司機',
    width: 110,
  },
  {
    field: 'startTime',
    headerName: '上車時間',
    type: 'dateTime',
    width: 250,
  },
  {
    field: 'endTime',
    headerName: '下車時間',
    type: 'dateTime',
    width: 250,
  }
];

const rows = [
  { id: 1, name: 'Jon', startTime: new Date(2013, 2, 1, 1, 10), endTime: new Date(2013, 2, 1, 1, 30) },
  { id: 2, name: 'Cersei', startTime: new Date(2013, 2, 1, 1, 10), endTime: new Date(2013, 2, 1, 1, 30) },
  { id: 3, name: 'Jaime', startTime: new Date(2013, 2, 1, 1, 10), endTime: new Date(2013, 2, 1, 1, 30) },
  { id: 4, name: 'Arya', startTime: new Date(2013, 2, 1, 1, 10), endTime: new Date(2013, 2, 1, 1, 30) },
  { id: 5, name: 'Daenerys', startTime: new Date(2013, 2, 1, 1, 10), endTime: new Date(2013, 2, 1, 1, 30) },
];

export default function History() {
  const { theme } = usePage();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* top */}
      <CustomizedAppBar/>
      {/* main content */}
      <Box sx={{ height: 370, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
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