import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is a required field'),
  mobileNumber: yup.string().required('Mobile number is a required field'),
  email: yup.string().email('Invalid email').required('Email is a required field'),
  billingAddress: yup.string().min(5, 'Billing address should be at least 5 characters').required('Billing address is a required field'),
  pincode: yup.string().required('Pincode is a required field'),
  panNumber: yup.string().required('PAN number is a required field'),
});

const DonationForm = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = data => {
    console.log(data);
  };

  return (
    <div className="max-w-2xl mx-auto ">
      <form onSubmit={handleSubmit(onSubmit)} className=" bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Donation Amount</h2>
        <div className="flex space-x-4">
          <button type="button" className="flex-1 bg-gray-200 py-2 rounded">₹2,000</button>
          <button type="button" className="flex-1 bg-gray-200 py-2 rounded">₹5,000</button>
          <button type="button" className="flex-1 bg-red-500 text-white py-2 rounded">₹10,000</button>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <input type="checkbox" id="indian" className="h-4 w-4" />
          <label htmlFor="indian" className="text-gray-600">You're an Indian</label>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700">Full Name</label>
          <input {...register('fullName')} className="w-full border p-2 rounded mt-1" />
          {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName.message}</p>}
        </div>
        <div className="mt-4">
          <label className="block text-gray-700">Mobile Number</label>
          <input {...register('mobileNumber')} className="w-full border p-2 rounded mt-1" />
          {errors.mobileNumber && <p className="text-red-600 text-sm">{errors.mobileNumber.message}</p>}
        </div>
        <div className="mt-4">
          <label className="block text-gray-700">Email</label>
          <input {...register('email')} className="w-full border p-2 rounded mt-1" />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
        <div className="mt-4">
          <label className="block text-gray-700">Billing Address</label>
          <input {...register('billingAddress')} className="w-full border p-2 rounded mt-1" />
          {errors.billingAddress && <p className="text-red-600 text-sm">{errors.billingAddress.message}</p>}
        </div>
        <div className="mt-4">
          <label className="block text-gray-700">Pincode</label>
          <input {...register('pincode')} className="w-full border p-2 rounded mt-1" />
          {errors.pincode && <p className="text-red-600 text-sm">{errors.pincode.message}</p>}
        </div>
        <div className="mt-4">
          <label className="block text-gray-700">PAN Number</label>
          <input {...register('panNumber')} className="w-full border p-2 rounded mt-1" />
          {errors.panNumber && <p className="text-red-600 text-sm">{errors.panNumber.message}</p>}
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <input type="checkbox" id="updates" className="h-4 w-4" />
          <label htmlFor="updates" className="text-gray-600">Send me updates and notifications via WhatsApp/SMS</label>
        </div>
        <div className="mt-4 flex space-x-4">
          <button type="submit" className="flex-1 bg-red-500 text-white py-2 rounded">Proceed to pay ₹10,800</button>
          <button type="button" className="flex-1 bg-gray-200 py-2 rounded">Make a direct bank transfer</button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
