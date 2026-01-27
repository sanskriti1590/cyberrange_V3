import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import "./DateTime.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/system";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ScheduleDateTimePickers({
  calenderToggle,
  handleSelectedDate,
  handleCalenderToggle,
}) {
  const MAX_DAYS_RANGE_SCHEDULE = 14;
  const currentDate = dayjs();
  const maxDate = currentDate.add(MAX_DAYS_RANGE_SCHEDULE, "day");
  const currentHour = currentDate.hour();

  const [defaultTime, setDefaultTime] = React.useState(
    currentDate.add(1, "hour").add(2, "minute")
  );
  const isPastOrInvalidTime = (selectedDate) => {
    const isPastTime =
      currentDate.isSame(selectedDate, "day") &&
      currentDate.isAfter(selectedDate);

    const isMinimumTimeGap = currentDate.add(1, "hour").isBefore(selectedDate);

    return {
      isPastTime,
      isMinimumTimeGap,
    };
  };

  const handleDateTimeChange = (newDate) => {
    const selectedDate = new Date(newDate);
    const { isPastTime, isMinimumTimeGap } = isPastOrInvalidTime(selectedDate);

    if (isPastTime || !isMinimumTimeGap) {
      toast.error(
        isPastTime
          ? "Cannot select past time"
          : "Please select a time at least 1 hour from now"
      );
    }
  };

  const handleSubmit = (date) => {
    const selectedDate = new Date(date);
    const { isPastTime, isMinimumTimeGap } = isPastOrInvalidTime(selectedDate);

    if (isPastTime || !isMinimumTimeGap) {
      toast.error(
        isPastTime
          ? "Cannot select past time"
          : "Please select a time at least 1 hour from now"
      );
    } else {
      const newdate = new Date(date);
      handleSelectedDate(newdate);
      handleCalenderToggle(calenderToggle);
    }
  };

  const RightArrowIcon = styled(ArrowForwardIcon)({
    display: "none",
  });
  const LeftArrowIcon = styled(ArrowBackIcon)({
    display: "none",
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          "DateTimePicker",
          "MobileDateTimePicker",
          "DesktopDateTimePicker",
          "StaticDateTimePicker",
        ]}
      >
        <DemoItem>
          <StaticDateTimePicker
            defaultValue={defaultTime}
            minDate={currentDate}
            maxDate={maxDate}
            minTime={currentHour > 23 ? undefined : currentDate}
            autoFocus={true}
            onAccept={handleSubmit}
            className="Background"
            disablePast={true}
            onChange={handleDateTimeChange}
            disabled={calenderToggle}
            slots={{
              rightArrowIcon: RightArrowIcon,
              leftArrowIcon: LeftArrowIcon,
            }}
            sx={{
              "& .Mui-selected": {
                color: " #00ffff !important",
              },
              "& .MuiClockPointer-root": {
                backgroundColor: "#00ffff !important",
              },
              "& .MuiClock-pin": {
                backgroundColor: "#00ffff",
              },
            }}
            slotProps={{
              actionBar: {
                actions: ["accept"],
              },
            }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
