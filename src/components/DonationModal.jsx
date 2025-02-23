import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Radio, RadioGroup, FormControlLabel, FormLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/system';

const style = {
  position: 'absolute',
  top: '50%',
  height: "95%",
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',  // Default width for small screens
  maxWidth: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  fontFamily: 'sans-serif',
  overflowY: "scroll"
};

const ModalHeader = styled(Box)({
  fontWeight: 'bold',
  fontSize: '20px',
  marginBottom: '10px',
  textAlign: 'center',
});

const DonationButton = styled(Button)({
  width: '100%',
  backgroundColor: '#ff7f00',
  color: 'white',
  '&:hover': {
    backgroundColor: '#ff6000',
  },
});

export default function DonationModal({ data }) {
  const [open, setOpen] = useState(true);
  const [tipAmount, setTipAmount] = useState('14%');

  const handleClose = () => setOpen(false);

  // Assuming data.subdonations[0] is the current subdonation you want to display
  // const donationAmount = parseFloat(data?.subdonations[0]?.amount || 0);
  const donationAmount = 3000
  const tipPercentage = parseFloat(tipAmount) / 100;
  const tipValue = donationAmount * tipPercentage;
  const totalAmount = donationAmount + tipValue;

  return (
    <Modal open={open} onClose={handleClose}>
      {<Box sx={style}>
        <ModalHeader>
          <p className='!text-lg'>
            {data?.campaign?.campaign_name} - {data?.campaign?.temple_name}
          </p>
        </ModalHeader>
        <Box className="text-center mb-4">
          <p>{ 'No Description'} - ₹{donationAmount}</p>
        </Box>

        <Box className="mb-4">
          <FormLabel component="legend">Share Some Love?</FormLabel>
          <RadioGroup
            value={tipAmount}
            onChange={(e) => setTipAmount(e.target.value)}
            row
          >
            <FormControlLabel value="12%" control={<Radio />} label="12%" />
            <FormControlLabel value="14%" control={<Radio />} label="14%" />
            <FormControlLabel value="Other" control={<Radio />} label="Other Amount" />
          </RadioGroup>
          <p>Total: ₹{totalAmount?.toFixed(2)} (₹{donationAmount} donation amount + ₹{tipValue?.toFixed(2)} tip amount)</p>
        </Box>

        <Box component="form" className="space-y-4">
          <TextField fullWidth label="Full Name" variant="standard" />
          <FormControlLabel
            control={<Checkbox />}
            label="Contribute Anonymously"
          />
          <TextField fullWidth label="Email" variant="standard" />
          <Box className="flex space-x-2">
            <TextField fullWidth label="Phone Number" variant="standard" />
          </Box>
          <TextField fullWidth label="Billing State" variant="standard" value="Karnataka" />
          <Box className="space-y-2">
            <FormLabel component="legend">Are you an Indian Citizen?</FormLabel>
            <RadioGroup row>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </Box>
          <FormControlLabel
            control={<Checkbox />}
            label="I want to receive transaction updates / alerts"
          />
        </Box>

        <Box className="mt-6">
          <DonationButton variant="contained">DONATE NOW (₹{totalAmount.toFixed(2)})</DonationButton>
        </Box>
      </Box>}
    </Modal>
  );
}
