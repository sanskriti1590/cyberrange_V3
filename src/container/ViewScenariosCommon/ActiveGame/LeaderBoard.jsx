import { Reorder } from "framer-motion";
import "./LeaderBoard.css";
import { useState } from "react";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LeaderBoard = ({ data, gameType, scenarioId }) => {
  const navigate = useNavigate();

  const [value, setValue] = useState([]);
  const [Loader, setLoader] = useState(false);


  return (
    <div class="table-wrapper" style={{ width: "100%" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={Loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Reorder.Group values={value} Reorder={setValue}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr style={{ backgroundColor: "#242833" }}>
              <td>Position</td>
              <td>Username</td>
              <td>Team</td>
              <td>score</td>
              {gameType && <td>console</td>}
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => {
              return (
                <Reorder.Item
                  as="tr"
                  key={item.id}
                  value={item.id}
                // style={{ backgroundColor: item.team }}
                >
                  <th>{index + 1}</th>
                  <th
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "4px",

                    }}
                  >
                    <img
                      src={item?.user_avatar}
                      style={{
                        height: "40px",
                        width: "40px",
                        borderRadius: "50%",
                      }}
                    />
                    {item.user_full_name}
                  </th>
                  <th style={{ color: item?.team }}>{item.team}</th>
                  <th>
                    {item.total_obtained_score}/{item.total_score}
                  </th>
                  {gameType && (
                    <th>
                      {" "}
                      <Button
                        onClick={() =>
                          navigate(
                            `/activeGameScenario/consolePage/${scenarioId}/${data[index]?.user_id}`
                          )
                        }
                      >
                        (View Console)
                      </Button>{" "}
                    </th>
                  )}
                </Reorder.Item>
              );
            })}
          </tbody>
        </table>
      </Reorder.Group>
    </div>
  );
};

export default LeaderBoard;
