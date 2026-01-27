import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import { Box, Button, Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { Icons } from "../../../components/icons";
import { getImageAndFlavourList } from "../../../APIConfig/scenarioConfig";
import { getctfId, submitctf } from "../../../APIConfig/CtfConfig";

const CreateCTFRequest = () => {
  const navigate = useNavigate();

  const { categoryId } = useParams();

  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    CTFId: "",
    CTFName: "",
    targetFlavorId: "",
    targetImage: "",
    timeDuration: "",
    score: "",
    flavorId: "",
    selectImage: "",
    userName: "",
    password: "",
  });

  const [CTFData, setCTFData] = useState([]);

  const [flavorsData, setFlavorsData] = useState([]);

  const [imagesData, setImagesData] = useState([]);

  const breadcrumbs = [
    {
      name: "Dashboard",
      link: "/",
    },
    {
      name: "CTF Requests",
      link: "/admin/soloRequests",
    },
    {
      name: "Create",
      link: `/admin/soloRequests/${categoryId}`,
    },
  ];

  const passwordVisibilityHandler = () => {
    setShowPassword(!showPassword);
  };

  const targetFlavorIdInputHandler = (value) => {
    setData({ ...data, targetFlavorId: value });
  };
  const targetImageInputHandler = (value) => {
    setData({ ...data, targetImage: value });
  };
  const timeDurationInputHandler = (value) => {
    setData({ ...data, timeDuration: value });
  };
  const scoreInputHandler = (value) => {
    setData({ ...data, score: value });
  };
  const flavorIdInputHandler = (value) => {
    setData({ ...data, flavorId: value });
  };
  const selectImageInputHandler = (value) => {
    setData({ ...data, selectImage: value });
  };
  const nameInputHandler = (value) => {
    setData({ ...data, userName: value });
  };
  const passwordInputHandler = (value) => {
    setData({ ...data, password: value });
  };

  const isFormValid = () => {
    if (
      !data.CTFId ||
      !data.targetFlavorId ||
      !data.targetImage ||
      !data.timeDuration ||
      !data.score ||
      !data.flavorId ||
      !data.selectImage ||
      !data.userName ||
      !data.password
    ) {
      toast.error("All fields are required.");
      return false;
    }
    if (data?.score < 1 || data?.score > 100) {
      toast.error("Score should be between 0 and 100");
      return false;
    }
    if (data.password.length < 4) {
      toast.error(
        "Password must be at least 4 characters long."
      );
      return false;
    }

    //   if (/^\d+$/.test(data.password)) {
    //     toast.error("Password cannot be entirely numeric");
    //     return false;
    //   }
    return true;
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      try {
        const response = await submitctf(data);
        if (response) {
          toast.success("User added successfully.");
          navigate("/admin/soloRequests");
        }
      } catch (error) {
        toast.error(error.response.data.errors);
      }
    }
  };

  useEffect(() => {
    // This is an IIFE (Immediately Invoked Function Expression)
    (async () => {
      try {
        const response = await getctfId();
        response?.data && setCTFData(response?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  useEffect(() => {
    const selectedCategory = CTFData.find((item) => item.ctf_id === categoryId);

    if (selectedCategory) {
      setData({
        ...data,
        CTFId: selectedCategory.ctf_id,
        CTFName: selectedCategory.ctf_name,
      });
    }
  }, [CTFData, categoryId]);

  useEffect(() => {
    // This is an IIFE (Immediately Invoked Function Expression)
    (async () => {
      try {
        const response = await getImageAndFlavourList();
        if (response.data.flavors && response.data.images) {
          setFlavorsData(response.data.flavors);
          setImagesData(response.data.images);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Stack px={2} py={4}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography componant="h1" variant="h1">
              Create Solo Requests
            </Typography>
            <Button variant="contained" onClick={handleSubmit}>
              Save & Continue
            </Button>
          </Stack>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Stack
              mt={4}
              spacing={3}
              sx={{
                borderRadius: "16px",
                backgroundColor: "#16181F",
                width: "100%",
                maxWidth: "772px",
                padding: "24px 40px",
              }}
            >
              <Stack direction="row" spacing={3}>
                <input
                  disabled
                  type="text"
                  placeholder={data.CTFName}
                  value={data.CTFName}
                  style={{
                    width: "100%",
                    backgroundColor: "#1C1F28",
                    borderRadius: "8px",
                    height: "48px",
                    color: "#acacac",
                    border: "none",
                    padding: "12px 14px",
                    cursor: "not-allowed",
                  }}
                />
              </Stack>
              <Stack direction="row" spacing={3}>
                <Box
                  style={{
                    position: "relative",
                    width: "100%",
                    backgroundColor: "#1C1F28",
                    borderRadius: "8px",
                    height: "48px",
                    padding: "12px 14px",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  <select
                    name="Target Flavor_id"
                    value={data.targetFlavorId}
                    id="role"
                    onChange={(event) =>
                      targetFlavorIdInputHandler(event.target.value)
                    }
                    style={{
                      width: "100%",
                      backgroundColor: "#1C1F28",
                      color: "#6F727A",
                      border: "none",
                      padding: "0",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <option
                      value=""
                      style={{ cursor: "pointer" }}
                      disabled
                      selected
                      hidden
                    >
                      Target Flavor_id
                    </option>
                    {flavorsData?.map((item) => {
                      return (
                        <option
                          key={item.flavor_id}
                          value={item.flavor_id}
                          style={{ cursor: "pointer" }}
                        >
                          {item.flavor_name}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "4px",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#acacac",
                    }}
                  ></div>
                </Box>
                <Box
                  style={{
                    position: "relative",
                    width: "100%",
                    backgroundColor: "#1C1F28",
                    borderRadius: "8px",
                    height: "48px",
                    padding: "12px 14px",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  <select
                    name="Target Image"
                    value={data.targetImage}
                    id="role"
                    onChange={(event) =>
                      targetImageInputHandler(event.target.value)
                    }
                    style={{
                      width: "100%",
                      backgroundColor: "#1C1F28",
                      color: "#6F727A",
                      border: "none",
                      padding: "0",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <option
                      value=""
                      style={{ cursor: "pointer" }}
                      disabled
                      selected
                      hidden
                    >
                      Target Image
                    </option>
                    {imagesData?.map((item) => {
                      return (
                        <option
                          key={item.image_id}
                          value={item.image_id}
                          style={{ cursor: "pointer" }}
                        >
                          {item.image_name}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "4px",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#acacac",
                    }}
                  ></div>
                </Box>
              </Stack>
              <Stack direction="row" spacing={3}>
                <Box
                  style={{
                    position: "relative",
                    width: "100%",
                    backgroundColor: "#1C1F28",
                    borderRadius: "8px",
                    height: "48px",
                    padding: "12px 14px",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  <select
                    name="Target Image"
                    value={data.timeDuration}
                    id="role"
                    onChange={(event) =>
                      timeDurationInputHandler(event.target.value)
                    }
                    style={{
                      width: "100%",
                      backgroundColor: "#1C1F28",
                      color: "#6F727A",
                      border: "none",
                      padding: "0",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <option
                      value=""
                      style={{ cursor: "pointer" }}
                      disabled
                      selected
                      hidden
                    >
                      Time Duration
                    </option>
                    <option value="1" style={{ cursor: "pointer" }}>
                      01 Hour
                    </option>
                    <option value="2" style={{ cursor: "pointer" }}>
                      02 Hours
                    </option>
                    <option value="3" style={{ cursor: "pointer" }}>
                      03 Hours
                    </option>
                    <option value="4" style={{ cursor: "pointer" }}>
                      04 Hours
                    </option>
                    <option value="5" style={{ cursor: "pointer" }}>
                      05 Hours
                    </option>
                    <option value="6" style={{ cursor: "pointer" }}>
                      06 Hours
                    </option>
                    <option value="7" style={{ cursor: "pointer" }}>
                      07 Hours
                    </option>
                    <option value="8" style={{ cursor: "pointer" }}>
                      08 Hours
                    </option>
                    <option value="9" style={{ cursor: "pointer" }}>
                      09 Hours
                    </option>
                    <option value="10" style={{ cursor: "pointer" }}>
                      10 Hours
                    </option>
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "4px",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#acacac",
                    }}
                  ></div>
                </Box>
                <input
                  type="text"
                  placeholder="Score"
                  value={data.score}
                  onChange={(event) => {
                    // Use a regular expression to remove non-numeric characters
                    const numericValue = event.target.value.replace(/\D/g, "");

                    // Ensure the length does not exceed 10 characters
                    const limitedValue = numericValue.slice(0, 3);

                    // Update the state with the sanitized value
                    scoreInputHandler(limitedValue);
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: "#1C1F28",
                    borderRadius: "8px",
                    height: "48px",
                    color: "#acacac",
                    border: "none",
                    padding: "12px 14px",
                  }}
                />
              </Stack>
              <Stack direction="row" spacing={3}>
                <Box style={{ position: "relative", width: "100%" }}>
                  <Box
                    style={{
                      position: "relative",
                      width: "100%",
                      backgroundColor: "#1C1F28",
                      borderRadius: "8px",
                      height: "48px",
                      padding: "12px 14px",
                      cursor: "pointer",
                      display: "inline-block",
                    }}
                  >
                    <select
                      name="Flavor_id"
                      value={data.flavorId}
                      id="Flavor_id"
                      onChange={(event) =>
                        flavorIdInputHandler(event.target.value)
                      }
                      style={{
                        width: "100%",
                        backgroundColor: "#1C1F28",
                        color: "#6F727A",
                        border: "none",
                        padding: "0",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      <option
                        value=""
                        style={{ cursor: "pointer" }}
                        disabled
                        selected
                        hidden
                      >
                        Flavor_id
                      </option>
                      {flavorsData?.map((item) => {
                        return (
                          <option
                            key={item.flavor_id}
                            value={item.flavor_id}
                            style={{ cursor: "pointer" }}
                          >
                            {item.flavor_name}
                          </option>
                        );
                      })}
                    </select>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "4px",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                        color: "#acacac",
                      }}
                    ></div>
                  </Box>
                </Box>
                <Box
                  style={{
                    position: "relative",
                    width: "100%",
                    backgroundColor: "#1C1F28",
                    borderRadius: "8px",
                    height: "48px",
                    padding: "12px 14px",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  <select
                    name="Select Image"
                    value={data.selectImage}
                    id="Select Image"
                    onChange={(event) =>
                      selectImageInputHandler(event.target.value)
                    }
                    style={{
                      width: "100%",
                      backgroundColor: "#1C1F28",
                      color: "#6F727A",
                      border: "none",
                      padding: "0",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <option
                      value=""
                      style={{ cursor: "pointer" }}
                      disabled
                      selected
                      hidden
                    >
                      Select Image
                    </option>
                    {imagesData?.map((item) => {
                      return (
                        <option
                          key={item.image_id}
                          value={item.image_id}
                          style={{ cursor: "pointer" }}
                        >
                          {item.image_name}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "4px",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#acacac",
                    }}
                  ></div>
                </Box>
              </Stack>
              <Box style={{ position: "relative", width: "100%" }}>
                <input
                  type="text"
                  placeholder="Username"
                  value={data.name}
                  onChange={(event) => nameInputHandler(event.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#1C1F28",
                    borderRadius: "8px",
                    height: "48px",
                    color: "#acacac",
                    border: "none",
                    padding: "12px 14px",
                  }}
                />
                <Box
                  style={{
                    backgroundColor: "#1C1F28",
                    display: "flex",
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                  }}
                >
                  <Icons.user style={{ fontSize: "24px", color: "#6F727A" }} />
                </Box>
              </Box>
              <Box style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={data.password}
                  onChange={(event) => passwordInputHandler(event.target.value)}
                  style={{
                    width: "100%",
                    backgroundColor: "#1C1F28",
                    borderRadius: "8px",
                    height: "48px",
                    color: "#acacac",
                    border: "none",
                    padding: "12px 14px",
                  }}
                />
                <Box
                  style={{
                    backgroundColor: "#1C1F28",
                    display: "flex",
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                  }}
                >
                  {showPassword ? (
                    <Icons.hide
                      style={{
                        fontSize: "24px",
                        color: "#6F727A",
                        cursor: "pointer",
                      }}
                      onClick={passwordVisibilityHandler}
                    />
                  ) : (
                    <Icons.show
                      style={{
                        fontSize: "24px",
                        color: "#6F727A",
                        cursor: "pointer",
                      }}
                      onClick={passwordVisibilityHandler}
                    />
                  )}
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

export default CreateCTFRequest;
