import { Backdrop, Button, IconButton, Stack, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import uploadImg from "../../assests/uploadIcon.png";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadCtfFile } from "../../APIConfig/CtfConfig";
import { toast } from "react-toastify";
import { useState } from "react";
import StepperHorizontal from "../../components/Stepper";
import LoaderImg from "../../components/ui/loader";

const UploadFile = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const id = location?.state?.ctf_id;
  const [file, setFile] = useState();

  const data = {
    index: 1,
    steps: ["Fill Form", "Upload Machine"],
  };

  const fileUpload = async () => {
    try {
      setIsActive(true);
      const response = await uploadCtfFile(file, id);

      toast.success("Machine created successfully");

      setFile("");

      if (response) {
        navigate("/createSolo/uploadEnding");
      }
    } catch (err) {
      setIsActive(false);
      const obj = err.response.data.errors;
      for (let i in obj) {
        toast.error(
          i.charAt(0).toUpperCase() +
          i.slice(1).replace(/_/g, " ") +
          " - " +
          obj[i]
        );
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileDelete = () => {
    setFile(null);
  };

  return (
    <Stack margin={5}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
      >
        <LoaderImg />
      </Backdrop>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h1">Machine Details</Typography>
        <Button
          size="large"
          variant="contained"
          onClick={fileUpload}
          color="secondary"
          sx={{ borderRadius: "16px", border: "2px solid #0ff" }}
        >
          Save & Continue
        </Button>
      </Stack>
      <Stack
        sx={{
          alignItems: "center",
          justifyContent: "center",
          my: 5,
          marginTop: 2,
        }}
      >
        <StepperHorizontal data={data} />
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: 308,
            backgroundColor: "custom.main",
            width: "70%",
            borderRadius: "16px",
            marginTop: 8,
          }}
        >
          {file ? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ color: "#fff", my: 4, width: "80%" }}
            >
              <Typography>
                {file.name.length > 20
                  ? `${file.name.slice(0, 20)}...`
                  : file.name}
              </Typography>
              <IconButton onClick={handleFileDelete} sx={{ color: "#fff" }}>
                <Delete />
              </IconButton>
            </Stack>
          ) : (
            <Button
              component="label"
              variant="text"
              sx={{
                color: "#fff",
                backgroundColor: "custom.main",
                width: "588px",
                my: 4,
              }}
            >
              <Stack
                sx={{
                  border: "1px dashed #12464C",
                  height: "152px",
                  width: "588px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  padding: 2,
                }}
              >
                <img src={uploadImg} width="24px" height="24px" alt="Upload" />
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  Select and upload your CTF machine OVA file
                </Typography>
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  name="ctf_thumbnail"
                />
              </Stack>
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UploadFile;
