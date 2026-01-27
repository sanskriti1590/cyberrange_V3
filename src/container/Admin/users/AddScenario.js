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
import Card from "../../../container/ViewScenariosCommon/ScenarioCategory/Card";
import { getUserScenario } from "../../../APIConfig/adminConfig";
import { TransitionGroup } from "react-transition-group";

const AddScenario = () => {
  const { userId } = useParams();
  const [scenarioData, setScenarioData] = useState([]);
  const [loading, setLoading] = useState(true);

  const Navigate = useNavigate();
  const addMoreScenario = () => {
    Navigate(`/admin/userAddScenarios/${userId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserScenario(userId); // Call your API function
        data?.data && setScenarioData(data.data);
      } catch (error) {
        console.error("Error fetching ScenarioData data:", error);
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
        <Button variant="outlined" onClick={addMoreScenario}>
          Add More
        </Button>
      </Box>
      <Box>
        <TransitionGroup>
          {scenarioData?.length > 0 ? (
            scenarioData?.map((ele, idx) => {
              return (
                <Collapse in={true} key={idx}>
                  <Card
                    item={ele}
                    variant={"user-get-scenarios"}
                    key={idx}
                    loading={loading}
                    setLoading={setLoading}
                  />
                </Collapse>
              );
            })
          ) : null}
        </TransitionGroup>
        {scenarioData.length === 0 && (
          <Typography variant="h3" sx={{ textAlign: "center", mt: "50px" }}>
            No result found
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

export default AddScenario;
