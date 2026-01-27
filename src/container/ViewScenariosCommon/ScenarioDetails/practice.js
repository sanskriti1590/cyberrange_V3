import { useEffect, useState } from "react";
import { Typography, Stack, Box } from "@mui/material";
import PDFView from "./PDFView";
import { Icons } from "../../../components/icons";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const Practice = ({ item }) => {
  const [value, setValue] = useState(0);
  const [pdfData, setPdfData] = useState();

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const tabHandler = (index) => {
    setPdfData(item?.[index]);
  };

  useEffect(() => {
    setPdfData(item?.[0]);
  }, [item]);

  return (
    <Stack gap={2}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h3" order={0}>
          Walkthrough{" "}
        </Typography>
        <Icons.externalLink
          style={{ cursor: "pointer", color: "#92E7E1", fontSize: "24px" }}
          onClick={() => window.open(pdfData, "_blank")}
        />
      </Box>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable force tabs example"
        sx={{ marginBottom: "22px" }}
      >
        {item?.map((item, index) => {
          return (
            <Tab
              label={`PDF ${index + 1}`}
              key={index}
              onClick={() => tabHandler(index)}
              sx={{ textTransform: "inherit" }}
            />
          );
        })}
      </Tabs>
      <Stack>
        <Box>
          {pdfData ? <PDFView pdfData={pdfData} /> :
            <Typography>No Data Found</Typography>}
        </Box>
      </Stack>
    </Stack>
  );
};
export default Practice;
