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
    headerName: '姓名',
    width: 150,
  },
  {
    field: 'age',
    headerName: '年齡',
    type: 'number',
    width: 110,
  },
  {
    field: 'time',
    headerName: '認證時間',
    type: 'number',
    width: 110,
  }
];

const rows = [
  { id: 1, name: 'Jon', age: 14, time: '2002' },
  { id: 2, name: 'Cersei', age: 31, time: '1999' },
  { id: 3, name: 'Jaime', age: 31, time: '2000' },
  { id: 4, name: 'Arya', age: 11, time: '2000' },
  { id: 5, name: 'Daenerys', age: null, time: '2000' },
  { id: 6, name: null, age: 150, time: '2000' },
  { id: 7, name: 'Ferrara', age: 44, time: '2000' },
  { id: 8, name: 'Rossini', age: 36, time: '2000' },
  { id: 9, name: 'Harvey', age: 65, time: '2000' },
];

export default function DriverData() {
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