import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useFormik } from "formik";
import { useSentOtpMutation, useVerifyOtpMutation } from "../redux/services/campaignApi";


const LoginModel = ({ open, onClose }) => {
  const [stepCount, setStepCount] = useState(null);
  const [sendOtp, { isLoading: sendOtpLoading, isSuccess, reset }] =
    useSentOtpMutation();
  const [sendOtpInSeconds,setSendOtpInSeconds]=useState(60)
  const [timerActive, setTimerActive] = useState(false);
  const [
    verifyOtp,
    {
      data,
      isLoading: verifyOtpLoading,
      isSuccess: verifyOtpSuccess,
      reset: verifyOtpReset,
      error: verifyOtpError
    },
  ] = useVerifyOtpMutation();

  
  function removeCountryCode(phoneNumber) {
    const cleanedNumber = phoneNumber.replace(/^\+\d{1,2}/, "");
    return cleanedNumber;
  }

  useEffect(() => {
    if (isSuccess) {
      setStepCount(1);
      setSendOtpInSeconds(60); 
      setTimerActive(true);
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    let timer;
    if (timerActive && sendOtpInSeconds > 0) {
      timer = setInterval(() => {
        setSendOtpInSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      setTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [timerActive, sendOtpInSeconds]);

  useEffect(() => {
    if (verifyOtpSuccess) {
      if (typeof window !== 'undefined') {
        localStorage?.setItem("authToken", data?.token);
        window.location.reload()
      }
      onClose();
    }
  }, [verifyOtpSuccess, data?.token, onClose]);

  const phoneForm = useFormik({
  
    initialValues: {
      mobile_number: "",
    },
    onSubmit: async (values) => {
      const { mobile_number } = values;
      await sendOtp({
        mobile_number: removeCountryCode(mobile_number),
      });
    },
  });

  const otpForm = useFormik({
    initialValues: {
      otp: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.otp) {
        errors.otp = "OTP is required";
      } else if (values.otp.length < 6) {
        errors.otp = "OTP must be 6 digits";
      }
      return errors;
    },
    onSubmit: async (values) => {
      await verifyOtp({
        otp: values.otp,
        mobile_number: removeCountryCode(phoneForm.values.mobile_number),
      });
    },
  });
  

  return (
    <Dialog open={open} onClose={onClose} sx={{borderRadius:'20px' }}  className="px-18 ">
      <form action=""  onSubmit={stepCount?otpForm.handleSubmit:phoneForm.handleSubmit}>


      <DialogTitle className="font-bold text-center ">
        {stepCount ? (
          <>
            Verify OTP 
            <br />
            <p className="text-sm font-thin pt-2">
              Sent to {phoneForm.values?.mobile_number}
            </p>
          </>
        ) : (
          "Login / Sign up "
        )}
      </DialogTitle>
       
      <DialogContent>
      <div className="flex w-full justify-center items-center space-x-2 py-2">
      {stepCount ? (
            <CaptureOtp form={otpForm} />
          ) : (
            <CapturePhoneNumber form={phoneForm} />
          )}
        </div>

        {!stepCount && (
          <div className="w-full text-xs text-center text-gray-400 mt-2">
            Enter 10 digit phone number to login 
          </div>
        )}

        {verifyOtpError && (
          <div className="w-full text-xs text-center text-red-500">
            {verifyOtpError?.data?.error}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        {stepCount ? (
          <div className="w-full flex flex-col">
          
          <Button
  type="button"
  onClick={() => otpForm.handleSubmit()}
  variant="contained"
  className="!mx-auto !-mt-4 w-[57%]"
  sx={{
    backgroundColor: '#ffdd04',
    color: '#000',
    '&:hover': {
      backgroundColor: '#e6c703', // slightly darker on hover
    },
  }}
>
            {verifyOtpLoading ? <CircularProgress size={16} /> : "Verify"}
          </Button>
          <Button
                disabled={sendOtpInSeconds > 0}
                onClick={() => {
                  phoneForm.handleSubmit();
                  setSendOtpInSeconds(60);
                  setTimerActive(true);
                }}
              >
                Resend OTP {sendOtpInSeconds > 0 && `(${sendOtpInSeconds}s)`}
              </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => phoneForm.handleSubmit()}
            variant="contained"
            
            className="w-[50%] !mx-auto !-mt-5 !bg-[#d6573d]"
          >
            {sendOtpLoading ? <CircularProgress size={16} /> : "Submit"}
          </Button>
        )}

      </DialogActions>
      </form>
      <p className="text-xs text-center pb-3 px-3">*By continuing,  I agree to the <a href="/terms" className="text-blue-500">Terms Of Use  </a> and <a href="/privacy-policy" className="text-blue-500">Privacy Policy</a>   </p>
    </Dialog>
  );
};

export default LoginModel;

const CapturePhoneNumber = ({ form }) => {
  return (
    <PhoneInput
      defaultCountry="IN"
      value={form.values?.mobile_number}
      onChange={(value) => form.setFieldValue("mobile_number", value)}
      className="w-[100vw] md:w-[400px]"
      placeholder={"Phone Number"}
    />
  );
};

const CaptureOtp = ({ form }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <TextField
        variant="outlined"
        placeholder="Enter OTP"
        fullWidth
        inputProps={{ maxLength: 6, style: { padding: "8px 10px", height: "30px" } }}
        value={form.values.otp}
        onChange={(e) => form.setFieldValue('otp', e.target.value)}
        error={form.touched.otp && Boolean(form.errors.otp)}
        helperText={form.touched.otp && form.errors.otp}
        sx={{
          "& input": { textAlign: "center", letterSpacing: "0.3em" }
        }}
      />
    </div>
  );
};

