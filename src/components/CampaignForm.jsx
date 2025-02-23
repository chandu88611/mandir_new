"use client";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useFormik } from "formik";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import * as Yup from "yup";

import React, { useEffect } from "react";
import dayjs from "dayjs";

import { useCreateCampaignMutation, useUpdateCampaignMutation } from "../redux/services/campaignApi";
import { useNavigate } from "react-router-dom";

const CampaignForm = ({ campaignId }) => {
  const router = useNavigate();
  const base64Image = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // const {data: singleCampaign} = useGetAllCampaignQuery(campaignId)

  const [CreateCampaign, { isLoading: creating, isSuccess }] =
    useCreateCampaignMutation();

  const [updateCampaign, { isLoading: updating }] = useUpdateCampaignMutation();

  useEffect(() => {
    if (isSuccess) {
      router("/admin/campaigns");
    }

    return () => {};
  }, [router, isSuccess]);

  const form = useFormik({
    initialValues: {},
    enableReinitialize: true,

    validationSchema: Yup.object().shape({
      temple_name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      start_date: Yup.string().required("Required"),
      end_date: Yup.string().required("Required"),
    }),

    onSubmit: async (values) => {
      const image = await base64Image(values.featured_image_base_url);

      if (campaignId) {
        await updateCampaign({ ...values, featured_image_base_url: image });
      } else {
        await CreateCampaign({ ...values, featured_image_base_url: image });
      }
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col space-y-7 py-8  px-16">
        <div className="flex w-full items-center font-bold text-2xl space-y-4">
          {campaignId ? "Update Campaign" : "Create Campaign"}{" "}
        </div>
        <div className="pb-10" sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                size="medium"
                type="file"
                variant="standard"
                name="featured_image_base_url"
                label="Select Image"
                fullWidth
                value={form.values?.featured_image_base_url?.fileName}
                error={form.errors?.featured_image_base_url}
                onChange={(e) =>
                  form.setFieldValue(
                    "featured_image_base_url",
                    e.target.files?.[0]
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="medium"
                name="temple_name"
                label="Temple Name"
                fullWidth
                value={form.values?.temple_name}
                error={form.errors?.temple_name}
                onChange={(e) =>
                  form.setFieldValue("temple_name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="medium"
                name="trust"
                label="Trust"
                fullWidth
                value={form.values?.trust}
                error={form.errors?.trust}
                onChange={(e) => form.setFieldValue("trust", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="medium"
                name="campaign_name"
                label="Campaign Name"
                fullWidth
                value={form.values?.campaign_name}
                error={form.errors?.campaign_name}
                onChange={(e) =>
                  form.setFieldValue("campaign_name", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                minRows={3}
                multiline
                size="medium"
                name="description"
                label="Description"
                fullWidth
                value={form.values?.description}
                error={form.errors?.description}
                onChange={(e) =>
                  form.setFieldValue("description", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                minRows={3}
                multiline
                size="medium"
                name="about"
                label="About"
                fullWidth
                value={form.values?.about}
                error={form.errors?.about}
                onChange={(e) => form.setFieldValue("about", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="medium"
                name="location"
                label="Location"
                fullWidth
                value={form.values?.location}
                error={form.errors?.location}
                onChange={(e) => form.setFieldValue("location", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="medium"
                name="event"
                label="Event"
                fullWidth
                value={form.values?.event}
                error={form.errors?.event}
                onChange={(e) => form.setFieldValue("event", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="medium"
                name="minimum_amount"
                label="Minimum amount"
                fullWidth
                value={form.values?.minimum_amount}
                error={form.errors?.minimum_amount}
                onChange={(e) =>
                  form.setFieldValue("minimum_amount", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="medium"
                name="target_amount"
                label="Target amount"
                fullWidth
                value={form.values?.target_amount}
                error={form.errors?.target_amount}
                onChange={(e) =>
                  form.setFieldValue("target_amount", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={3}>
              <DatePicker
                size="medium"
                name="start_date"
                label="Start Date"
                fullWidth
                value={
                  form.values?.start_date
                    ? dayjs(form.values?.start_date)
                    : null
                }
                error={form.errors?.start_date}
                onChange={(value, context) => {
                  console.log(value, context);
                  form.setFieldValue(
                    "start_date",
                    dayjs(value).format("YYYY-MM-DD")
                  );
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <DatePicker
                size="medium"
                name="end_date"
                label="End Date"
                fullWidth
                value={
                  form.values?.end_date ? dayjs(form.values?.end_date) : null
                }
                error={form.errors?.end_date}
                onChange={(value) =>
                  form.setFieldValue(
                    "end_date",
                    dayjs(value).format("YYYY-MM-DD")
                  )
                }
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="medium"
                    name="is_active"
                    value={form.values?.is_active}
                    error={form.errors?.is_active}
                    onChange={(e) =>
                      form.setFieldValue("is_active", e.target.checked)
                    }
                  />
                }
                label="Is Active"
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="medium"
                    name="is_expired"
                    value={form.values?.is_expired}
                    error={form.errors?.is_expired}
                    onChange={(e) =>
                      form.setFieldValue("is_expired", e.target.checked)
                    }
                  />
                }
                label="Is Expired"
              />
            </Grid>
            <Grid item xs={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="medium"
                    name="is_published"
                    value={form.values?.is_published}
                    error={form.errors?.is_published}
                    onChange={(e) =>
                      form.setFieldValue("is_published", e.target.checked)
                    }
                  />
                }
                label="Is Published"
              />
            </Grid>
          </Grid>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            mt={4}
          >
            <Button variant="outlined" color="primary" size="large">
              Cancel
            </Button>
            <Button variant="contained" onClick={form.handleSubmit}>
              {creating || updating ? (
                <CircularProgress size={18} color="inherit" />
              ) : campaignId ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </Stack>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default CampaignForm;
