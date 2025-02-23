import {
  Checkbox,
  CircularProgress,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import {
  useCreateCampaignByUserMutation,
  useLazyGetUserCampaignByIdQuery,
  useUpdateCampaignByUserMutation,
} from "../../redux/services/campaignApi";
import { useNavigate } from "react-router-dom";
import { Button, Card, Image, message, Upload } from "antd";
import PrimaryWrapper from "../../components/PrimaryWrapper";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles for the text editor

const imageHandler = async function (insertImageCallback, campaignId) {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (file) {
      const base64Image = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };
      const base64 = await base64Image(file);
      try {
        const { data } = await axios.post(
          "https://devaseva.onrender.com/api/donation_campaign/upload-text-editor-image",
          { image: base64, campaignId: campaignId }
        );
        const imageUrl = data.imageUrl;
        const range = this.quill.getSelection();
        insertImageCallback(imageUrl);
        this.quill.insertEmbed(range.index, "image", imageUrl);
        this.quill.setSelection(range.index + 1);
      } catch (error) {
        message.error("Image upload failed");
      }
    }
  };
};

const createQuillModules = (campaignId, insertImageCallback) => ({
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["image"],
    ],
    handlers: {
      image: function () {
        imageHandler.call(this, insertImageCallback, campaignId);
      },
    },
  },
});

const CampaignForm = ({ campaign, refetch }) => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorModules, setEditorModules] = useState(null);
  const navigate = useNavigate();

  const [temporaryImages, setTemporaryImages] = useState([]);
  const [createCampaign, { isLoading: creating }] = useCreateCampaignByUserMutation();
  const [updateCampaign, { isLoading: updating }] = useUpdateCampaignByUserMutation();
  const [getCampaign, { data: fetchedCampaign }] = useLazyGetUserCampaignByIdQuery();

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    if (editorLoaded) {
      const insertImageCallback = (imageUrl) => {
        setTemporaryImages((prevImages) => [...prevImages, imageUrl]);
      };
      setEditorModules(createQuillModules(null, insertImageCallback));
    }
  }, [editorLoaded]);

  useEffect(() => {
    if (campaign) {
      getCampaign(campaign._id);
    }
  }, [campaign, getCampaign]);

  const base64Image = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const form = useFormik({
    initialValues: {
      campaign_title: campaign?.campaign_title || "",
      short_description: campaign?.short_description || "",
      campaign_description: campaign?.campaign_description || "",
      main_picture: campaign?.main_picture || null,
      other_pictures: campaign?.other_pictures || [],
    },
    enableReinitialize: true,

    validationSchema: Yup.object().shape({
      campaign_title: Yup.string().required("Required"),
      short_description: Yup.string().required("Required"),
      campaign_description: Yup.string().required("Required"),
    }),

    onSubmit: async (values) => {
      const existingImages = values.other_pictures.filter((img) => typeof img === "string");
      const newImages = [];

      for (const file of values.other_pictures) {
        if (typeof file === "object") {
          const image = await base64Image(file);
          newImages.push(image);
        }
      }

      const combinedImages = [...existingImages, ...newImages];

      let mainPicture;
      if (typeof values.main_picture === "object") {
        mainPicture = await base64Image(values.main_picture);
      } else if (typeof values.main_picture === "string") {
        mainPicture = values.main_picture;
      }

      if (campaign) {
        const res = await updateCampaign({
          id: campaign._id,
          ...values,
          main_picture: mainPicture,
          other_pictures: combinedImages,
        });
        if (res?.data?.status) {
          message.success("Campaign updated successfully");
          await refetch();
        }
      } else {
        const res = await createCampaign({
          ...values,
          main_picture: mainPicture,
          other_pictures: combinedImages,
        });
        if (res?.data?.status) {
          message.success("Campaign created successfully");
          refetch();
        }
      }
    },
  });

  const handleRemoveImage = (imageIndex) => {
    const updatedImages = form.values.other_pictures.filter((_, index) => index !== imageIndex);
    form.setFieldValue("other_pictures", updatedImages);
  };

  return (
    <PrimaryWrapper>
      <Card className="flex flex-col space-y-7 py-4 ">
        <Grid container spacing={2}>
          {/* Main Image Upload */}
          <Grid item xs={6}>
            <Upload
              multiple={false}
              customRequest={(e) => form.setFieldValue("main_picture", e.file)}
              showUploadList={false}
            >
              <Button variant="outlined" icon={<UploadOutlined />}>
                Click to Upload Main Image
              </Button>
            </Upload>
          </Grid>
          <Grid item xs={12}>
            {typeof form.values?.main_picture === "string" && (
              <Image src={form.values?.main_picture} height={80} width={100} style={{ objectFit: "contain" }} />
            )}
            {typeof form.values?.main_picture === "object" && (
              <Image
                src={form.values?.main_picture && window.URL.createObjectURL(form.values.main_picture)}
                height={80}
                width={100}
                style={{ objectFit: "contain" }}
              />
            )}
          </Grid>

          {/* Multiple Images Upload */}
          <Grid item xs={12}>
            <Upload
              multiple
              beforeUpload={(file) => false}
              onChange={(info) => {
                const fileList = info.fileList.map((file) => file.originFileObj || file);
                form.setFieldValue("other_pictures", [...form.values.other_pictures, ...fileList]);
              }}
              showUploadList={false}
            >
              <Button variant="outlined" icon={<UploadOutlined />}>
                Click to Upload Other Pictures
              </Button>
            </Upload>
            <Grid container spacing={2} mt={2}>
              {form.values.other_pictures.map((picture, index) => (
                <Grid item key={index}>
                  <Image
                    src={typeof picture === "string" ? picture : window.URL.createObjectURL(picture)}
                    height={80}
                    width={100}
                    style={{ objectFit: "contain" }}
                  />
                  <Button type="danger" onClick={() => handleRemoveImage(index)}>
                    Remove
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Campaign Title */}
          <Grid item xs={12}>
            <TextField
              name="campaign_title"
              label="Campaign Title"
              fullWidth
              value={form.values?.campaign_title}
              error={Boolean(form.errors?.campaign_title)}
              helperText={form.errors?.campaign_title}
              onChange={form.handleChange}
            />
          </Grid>

          {/* Short Description */}
          <Grid item xs={12}>
            <TextField
              name="short_description"
              label="Short Description"
              fullWidth
              multiline
              minRows={3}
              value={form.values?.short_description}
              error={Boolean(form.errors?.short_description)}
              helperText={form.errors?.short_description}
              onChange={form.handleChange}
            />
          </Grid>

          {/* Campaign Description */}
          <Grid item xs={12}>
            {editorLoaded && editorModules ? (
              <ReactQuill
                theme="snow"
                value={form.values?.campaign_description}
                modules={editorModules}
                onChange={(value) => form.setFieldValue("campaign_description", value)}
              />
            ) : (
              <div>Loading editor...</div>
            )}
            {form.errors?.campaign_description && (
              <div style={{ color: "red" }}>{form.errors?.campaign_description}</div>
            )}
          </Grid>

          {/* Submit Button */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} mt={4}>
            <Button variant="outlined" color="primary" size="large" onClick={() => navigate("/campaigns")}>
              Cancel
            </Button>
            <Button type="primary" onClick={form.handleSubmit}>
              {creating || updating ? <CircularProgress size={18} color="inherit" /> : campaign ? "Update" : "Create"}
            </Button>
          </Stack>
        </Grid>
      </Card>
    </PrimaryWrapper>
  );
};

export default CampaignForm;
