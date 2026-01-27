import {
  Box,
  Button,
  CircularProgress,
  Backdrop,
  Stack,
  Typography,
  Collapse,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../../Solo/SoloCategory/Card";
import { getUserCTF } from "../../../APIConfig/adminConfig";
import { TransitionGroup } from "react-transition-group";

const AddCTF = () => {
  const { userId } = useParams();

  const [ctfData, setCtfData] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  const Navigate = useNavigate();
  const addMoreCtf = () => {
    Navigate(`/admin/userAddCtf/${userId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserCTF(userId); // Call your API function
        data?.data && setCtfData(data.data);
      } catch (error) {
        console.error("Error fetching CTF data:", error);
      } finally {
        setLoading(false); // Set loading to false whether success or error
      }
    };
    fetchData(); // Call fetchData immediately
  }, [loading]);

  return (
    <Stack gap={2}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading} // Open backdrop when loading state is true
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 2 }}>
        <Button variant="outlined" onClick={addMoreCtf}>
          Add More
        </Button>
      </Box>
      <Box>
        <TransitionGroup>
          {ctfData.length > 0 ? (
            ctfData?.map((ele, idx) => (
              <Collapse in={true} key={idx}>
                <Card
                  item={ele}
                  variant={"userGetCtf"}
                  key={idx}
                  loading={loading}
                  setLoading={setLoading}
                />
              </Collapse>
            ))
          ) : null}
        </TransitionGroup>
        {ctfData.length === 0 && (
          <Typography variant="h3" sx={{ textAlign: "center", mt: "50px" }}>
            No result found
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

export default AddCTF;
