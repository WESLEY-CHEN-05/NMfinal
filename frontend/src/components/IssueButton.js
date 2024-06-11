import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { usePage } from '../hooks/usePage';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  outline: 'none', // 移除預設框線
};

export default function BasicModal({ issuerDID, subjectDID, name }) {
  const [open, setOpen] = React.useState(false);
  const [jwtKeyID, setJwtKeyID] = React.useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { identity } = usePage();

  const handleIssue = () => {
    console.log(`Issuer: ${issuerDID}, Subject: ${subjectDID}, Name: ${name}, JwtKeyID: ${jwtKeyID}`);
    setOpen(false);
  };

  return (
    <div>
      {identity !== 'issuer' ? (
        <Button variant="contained" style={{ backgroundColor: '#D2B48C', color: '#000' }} onClick={handleOpen}>
          Issue
        </Button>
      ) : null}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2" marginBottom={2} sx={{ fontWeight: 600 }}>
            Issue Credential
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={2} sx={{ fontSize: '18px', fontWeight: 400}}>
            Issuer DID: {issuerDID}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={2} sx={{ fontSize: '18px', fontWeight: 400}}>
            Subject DID: {subjectDID}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={3} sx={{ fontSize: '18px', fontWeight: 400}}>
            Subject Name: {name}
          </Typography>
          <TextField
            label="JwtKey"
            variant="outlined"
            fullWidth
            value={jwtKeyID}
            onChange={(e) => setJwtKeyID(e.target.value)}
            margin="normal"
            style={{ marginBottom: '24px' }} // 增加更多空間
          />
          <Button variant="contained" color="secondary" onClick={handleIssue} fullWidth>
            Issue
          </Button>
        </Box>
      </Modal>
    </div>
  );
}