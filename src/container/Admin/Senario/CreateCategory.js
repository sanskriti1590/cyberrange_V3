import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Link from "@mui/material/Link";

import { toast } from "react-toastify";
import uploadImg from "../../../components/assests/uploadIcon.png";


import DeleteIcon from "@mui/icons-material/Delete";


import { getCategorList } from "../../../APIConfig/scenarioConfig";
import { createSenarioCategory } from "../../../APIConfig/adminConfig";

const CategoryScenario = () => {

  const [multipleFile, setMutipleFile] = React.useState([]);

  const [inputs, setInputs] = useState({});
  const [reload, setReload] = useState(false);

  // useEffect(() => {
  //   const apiCall = async () => {
  //     const data = await getCategorList();
  //     //console.log("data is here", data.data);
  //     setCategory(data?.data);
  //   };
  //   apiCall();
  // }, []);

  const changeHandler = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    //console.log(inputs);
  };

  const [file, setFile] = useState({ pdf: "", jpeg: "" });

  const handlechangeJpeg = (e) => {
    if (e.target.files) {
      const image = e.target.files[0];
      //console.log(image);
      if (
        image.type.split("/").pop() == "jpeg" ||
        image.type.split("/").pop() == "png"
      ) {
        setFile((state) => ({ ...state, "jpeg": e.target.files[0] }));
        //console.log(file);
        setInputs((state) => ({
          ...state,
          [e.target.name]: e.target.files[0],
        }));
        //console.log("inputs is here", inputs);
        return;
      } else {
        toast.error("Please upload a jpeg");
      }
    }
  };

  const handleRemoveItem = (name) => {
    //console.log("name", name);
    setMutipleFile(multipleFile.filter((item) => item.name !== name));
  };

  const breadcrumbs = [
    <Link underline="hover" key="1" color="#ACACAC" href="/" variant="h3">
      Dashboard
    </Link>,
  ];



  const handleApi = async () => {
    try {
      const value = await createSenarioCategory(inputs);
      //console.log("value", value);
      setReload(!reload);
      setInputs({});
    } catch (error) {
      //console.log("error", error);
      const obj = error.response.data.errors;

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

  const [datas, setDatas] = useState();
  // get category name
  useEffect(() => {
    const getvalue = async () => {
      const response = await getCategorList();
      //console.log('response is here', response)
      setDatas(response.data.reverse());
    };
    getvalue();
  }, [reload]);

  return (
    <Stack mt={6} gap={3} width="100%">
      <Stack ml={5}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          color="#acacac"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>

      <Typography variant="h1" ml={5}>
        Create Category{" "}
      </Typography>
      {/* top input */}
      <Stack direction="row" justifyContent="space-evenly" gap={2} width="100%">
        <Stack gap={3} width="60%" p={2}>
          <Stack gap={2} width="100%" direction="row">
            <Stack width="100%">
              <TextField
                name="scenario_category_name"
                id="outlined-basic"
                label="Category Name"
                variant="outlined"
                onChange={changeHandler}
              />
            </Stack>
          </Stack>

          <Stack width="100%">
            <TextField
              multiline={true}
              rows={8}
              id="outlined-basic"
              label="Description"
              variant="outlined"
              name="scenario_category_description"
              onChange={changeHandler}
            />
          </Stack>

          <Stack width="5vw">
            {/* <spa
                style={{ color: "#b46228", cursor: "pointer"}}
                onClick={handleApi}
              >
                Submit
              </spa>{" "} */}

            <Button
              sx={{ fontWeight: "bold", width: "150%" }}
              variant="contained"
              color="secondary"
              onClick={handleApi}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
        <Divider
          orientation="vertical"
          variant="middle"
          flexItem
          color="#acacac"
        />
        <Stack gap={2} width="30%" p={2} alignItems="right">
          <Typography variant="h2">Upload Thumbnail</Typography>
          {file?.jpeg ? (
            <Stack direction="row" gap={1}>
              <Typography sx={{ color: "#fff" }}>
                {file?.jpeg && `${file?.jpeg?.name}`}
              </Typography>
              <DeleteIcon
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setFile((state) => ({ ...state, "jpeg": "" }));
                }}
              />
            </Stack>
          ) : (
            <Button
              component="label"
              variant="text"
              sx={{
                color: "#fff",
                backgroundColor: "custom.main",
                width: "300px",
              }}
            >
              <Stack
                style={{
                  border: "1px dashed #12464C",
                  borderRadius: "8px",
                  // height: "200px",
                  width: "300px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                  padding: 4,
                }}
              >
                <img src={uploadImg} width="20px" height="20px" />
                <Typography
                  variant="body"
                  style={{ textAlign: "center", fontSize: "12px" }}
                >
                  Drop your thumbnail here, or Browse Upload A. jpeg and png formats
                </Typography>

                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  hidden
                  onChange={handlechangeJpeg}
                  name="ctf_category_thumbnail"
                />
              </Stack>
            </Button>
          )}

          <div style={{ width: "100%", border: "2px dashed #B46228" }}></div>

          <Typography variant="h2">CyberRangeList</Typography>

          <Box
            sx={{
              width: 300,
              height: 150,
              backgroundColor: "custom.main",
              "&:hover": {
                opacity: [0.9, 0.8, 0.7],
              },
            }}
            overflow="scroll"
          >
            {datas?.reverse().map((item, index) => {
              return (
                <Typography key={index}>
                  {item.scenario_category_name}
                </Typography>
              );
            })}
          </Box>

          <>
            {multipleFile.map((item, index) => {
              //console.log("item is ", item.name);
              return (
                <Stack direction="row" gap={1} key={index}>
                  <Typography sx={{ color: "#fff" }}>{item?.name}</Typography>
                  <DeleteIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemoveItem(item.name)}
                  />
                </Stack>
              );
            })}
          </>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CategoryScenario;
