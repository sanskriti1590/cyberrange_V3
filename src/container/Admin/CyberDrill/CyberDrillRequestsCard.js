import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";
import HTMLRenderer from "../../../components/HtmlRendering";

const CorporateRequestsCard = ({ item, variant, CTAOnClick }) => {
  const [hide, setHide] = useState(true);

  const renderCTAButton = (text) => (
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
      {text}
    </Typography>
  );

  const toggleDescription = () => setHide(!hide);

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
      }}
    >
      {/* Image */}
      <img
        src={item?.thumbnail_url}
        alt="image"
        style={{
          height: "170px",
          aspectRatio: 2 / 3,
          borderRadius: "12px 0 0 12px",
          objectFit: "cover",
          cursor: "default",
        }}
      />
      {/* Details */}
      <Stack justifyContent="space-around" style={{ padding: 12 }}>
        <Stack direction="row" alignItems="center" gap={2} marginVertical={2}>
          <Typography variant="h2">{item.name}</Typography>
          <Typography
            variant="body3"
            style={{
              color: "#BCBEC1",
              backgroundColor: "#242833",
              borderRadius: "16px",
              padding: "4px 16px",
            }}
          >
            {item.severity}
          </Typography>
          <Typography
            variant="body3"
            style={{
              color: "#BCBEC1",
              backgroundColor: "#242833",
              borderRadius: "16px",
              padding: "4px 16px",
            }}
          >
            {item.type}
          </Typography>
        </Stack>
        <Stack sx={{ width: "100%" }}>
          {hide ? (
            <Typography variant="h5" sx={{ color: "#BCBEC1", wordBreak: 'break-word' }}>
              {item.description?.replace(/(<([^>]+)>)/gi, "").substring(0, 250)}
            </Typography>
          ) : (
             <Typography variant="h5" sx={{color: "#BCBEC1",  wordBreak:'break-word'}}>
            <HTMLRenderer htmlContent={item.description}/>
             </Typography>
          )}
        <Typography
          variant="h5"
          style={{ textDecoration: "none", cursor: "pointer", color: "#0FF", wordBreak: 'break-word' }}
          onClick={toggleDescription}
        >
          {hide ? "Read More" : "Read Less"}
        </Typography>
      </Stack>
    </Stack>
      {/* Render CTA Button */ }
  { variant === "approve" && renderCTAButton("Approve") }
  { variant === "unApprove" && renderCTAButton("Unapprove") }
    </Stack >
  );
};

export default CorporateRequestsCard;