import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import { Badge, IconButton, Typography } from "@mui/material";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useNavigate } from 'react-router-dom';
import ActionType from './notification/actionType';
import RedirectionType from './notification/redirectionType';
import { useState } from 'react';
import { NotificationList } from '../../APIConfig/adminConfig';
import { useJwt } from 'react-jwt';

export default function DrawerRight({ message, invisible }) {


  const navigate = useNavigate();
  const [state, setState] = useState({ right: false });
  const [datas, setDatas] = useState([]);
  const token = localStorage.getItem("access_token");
  const { decodedToken, isExpired } = useJwt(token);



  const toggleDrawer = (anchor, open) => (event) => {
    const getApi = async () => {
      const value = await NotificationList();
      //console.log('value is here', value.data);
      value?.data && setDatas(value.data);
    };

    if (token && !isExpired) {
      getApi();
    }

    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  function notificationsLabel(count) {
    if (count === 0) {
      return 'no notifications';
    }
    if (count > 99) {
      return 'more than 99 notifications';
    }
    return `${count} notifications`;
  }

  const unreadNotificationsCount = datas.filter(notification => !notification.is_read).length;



  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 500, padding: 1 }}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Typography variant='h2'>Notification</Typography>

      {datas?.slice(0, 5).map((item, index) => {
        let timeAgo = null;
        const timeToCheck = new Date(item?.timestamp);
        const currentTime = new Date();
        const timeDifference = currentTime - timeToCheck;

        const secondsAgo = Math.floor(timeDifference / 1000);
        const minutesAgo = Math.floor(secondsAgo / 60);
        const hoursAgo = Math.floor(minutesAgo / 60);
        const daysAgo = Math.floor(hoursAgo / 24);

        if (secondsAgo < 60) {
          timeAgo = `${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`;
        } else if (minutesAgo < 60) {
          timeAgo = `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
        } else if (hoursAgo < 24) {
          timeAgo = `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
        } else {
          timeAgo = `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
        }

        return item.type === "action" ? (
          <ActionType item={item} value="drawer" key={index} />
        ) : (
          <RedirectionType item={item} value="drawer" timeAgo={timeAgo} key={index} />
        );
      })}

      {datas.length > 5 && (
        <Button
          variant='contained'
          color="secondary"
          sx={{ my: 3 }}
          onClick={() => navigate('/notification', { state: { data: datas } })}
        >
          See All
        </Button>
      )}
    </Box>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton aria-label={notificationsLabel(0)} onClick={toggleDrawer(anchor, true)}>
            <Badge
              variant="dot"
              invisible={invisible}
              color="secondary"
            >
              <NotificationsNoneOutlinedIcon style={{ color: '#BCBEC1' }} />
            </Badge>
          </IconButton>

          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
