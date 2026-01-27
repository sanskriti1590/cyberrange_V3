import { Stack, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router";

const ActionType = ({ item, value, key }) => {
  const navigate = useNavigate();


  const handleChanges = () => {
    navigate(item.redirection_url);
  };



  return (
    <Stack
      direction={value == "drawer" ? "column" : "row"}
      sx={{
        backgroundColor: !item?.is_read ? "#282C38" : " #1C1F28",
        padding: 1,
        borderRadius: 4,
        cursor: "pointer",
        marginTop: "8px",
      }}
      key={key}
    >
      <Stack onClick={handleChanges}>
        <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
          {!item?.is_read ? <div>&bull;</div> : <div></div>}

          <Typography variant="h3" style={{ color: "#EAEAEB" }}>
            {item.title}
          </Typography>
        </Stack>
        <Typography
          variant="h5"
          style={{ marginLeft: "8px", color: "#9C9EA3" }}
        >
          {item.description}
        </Typography>
        <Typography
          variant="body3"
          style={{ marginLeft: "8px", color: "#6F727A" }}
        >
          time ago
        </Typography>
      </Stack>
      <Stack>
        <Stack direction="row" gap={1}>
          {/* {
            (hide !=item.notification_id) ?
            item?.action_urls.map((val,index)=><Button variant="contained" size="small" style={{marginTop:8,marginBottom:8}} onClick={()=>handleButtonChanges(val.name)} key={index}>{val.name}</Button>)
            :
            null
           } */}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ActionType;
