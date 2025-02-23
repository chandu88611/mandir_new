import React from 'react';
import { Modal, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { MdPerson, MdEmail, MdPhone, MdBusiness } from 'react-icons/md';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { useCreateEnquiryMutation } from '../redux/services/campaignApi';

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  number: yup
    .string()
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
    .required('Mobile number is required'),
  trust: yup.string().required('Trust name is required'),
  purpose: yup.string().required('Purpose is required'),
});

const FormModal = ({ open, onClose }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
const [create,{isLoading}]=useCreateEnquiryMutation()
  const onSubmit = async(data) => {
 const res =await create(data)
 console.log(res)
 if(res?.data?.status){
  onClose()
  Swal.fire({
    title: "Success",
    text: "Campaign added",
    icon: "success"
  });
 }else{
  onClose()
  Swal.fire({
    title: "Error",
    text: res?.error.data?.error,
    icon: "error"
  });
 }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="p-6 bg-white rounded-lg shadow-lg mx-auto my-20 max-w-lg w-full">
        <Typography variant="h6" className="mb-4 text-center">
          Donation Form
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Your Name"
                variant="outlined"
                fullWidth
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ''}
                InputProps={{
                  startAdornment: <MdPerson className="mr-2 text-gray-500" />,
                }}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                fullWidth
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
                InputProps={{
                  startAdornment: <MdEmail className="mr-2 text-gray-500" />,
                }}
              />
            )}
          />
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mobile Number (10 digit)"
                variant="outlined"
                fullWidth
                error={!!errors.number}
                helperText={errors.number ? errors.number.message : ''}
                InputProps={{
                  startAdornment: <MdPhone className="mr-2 text-gray-500" />,
                }}
              />
            )}
          />
          <Controller
            name="trust"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Trust Name"
                variant="outlined"
                fullWidth
                error={!!errors.trust}
                helperText={errors.trust ? errors.trust.message : ''}
                InputProps={{
                  startAdornment: <MdBusiness className="mr-2 text-gray-500" />,
                }}
              />
            )}
          />
          <Controller
            name="purpose"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Purpose"
                variant="outlined"
                fullWidth
                error={!!errors.purpose}
                helperText={errors.purpose ? errors.purpose.message : ''}
                InputProps={{
                  startAdornment: <MdBusiness className="mr-2 text-gray-500" />,
                }}
              />
            )}
          />
          <Typography variant="body2" className="mt-4 text-center py-2">
            By continuing, you are agreeing to{' '}
            <a href="/terms" className="text-orange-500">
              Terms of Use
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-orange-500">
              Privacy Policy
            </a>
          </Typography>
          <Button
            type="submit"
            variant="contained"
            className="w-full mt-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white"
          >
            {isLoading?<CircularProgress size={24}/>:"Continue"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default FormModal;
