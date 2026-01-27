import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Grid, Stack } from "@mui/material";

export default function MediaControlCard() {
  const badgesIntermediate = [
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "ayush",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "shresth",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "vikas",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur.",
    },
  ];

  return (
    <Stack width="100%"  mb={4}>
      <Grid container gap={2}>
        {badgesIntermediate.map((badge) => {
          return (
            <Grid item xs={12} sm={12} md={5.8} lg={3.85} xl={2.8} mb={7} >
             <Stack
                  direction="row"
                  sx={{
                    backgroundColor: "custom.main",
                    px: 1.5,
                    width: "100%",
                    borderRadius: "8px",
                    gap: 5,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent={"space-between"}
                    sx={{
                      // width: "100%",
                      borderRadius: "16px",
                      alignItems: "center",
                      padding: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="left"
                      alignItems="center"
                      width="100%"
                    >
                      <Stack sx={{ width: "10%", height: "10%" }}>
                          <img
                            src={badge.img}
                            style={{
                              // width: "50%",
                              // height: "132px",
                              borderRadius: "50%",
                            }}
                          />
                        </Stack>
                        <Stack pl={2} sx={{width:"25%"}}>
                          <Stack>
                            <Typography variant="h1">{badge.name}</Typography>
                          </Stack>
                          <Stack >
                            <Typography variant="body2">
                              {badge.aboutUser}
                            </Typography>
                          </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}
