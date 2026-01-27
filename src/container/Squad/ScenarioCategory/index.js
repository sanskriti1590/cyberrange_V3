import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  Backdrop,
  CircularProgress,
  Collapse,
  Stack,
  Typography,
} from "@mui/material";
import Card from "./Card";
import {
  getCategorList,
  scenarioCategoryDetail,
} from "../../../APIConfig/scenarioConfig";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import UnderConstruction from "../../ErrorPages/UnderConstruction";
import SearchBar from "../../../components/ui/SearchBar";
import LoaderImg from "../../../components/ui/loader";
import {
  getCategoryCorporate,
  scenarioList,
} from "../../../APIConfig/version2Scenario";
import { TransitionGroup } from "react-transition-group";
import { toast } from "react-toastify";
import axiosErrorHandler from "../../../ErrorHandler/axiosErrHandler";

export default function ScenarioCategoryVersion2({ variant }) {
  const [value, setValue] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [memInput, setMemInput] = React.useState("");
  const [mem, setMem] = React.useState([]);
  const [cat, setCat] = React.useState({});
  const [loader, setLoader] = React.useState(true);

  const getApi = async (id) => {
    setLoader(true);
    try {
      const response = await getCategoryCorporate(id);
      if (response?.data) {
        setData(response?.data);
        setMem(response?.data)
      }
    }
    catch (error) {
      setData([]);
      setMem([])
      axiosErrorHandler(error)

    }
    finally {
      setLoader(false);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const breadcrumbs = [
    {
      name: "Dashboard",
      link: "/",
    },
    {
      name: "Squad",
      link: "/squad/scenarioCategory",
    },
  ];

  const alternateBreadcrumbs = [
    {
      name: "Challenges",
      link: "/admin/challenges",
    },
    {
      name: "Squad Lists",
      link: "/admin/allSquads",
    },
  ];

  const corporateBreadcrumbs = [
    {
      name: "Dashboard",
      link: "/",
    },
    {
      name: "Corporate",
      link: "/corporate/category",
    },
  ];

  const handleSearch = (e) => {
    if (e.target.value == "") {
      setData(mem);
    }
    setMemInput(e.target.value.trimLeft().toLowerCase());
    const filterData = mem.filter((item) =>
      item.name
        .toLowerCase()
        .includes(e.target.value.trimLeft().toLowerCase())
    );
    setData(filterData);
  };

  const handleOnClick = async (item) => {
    getApi(item?.scenario_category_id);
  };

  React.useEffect(() => {
    setLoader(true);
    const getCategories = async () => {
      try {
        const data = await getCategorList();
        if (data) {
          getApi(data?.data[0]?.scenario_category_id);
          setCat(data);
        }
      } finally {
        setLoader(false);
      }
    };

    getCategories();
  }, []);

  return (
    <Stack>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <LoaderImg />
        <CircularProgress color="inherit" />
      </Backdrop>
      <BreadCrumbs
        breadcrumbs={
          variant === "scenarios" ? breadcrumbs : corporateBreadcrumbs
        }
      />

      <Box style={{ width: "100%", padding: 40 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h2">
            {variant === "scenarios" ? "All Scenario" : "All Categories"}
          </Typography>
          <SearchBar
            value={memInput}
            placeholder="Search"
            onChange={handleSearch}
          />
        </Stack>

        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable force tabs example"
          sx={{ marginBottom: "22px" }}
        >
          {cat?.data?.map((item, index) => (
            <Tab
              label={item?.scenario_category_name}
              key={index}
              onClick={() => handleOnClick(item)}
              sx={{
                textTransform: "inherit",
                fontSize: "18px",
                fontWeight: "500",
                color: "#EAEAEB",
              }}
            />
          ))}
        </Tabs>

        <TransitionGroup>
          {data && data?.length > 0
            ? data.map((item, index) => (
              <Collapse in={true} key={`${index}-${item?.id}`}>
                <Card
                  item={item}
                  variant={variant}
                  key={index}
                  loader={loader}
                  setLoader={setLoader}
                />
              </Collapse>
            ))
            : null}
        </TransitionGroup>

        {data?.length === 0 && (
          <Typography variant="h3" sx={{ textAlign: "center", mt: "50px" }}>
            No result found
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
