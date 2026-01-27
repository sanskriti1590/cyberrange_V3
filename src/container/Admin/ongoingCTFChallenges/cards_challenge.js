import * as React from "react";
import { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import HTMLRenderer from "../../../components/HtmlRendering";
import jwtDecode from "jwt-decode";



const Cards_Challenge = ({ item, variant, CTAOnClick }) => {
  const [hide, setHide] = useState(true);
  const [admin, setAdmin] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      let user = jwtDecode(token);
      setAdmin(user?.is_admin);
    }
  }, []);

  const renderCTAButton = () => {
    if (variant === "challenge") {
      return (
        <Typography
          variant="h5"
          style={{
            cursor: "pointer",
            height: "fit-content",
            padding: "4px 16px",
            margin: 24,
            minWidth: "120px",
            background: "linear-gradient(45deg, #03688C 0%, #08BED0 100%)",
            borderRadius: "16px",
            textAlign: "center",
            color: "#EAEAEB",
          }}
          noWrap
          onClick={CTAOnClick}
        >
          Unchallenge
        </Typography>
      );
    }
  };

  return (
    <Stack
      direction="row"
      style={{
        maxHeight: "fit-content",
        width: "100%",
        gap: 24,
        backgroundColor: "#16181F",
        borderRadius: "12px",
        marginBottom: 24,
        // border: "1px solid white",
      }}
    >
      {/* image */}
      <img
        src={item.ctf_thumbnail || item.scenario_thumbnail}
        alt="image"
        style={{
          height: "170px",
          aspectRatio: 2 / 3,
          borderRadius: "12px 0 0 12px",
          objectFit: "cover",
        }}
      // onClick={() => navigate('/categories/gameDetails', { state: { id: item.ctf_id } })}
      />
      {/* details */}
      <Stack justifyContent="space-around" style={{ padding: 12 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Stack
            direction="row"
            gap={2}
            marginVertical={2}
            sx={{ alignItems: "center" }}
          >
            <Typography variant="h2">
              {item.ctf_name || item.scenario_name}
            </Typography>
            {/*
             */}
            {/* <Typography
              variant="body3"
              style={{
                color: "#BCBEC1 !important",
                backgroundColor: "#242833",
                borderRadius: "16px",
                height: "fit-content",
                padding: "4px 16px",
              }}
              noWrap
            >
              {item.ctf_time} Hour
            </Typography> */}
          </Stack>
        </Stack>
        {hide ? (
          <Stack sx={{ width: "100%" }}>
            <HTMLRenderer
              htmlContent={
                item.ctf_description
                  ? item.ctf_description
                    .replace(/(<([^>]+)>)/gi, "")
                    .substring(0, 250)
                  : item.scenario_description
                    .replace(/(<([^>]+)>)/gi, "")
                    .substring(0, 250)
              }
            />
            {/* <Typography variant="h5" sx={{ color: "#BCBEC1 !important" }}>
              {item.ctf_description || item.scenario_description
                .replace(/(<([^>]+)>)/gi, "")
                .substring(0, 250)}
            </Typography> */}
            <Typography
              style={{
                textDecoration: "none",
                cursor: "pointer",
                color: "#0FF",
              }}
              onClick={() => setHide(!hide)}
            >
              Read more
            </Typography>
          </Stack>
        ) : (
          <Stack sx={{ width: "100%" }}>
            <HTMLRenderer
              htmlContent={item.ctf_description || item.scenario_description}
            />
            <Typography
              variant="h5"
              style={{
                textDecoration: "none",
                cursor: "pointer",
                color: "#0FF",
              }}
              onClick={() => setHide(!hide)}
            >
              Read less
            </Typography>
          </Stack>
        )}
      </Stack>
      {renderCTAButton()}
    </Stack>
  );
};

export default Cards_Challenge;
