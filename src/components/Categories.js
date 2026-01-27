import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import fill from "../assests/Password.png";
import star from "../assests/Star.png";
import union from "../assests/Union.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import './style.css'
import { useState } from "react";


export const LongText = ({ content, limit }) => {
  const [showAll, setShowAlls] = useState(false)

  const showMore = () => setShowAlls(true);
  const showLess = () => setShowAlls(false);

  if (content.length <= limit) {
    // there is nothing more to show
    return <div>{content}</div>
  }
  if (showAll) {
    // We show the extended text and a link to reduce it
    return <div>
      {content}
      <Button varaint="text" color='secondary' onClick={showLess}>Read less</Button>
    </div>
  }
  // In the final case, we show a text with ellipsis and a `Read more` Button
  const toShow = content.substring(0, limit) + "...";
  return <div>
    {toShow}
    <Button varaint="text" color='secondary' onClick={showMore}>Read more</Button>
  </div>
}

const Categories = ({ data, screen }) => {
  const navigate = useNavigate();

  return (
    <div>

      <Accordion
        sx={{
          backgroundColor: "background.light",
          border: "1px solid #12464C",
          marginTop: 2,
          borderRadius: "8px",

        }}
      >
        <AccordionSummary
          expandIcon={
            <Stack direction='row'>

              <ExpandMoreIcon style={{ color: "white" }} /></Stack>}
          aria-controls="panel1a-content"
          id="panel1a-header"

        >
          {(screen != 'dashboard') ? (
            <Stack direction="row" gap={4}>
              {
                (screen != 'dashboard') ? <img
                  src={data.ctf_category_thumbnail}
                  width="80px"
                  height="80px"
                  style={{ borderRadius: "50%" }}
                /> :
                  null
              }
              <Stack width="100%" justifyContent="space-around" direction='row' alignContent='baseline'>
                <Stack width="100%">
                  <Typography variant="h2">
                    {data?.ctf_category_name}
                  </Typography>
                  {/* <Typography width="96%">{data?.ctf_category_description}</Typography> */}
                  <LongText content={data?.ctf_category_description} limit={150} />
                </Stack>
                <Stack direction='row'>
                  <Typography>
                    {data.category_items.length}
                  </Typography>
                  <Typography>
                    CTF
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          ) : (
            <Stack width="100%" justifyContent="space-between" direction='row'>
              <Typography>{data?.ctf_category_name}</Typography>
              <Typography>
                {data.category_items.length} CTF
              </Typography>
            </Stack>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Stack style={{ gap: 8, overflow: 'scroll', height: "200px" }}>
            {data?.category_items?.map((item, index) => {
              return (
                <Box
                  key={index}
                  onClick={() => navigate('/categories/gameDetails', { state: { id: item?.ctf_id } })}
                  style={{ cursor: 'pointer' }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      border: "1px solid #12464C",
                      width: "100%",
                      height: "113px",
                      borderRadius: "16px",
                      padding: 3,
                      gap: 2,
                      justifyContent: "space-between",

                    }}
                  >
                    <div>
                      <Typography variant="h3">{item?.ctf_name}</Typography>
                      <Stack direction="row" gap={2}>
                        <Stack
                          direction="row"
                          gap="6px"
                          alignItems="center"
                        >
                          <img src={fill} width="16px" height="16px" />
                          <Typography>{item?.ctf_assigned_severity}</Typography>
                          <Box
                            backgroundColor="white"
                            height="18px"
                            width="1px"
                          ></Box>
                        </Stack>
                        <Stack
                          direction="row"
                          gap="6px"
                          alignItems="center"
                        >
                          <img src={star} width="16px" height="16px" />
                          <Typography>{item?.ctf_score} Points</Typography>
                          <Box
                            backgroundColor="white"
                            height="18px"
                            width="1px"
                          ></Box>
                        </Stack>
                        <Stack
                          direction="row"
                          gap="6px"
                          alignItems="center"
                        >
                          <img src={union} width="16px" height="16px" />
                          <Typography>{item?.ctf_players_count}</Typography>
                        </Stack>
                      </Stack>
                    </div>
                    <Box marginTop={2.5} color="#ffffff">
                      <ArrowForwardIosIcon />
                    </Box>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>


    </div>
  );
};

export default Categories;
