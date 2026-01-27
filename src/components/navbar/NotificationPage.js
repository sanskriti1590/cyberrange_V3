import { useEffect, useState } from "react";
import { Pagination, Stack, Typography } from "@mui/material";
import { NotificationList } from "../../APIConfig/adminConfig";

const NotificationPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getApi();
  }, []);

  const getApi = async () => {
    const value = await NotificationList();
    value?.data && setData(value?.data || []);
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const calculateTimeAgo = (timestamp) => {
    if (!timestamp) return "Invalid timestamp";

    const timeToCheck = new Date(timestamp);
    const currentTime = new Date();

    if (isNaN(timeToCheck)) return "Invalid date";

    const timeDifference = currentTime - timeToCheck;

    const secondsAgo = Math.floor(timeDifference / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    if (secondsAgo < 60)
      return `${secondsAgo} second${secondsAgo === 1 ? "" : "s"} ago`;
    if (minutesAgo < 60)
      return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
    if (hoursAgo < 24)
      return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
    return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData =
    data.length > 10 ? data.slice(startIndex, endIndex) : data;

  return (
    <Stack sx={{ padding: 5 }}>
      <Typography variant="h1">Notification</Typography>
      {currentData?.map((item, index) => {
        const timeAgo = calculateTimeAgo(item?.timestamp);
        return (
          <Stack
            sx={{
              backgroundColor: !item?.is_read ? "#282C38" : " #1C1F28",
              padding: 1,
              borderRadius: 4,
              cursor: "pointer",
              marginTop: "8px",
            }}
            key={index}
          >
            <Typography variant="h3" style={{ color: "#EAEAEB" }}>
              {item?.title}
            </Typography>
            <Typography
              variant="h5"
              style={{ marginLeft: "8px", color: "#9C9EA3" }}
            >
              {item?.description}
            </Typography>
            <Typography
              variant="body3"
              style={{ marginLeft: "8px", color: "#6F727A" }}
            >
              {timeAgo}
            </Typography>
          </Stack>
        );
      })}
      <Stack sx={{ alignItems: "center" }}>
        <Pagination
          count={Math.ceil(data?.length / itemsPerPage)}
          page={page}
          onChange={handleChange}
        />
      </Stack>
    </Stack>
  );
};

export default NotificationPage;
