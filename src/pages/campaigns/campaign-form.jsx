import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useFormik } from "formik";

import * as Yup from "yup";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import {
  useCreateCampaignMutation,
  useCreateSubCampaignMutation,
  useDeleteSubCampaignMutation,
  useGetAllCampaignQuery,
  useGetCampaignQuery,
  useUpdateCampaignMutation,
  useUpdateSubCampaignMutation,
} from "../../redux/services/campaignApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  DatePicker,
  Flex,
  Image,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
  Upload,
} from "antd";
import PrimaryWrapper from "../../components/PrimaryWrapper";

import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";

const CampaignForm = () => {
  const { campaignId } = useParams();
  const router = useNavigate();
  const base64Image = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const { data: singleCampaign, isLoading } = useGetCampaignQuery(campaignId, {
    skip: !campaignId,
  });

  const [
    CreateCampaign,
    { isLoading: creating, isSuccess, isError: createError },
  ] = useCreateCampaignMutation();

  const [updateCampaign, { isLoading: updating, isError, isSuccess: updated }] =
    useUpdateCampaignMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success("Campaign created successfully");
      router("/campaigns");
    }
    if (updated) {
      message.success("Campaign Updated successfully");
      router("/campaigns");
    }
    if (isError || createError) {
      message.error("Something went wrong");
    }

    return () => {};
  }, [router, isSuccess, isError, createError, updated]);

  const form = useFormik({
    initialValues: singleCampaign ? singleCampaign?.data?.campaign : {},
    enableReinitialize: true,

    validationSchema: Yup.object().shape({
      temple_name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      start_date: Yup.string().required("Required"),
    }),

    onSubmit: async (values) => {
      if (campaignId) {
        const { featured_image_base_url, ...rest } = values;
        console.log(featured_image_base_url);
        if (featured_image_base_url?.name) {
          const image = await base64Image(values.featured_image_base_url);
          await updateCampaign({
            id: campaignId,
            body: { ...rest, featured_image_base_url: image, id: campaignId },
          });
        } else {
          await updateCampaign({
            id: campaignId,
            body: { ...rest },
          });
        }

        // await updateCampaign({
        //   id: campaignId,
        //   body: { ...values, featured_image_base_url: image },
        // });
      } else {
        const image = await base64Image(values.featured_image_base_url);
        await CreateCampaign({ ...values, featured_image_base_url: image });
      }
    },
  });

  return (
    <PrimaryWrapper>
      <Typography.Title
        level={3}
        className="flex w-full items-center font-bold text-2xl space-y-4"
      >
        {campaignId ? "Update Campaign" : "Create Campaign"}{" "}
      </Typography.Title>
      <Card loading={isLoading} className="flex flex-col space-y-7 py-8  px-16">
        <div className="pb-10" sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* <TextField
                size="medium"
                type="file"
                autoFocus
                variant="standard"
                name="featured_image_base_url"
                label="Select Image"
                fullWidth
                // value={
                //   form.values?.featured_image_base_url?.fileName ||
                //   form.values?.featured_image_base_url
                // }
                error={form.errors?.featured_image_base_url}
                onChange={(e) =>
                  form.setFieldValue(
                    "featured_image_base_url",
                    e.target.files?.[0]
                  )
                }
              /> */}
              <Upload
                multiple={false}
                customRequest={(e) => {
                  console.log(e.file);
                  form.setFieldValue("featured_image_base_url", e.file);
                }}
                // onChange={(e) => {
                //   console.log(e.file);
                //   form.setFieldValue(
                //     "featured_image_base_url",
                //     e.file.originFileObj
                //   );
                // }}

                // fileList={false}
                showUploadList={false}
              >
                <Button variant="outlined" icon={<UploadOutlined />}>
                  Click to Upload
                </Button>
              </Upload>
            </Grid>
            <Grid item xs={6}>
              {typeof form.values?.featured_image_base_url === "string" && (
                <Image
                  src={form.values?.featured_image_base_url}
                  height={80}
                  width={100}
                  style={{ objectFit: "contain" }}
                />
              )}
              {typeof form.values?.featured_image_base_url === "object" && (
                <Image
                  src={
                    form.values?.featured_image_base_url &&
                    window.URL.createObjectURL(
                      form.values.featured_image_base_url
                    )
                  }
                  height={80}
                  width={100}
                  style={{ objectFit: "contain" }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                focused={form.values?.temple_name}
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
                focused={form.values?.trust}
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
                focused={form.values?.campaign_name}
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
                focused={form.values?.description}
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
                focused={form.values?.about}
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
                focused={form.values?.location}
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
                focused={form.values?.event}
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
                focused={form.values?.minimum_amount}
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
                focused={form.values?.target_amount}
                value={form.values?.target_amount}
                error={form.errors?.target_amount}
                onChange={(e) =>
                  form.setFieldValue("target_amount", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={2}>
              <DatePicker
                size="medium"
                name="start_date"
                placeholder="Start Date"
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
            <Grid item xs={2}>
              <DatePicker
                size="medium"
                name="end_date"
                placeholder="End Date"
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
              <DatePicker
                size="medium"
                name="expiry_date"
                placeholder="Expired Date"
                fullWidth
                value={
                  form.values?.expiry_date
                    ? dayjs(form.values?.expiry_date)
                    : null
                }
                error={form.errors?.expiry_date}
                onChange={(value) =>
                  form.setFieldValue(
                    "expiry_date",
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
                    checked={Boolean(form.values?.is_active)}
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
                    checked={Boolean(form.values?.is_expired)}
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
                    checked={Boolean(form.values?.is_published)}
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
            <Button type="primary" onClick={form.handleSubmit}>
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
      </Card>
      {campaignId && (
        <SubCampaignTable
          base64Image={base64Image}
          data={singleCampaign?.data?.subdonations}
        />
      )}
    </PrimaryWrapper>
  );
};

export default CampaignForm;

const SubCampaignTable = ({ base64Image, data }) => {
  const [subCampaign, setSubCampaign] = useState(null);
  const [subCampaignModel, setSubCampaignModel] = useState(null);
  const [deleteRecord, { isLoading: deleting }] =
    useDeleteSubCampaignMutation();
  // const [updateRecord, { isLoading: updating }] =
  //   useDeleteSubCampaignMutation();

  const columns = [
    {
      dataIndex: "id",
      title: "ID",
      width: 40,
      render: (record, item, index) => index + 1,
    },
    {
      dataIndex: "name",
      title: "Name",
      width: 200,
      sortable: false,
    },

    {
      dataIndex: "amount",
      title: "Amount",
      // type: "number",
      width: 110,
      sortable: false,
    },

    {
      dataIndex: "created_at",
      title: "Created At",
      // type: "number",
      width: 150,
      sortable: false,
      render: (record) => moment(record).calendar(),
    },
    {
      title: "Action",
      dataIndex: "id",
      fixed: "right",
      width: 100,
      render: (record, item) => (
        <Space>
          <Button
            onClick={() => {
              setSubCampaign(item);
              setSubCampaignModel(true);
            }}
            icon={<EditOutlined />}
          />
          <Popconfirm
            title="Are you sure to delete this?"
            onConfirm={() => deleteRecord(record)}
            okText="Yes"
            okButtonProps={{ loading: deleting }}
            placement="topLeft"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row
        justify={"space-between"}
        gutter={[0, 0]}
        style={{ padding: "20px 0" }}
        align="middle"
      >
        <Typography.Title level={3}>Sub Campaigns</Typography.Title>
        <Button
          size="middle"
          type="primary"
          onClick={() => setSubCampaignModel(true)}
        >
          Create
        </Button>
      </Row>
      <Table
        columns={columns}
        dataSource={data || []}
        // loading={isLoading}
        // onChange={onChange}
        pagination={false}
      />
      {/* <Flex justify="right" style={{ marginTop: "20px" }}>
        <Pagination
          defaultCurrent={1}
          total={data?.count || 0}
          pageSize={10}
          showSizeChanger={false}
          // onChange={onChange}
          // current={+page}
          hideOnSinglePage={true}
        />
      </Flex> */}
      {/* {subCampaignModel && ( */}
      <SubDonationForm
        open={subCampaignModel}
        base64Image={base64Image}
        onClose={() => {
          setSubCampaign(null);
          setSubCampaignModel(false);
        }}
        subCampaign={subCampaign}
      />
    </>
  );
};

const SubDonationForm = ({
  open,
  onClose,
  base64Image,
  subCampaign,
  campaign_id,
}) => {
  const { campaignId } = useParams();
  const [createSubDomain, { isLoading: creating, isSuccess, isError, reset }] =
    useCreateSubCampaignMutation();
  const [
    updateSubCampaign,
    {
      isLoading: updating,
      isSuccess: updated,
      reset: resetUpdate,
      isError: updateError,
    },
  ] = useUpdateSubCampaignMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success("Sub Campaign created successfully");
      onClose();
      reset();
    }
    if (updated) {
      message.success("Sub Campaign Updated successfully");
      onClose();
      resetUpdate();
    }
    if (isError || updateError) {
      message.error("Something went wrong");
      reset();
      resetUpdate();
    }

    return () => {};
  }, [isSuccess, reset, onClose, updated, resetUpdate, isError, updateError]);

  const form = useFormik({
    initialValues: subCampaign ? { ...subCampaign } : {},

    enableReinitialize: true,

    onSubmit: async (values) => {
      if (subCampaign?._id) {
        const { featured_image, ...rest } = values;

        if (featured_image?.name) {
          const image = await base64Image(values.featured_image);
          await updateSubCampaign({
            id: subCampaign?._id,
            body: { ...rest, featured_image: image, campaign_id: campaignId },
          });
        } else {
          await updateSubCampaign({
            id: subCampaign?._id,
            body: { ...rest, campaign_id: campaignId },
          });
        }

        // await updateCampaign({
        //   id: campaignId,
        //   body: { ...values, featured_image_base_url: image },
        // });
      } else {
        const image = await base64Image(values.featured_image);
        await createSubDomain({
          ...values,
          featured_image: image,
          campaign_id: +campaignId,
        });
      }
    },
  });
  console.log(form.values);

  return (
    <Modal open={open} onCancel={onClose} width={800} footer={null}>
      <Flex vertical gap={10} style={{ padding: "30px 0" }}>
        <Typography.Title level={3}>SubCampaigns</Typography.Title>

        {/* <div className="pb-10"> */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Upload
              multiple={false}
              customRequest={(e) => {
                console.log(e.file);
                form.setFieldValue("featured_image", e.file);
              }}
              // onChange={(e) => {
              //   console.log(e.file);
              //   form.setFieldValue(
              //     "featured_image",
              //     e.file.originFileObj
              //   );
              // }}

              // fileList={false}
              showUploadList={false}
            >
              <Button variant="outlined" icon={<UploadOutlined />}>
                Click to Upload
              </Button>
            </Upload>
          </Grid>
          <Grid item xs={6}>
            {typeof form.values?.featured_image === "string" && (
              <Image
                src={form.values?.featured_image}
                height={80}
                width={100}
                style={{ objectFit: "contain" }}
              />
            )}
            {typeof form.values?.featured_image === "object" && (
              <Image
                src={
                  form.values?.featured_image &&
                  window.URL.createObjectURL(form.values.featured_image)
                }
                height={80}
                width={100}
                style={{ objectFit: "contain" }}
              />
            )}
          </Grid>
          <Grid item xs={6}>
            <TextField
              focused={form.values?.name}
              size="medium"
              name="name"
              label="Name"
              fullWidth
              value={form.values?.name || ""}
              error={form.errors?.name}
              onChange={(e) => form.setFieldValue("name", e.target.value)}
            />
          </Grid>
          {/* <Grid item xs={6}>
            <TextField
              size="medium"
              type="file"
              variant="standard"
              name="featured_image"
              label="Select Image"
              fullWidth
              value={form.values?.featured_image?.fileName}
              error={form.errors?.featured_image}
              onChange={(e) =>
                form.setFieldValue("featured_image", e.target.files?.[0])
              }
            />
          </Grid> */}

          <Grid item xs={6}>
            <TextField
              focused={form.values?.amount}
              size="medium"
              name="amount"
              label="Amount"
              fullWidth
              value={form.values?.amount || ""}
              error={form.errors?.amount}
              onChange={(e) => form.setFieldValue("amount", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              minRows={3}
              focused={form.values?.description}
              multiline
              size="medium"
              name="description"
              label="Description"
              fullWidth
              value={form.values?.description || ""}
              error={form.errors?.description}
              onChange={(e) =>
                form.setFieldValue("description", e.target.value)
              }
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
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            loading={creating || updating}
            onClick={form.handleSubmit}
          >
            {subCampaign?._id ? "Update" : "Create"}
          </Button>
        </Stack>
        {/* </div> */}
      </Flex>
    </Modal>
  );
};
