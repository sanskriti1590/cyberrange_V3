import React, { useState } from "react";

import { Button, Stack, Typography } from "@mui/material";
import errorImg from "../components/UnderCons.png";
import { useNavigate } from "react-router-dom";
import { padding } from "@mui/system";
import { mailListing } from "../APIConfig/CtfConfig";
import {  toast } from "react-toastify";

const UnderConstructionpage = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const mailinglistingUser = async () => {
    try {
      const data = await mailListing(inputs)
      toast.success("Mailing List Registration: Successful");
    } catch (error) {

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

  }

  return (
    <div id="wrapper" >
      <Stack direction="row" sx={{ overflow: "hidden", marginTop: 24 }}>
        <Stack
          // container
          // display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Stack
            display="flex"
            width="680px"
            height="300px"
            flexDirection="column"
            p={8}
            gap={3}
          >
            <Typography
              style={{ fontSize: 40, fontWeight: "bold", color: "#fff" }}
              sx={{ mb: 0.5 }}
              variant="h2"
            >
              We're Coming Very Soon !
            </Typography>
            <Typography
              style={{ fontSize: 15, color: "#ACACAC" }}

            >
              We are preparing to sever you better, Get notified when we are
              done.
            </Typography>

            <Stack direction="row" gap={4}>
              <input
                placeholder="Enter your email i'd"
                name="email"
                style={{
                  background: "transparent",
                  padding: "8px",
                  borderRadius: "8px",
                  border: "1px solid #12464C",
                  height: "50px",
                  color: "white",
                  width: "400px",
                }}
                type="text"
                onChange={handleChange}
                value={inputs.email}
              />

              <Button
                sx={{ fontWeight: "bold", width: "200px" }}
                variant="contained"
                color="secondary"
                onClick={mailinglistingUser}
              >
                Notify Me
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <Stack alignItems="center" justifyContent="center" padding={1} >
          <img
            src={errorImg}
            alt="404-img"
            style={{ width: "350px", height: "350px" }}
          />
        </Stack>
      </Stack>
    </div>
  );
};

export default UnderConstructionpage;
