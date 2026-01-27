import * as React from "react";
import Box from "@mui/material/Box";
import { Button, Stack, Typography } from "@mui/material";
import uploadFileIcon from "../../../assests/icons/upload.svg";
import { Icons } from "../../../components/icons";
import { toast } from "react-toastify";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { gameDetailsApi } from "../../../APIConfig/CtfConfig";
import { scenarioDetails } from "../../../APIConfig/scenarioConfig";
import { create_challenge } from "../../../APIConfig/challengeConfig";
import ErrorHandler from "../../../ErrorHandler";

export default function CreateChallenge({ variant }) {
  const { gameid } = useParams();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = React.useState(null);
  const [challengeName, setChallengeName] = React.useState("");
  const [data, setData] = React.useState({
    game_type: variant,
    ctf_or_scenario_id: gameid,
    challenge_thumbnail: selectedFile,
  });

  // React.useEffect(()=>{
  //   console.log(data);
  // },[selectedFile])

  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_FILE_TYPES = ["jpg", "jpeg", "png"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileType = file.name.split(".").pop().toLowerCase();
      const fileSizeMB = file.size / (1024 * 1024);

      if (
        ALLOWED_FILE_TYPES.includes(fileType) &&
        fileSizeMB <= MAX_FILE_SIZE_MB
      ) {
        setSelectedFile(file);
        setUploadedImageUrl(URL.createObjectURL(file));
      } else {
        // Display toast error for invalid file type or size
        toast.error(
          `Invalid file! Please upload an image file (${ALLOWED_FILE_TYPES.join(
            ", "
          )}) with size up to ${MAX_FILE_SIZE_MB} MB.`
        );
        e.target.value = null; // Clear the file input
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setUploadedImageUrl(null);
  };

  // console.log(uploadedImageUrl, "uploadedImcageUrl");
  // console.log(selectedFile, "selectecdFile");

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("All fields are compulsory. ");
    } else {
      create_challenge({ ...data, challenge_thumbnail: selectedFile })
        .then(() => {
          toast.success("Challenge Created Successfully");
          navigate("/admin/challenges");
        })
        .catch((error) => ErrorHandler(error));
    }
  };

  React.useEffect(() => {
    if (variant === "ctf") {
      const getValue = async () => {
        const response = await gameDetailsApi(gameid);
        // console.log(response);
        response?.data && setChallengeName(response.data.ctf_name);
      };
      getValue();
    } else if (variant === "scenario") {
      const getValue = async () => {

        const response = await scenarioDetails(gameid);
        response.data && setChallengeName(response.data.scenario_name);
      };
      getValue();
    }
  }, [gameid]);

  return (
    <Stack sx={{ mt: 2 }}>
      <Box style={{ width: "100%", padding: 16 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h2">
            {variant === "ctf"
              ? "Create Solo Challenge"
              : "Create Squad Challenge"}
          </Typography>
          <Button variant="outlined" onClick={handleUpload}>
            Submit
          </Button>
        </Stack>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: "24px",
              px: "40px",
              py: "25px",
              borderRadius: "16px",
              backgroundColor: "#16181F",
              width: "772px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#1C1F28",
                color: "#6F727A",
                width: "100%",
                py: "12px",
                pl: "14px",
                borderRadius: "8px",
                minHeight: "48px",
                cursor: "not-allowed",
              }}
            >
              {challengeName}
            </Box>
            <Box>
              <Typography
                sx={{ mb: "12px", color: "#FFFFFF", fontSize: "16px" }}
              >
                {" "}
                Challenge Thumbnail
              </Typography>

              {!selectedFile ? (
                <Box
                  sx={{
                    aspectRatio: "16/9",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    border: "2px dashed #535660",
                    alignItems: "center",
                    borderRadius: "16px",
                    backgroundImage: `url(${uploadedImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      {" "}
                      <img
                        src={uploadFileIcon}
                        alt="upload_file_icon"
                        style={{
                          height: "42px",
                          width: "42px",
                          color: "#00FFFF !important",
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        fontSize: "16px",
                        display: "flex",
                        mb: "4px",
                      }}
                    >
                      <Typography color={"#00FFFF !important"}>
                        {"  Click to Upload"}
                      </Typography>
                    </Typography>
                  </label>
                  <Typography
                    sx={{ color: "#6F727A !important", fontSize: "16px" }}
                  >
                    Maximum file size 5 MB
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    aspectRatio: "16/9",
                    maxWidth: "692px",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: "16px",
                    backgroundImage: `url(${uploadedImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center" }}
                    ></Box>

                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        fontSize: "16px",
                        display: "flex",
                        mb: "4px",
                      }}
                    ></Typography>
                  </label>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "10px",
                      right: "20px",
                      cursor: "pointer",
                      backgroundColor: "#1C1F28",
                      height: "40px",
                      width: "40px",
                      borderRadius: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icons.delete
                      style={{ fontSize: "24px", color: "#FF3932" }}
                      onClick={handleRemoveImage}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}
