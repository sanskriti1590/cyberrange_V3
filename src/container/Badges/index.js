import * as React from "react";

import {
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";

const Badges = () => {
  const userColumn = [
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur. Fringilla urna velit sed tempor malesuada vel neque lobortis mi. At arcu fringilla proin turpis n malesuada vel neque lobortis mi.",
      score: 22,
      totalLikes: 2345,
      earnedBadges: 76,
    },
  ];
  const badgesBeginner = [
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur. Fringilla urna velit sed tempor malesuada vel neque lobortis mi.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur. Fringilla urna velit sed tempor malesuada vel neque lobortis mi.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur. Fringilla urna velit sed tempor malesuada vel neque lobortis mi.",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
      name: "rishav",
      aboutUser:
        "Lorem ipsum dolor sit amet consectetur. Fringilla urna velit sed tempor malesuada vel neque lobortis mi.",
    },
  ];

  const beginner = [
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
  ];
  const intermediate = [
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
  ];
  const advance = [
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
    {
      img: "https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    },
  ];

  return (

    <Stack sx={{ margin: 4, borderRadius: 3 }}>
      <Stack direction="row" mb={4} alignItems="center">
        <Stack gap={2} width="100%">
          {userColumn.map((user, index) => {
            return (
              <Stack
                key={index}
                direction="row"
                sx={{
                  backgroundColor: "custom.main",
                  py: 5,
                  px: 1.5,
                  width: "100%",
                  borderRadius: "16px",
                  gap: 5,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent={"space-between"}
                  sx={{
                    backgroundColor: "custom.secondary",
                    width: "100%",
                    borderRadius: "16px",
                    alignItems: "center",
                    padding: 5,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="left"
                    alignItems="center"
                  >
                    <img
                      src={user.img}
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                      }}
                    />
                    <Stack ml={2}>
                      <Typography variant="h1">{user.name}</Typography>
                      <Typography variant="body1">{user.aboutUser}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  sx={{
                    backgroundColor: "custom.secondary",
                    width: "100%",
                    borderRadius: "16px",
                    alignItems: "center",
                    padding: 5,
                    border: "1px solid #b46228",
                    mb: 2,
                  }}
                >
                  <Stack direction="column" sx={{ alignItems: "center" }}>
                    <Typography variant="body1">Scores</Typography>
                    <Typography fontSize="64px" color="#b46228">
                      {user.score}
                    </Typography>
                  </Stack>
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    color="#f4f4f4"
                  />
                  <Stack direction="column" sx={{ alignItems: "center" }}>
                    <Typography variant="body1">Total LIkes</Typography>
                    <Typography fontSize="64px" color="#b46228">
                      {" "}
                      {user.totalLikes}
                    </Typography>
                  </Stack>
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    color="#f4f4f4"
                  />
                  <Stack direction="column" sx={{ alignItems: "center" }}>
                    <Typography variant="body1">Earned Badges</Typography>
                    <Typography fontSize="64px" color="#b46228">
                      {" "}
                      {user.earnedBadges}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
      <Container maxWidth="md">

        <Stack direction="row" gap={5} justifyContent="space-evenly">
          <Stack width="100%" direction="column" mb={5} alignItems="center" sx={{ backgroundColor: "custom.main" }} p={5} borderRadius="16px">
            <Typography color="secondary" variant="h1">Beginner</Typography>
            <Stack direction="row">

              {beginner.map((badge, index) => {
                return (
                  <Stack key={index}>
                    <Stack
                      direction="row"
                      justifyContent={"space-between"}
                      sx={{
                        width: "100%",
                        borderRadius: "16px",
                        alignItems: "center",
                        padding: 5,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                      >
                        <img
                          src={badge.img}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>


          <Stack width="100%" direction="column" mb={5} alignItems="center" sx={{ backgroundColor: "custom.main" }} p={5} borderRadius="16px">
            <Typography color="secondary" variant="h1">Intermediate</Typography>
            <Stack direction="row">

              {intermediate.map((badge, index) => {
                return (
                  <Stack key={index}>
                    <Stack
                      direction="row"
                      justifyContent={"space-between"}
                      sx={{
                        width: "100%",
                        borderRadius: "16px",
                        alignItems: "center",
                        padding: 5,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                      >
                        <img
                          src={badge.img}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>


          <Stack width="100%" direction="column" mb={5} alignItems="center" sx={{ backgroundColor: "custom.main" }} p={5} borderRadius="16px">
            <Typography color="secondary" variant="h1">Advance</Typography>
            <Stack direction="row">

              {advance.map((badge, index) => {
                return (
                  <Stack key={index}>
                    <Stack
                      direction="row"
                      justifyContent={"space-between"}
                      sx={{
                        width: "100%",
                        borderRadius: "16px",
                        alignItems: "center",
                        padding: 5,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                      >
                        <img
                          src={badge.img}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <Stack>
        <Typography variant="h1" mb={1} mt={7}>
          Beginner
        </Typography>
        <Typography variant="body1" mb={4}>
          Lorem ipsum dolor sit amet consectetur. Fringilla urna velit sed
          tempor malesuada vel neque lobortis mi. At arcu fringilla proin turpis
          n malesuada vel neque lobortis mi. At arcu fringilla proin turpis n
        </Typography>
      </Stack>
      <Stack gap={2} width="100%" direction="row" mb={5}>
        {badgesBeginner.map((badge, index) => {
          return (
            <Grid item xs={12} sm={12} md={5.8} lg={3.85} xl={2.9} mb={7} key={index}>
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
                    width: "100%",
                    borderRadius: "16px",
                    alignItems: "center",
                    padding: 5,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="left"
                    alignItems="center"
                  >
                    <img
                      src={badge.img}
                      style={{
                        width: "132px",
                        height: "132px",
                        borderRadius: "50%",
                      }}
                    />
                    <Stack ml={2}>
                      <Typography variant="h1">{badge.name}</Typography>
                      <Typography variant="body1">{badge.aboutUser}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          );
        })}
      </Stack>
    </Stack>

  );
};

export default Badges;
