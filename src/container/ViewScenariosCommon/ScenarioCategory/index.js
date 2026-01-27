import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  Backdrop,
  Stack,
  Typography,
  CircularProgress,
  Collapse,
} from "@mui/material"; // Added import for CircularProgress
import Card from "./Card";
import {
  getCategorList,
  scenarioCategoryDetail,
} from "../../../APIConfig/scenarioConfig";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import SearchBar from "../../../components/ui/SearchBar";
import { useParams } from "react-router-dom";
import {
  getUserCategoryCorporate,
  getUserCategoryScenario,
} from "../../../APIConfig/adminConfig";
import { TransitionGroup } from "react-transition-group";

export default function ScenarioCategory({ variant }) {
  const [value, setValue] = React.useState(0);
  const [cat, setCat] = React.useState({});
  const [data, setData] = React.useState([]);
  const [memInput, setMemInput] = React.useState("");
  const [mem, setMem] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { userId } = useParams();
  const [id, setId] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await getCategorList();
        setCat(data);
        handleApi(data?.data[0]?.scenario_category_id);
      } catch (error) {

      }
    };

    const getCategoriesUser = async () => {
      const data = await getCategorList();
      data && setCat(data);
      if (id !== 0) {
        handleApiUser(id);
        return;
      }
      data?.data[0]?.scenario_category_id && handleApiUser(data?.data[0]?.scenario_category_id);
      data?.data[0]?.scenario_category_id && setId(data?.data[0]?.scenario_category_id);
    };

    const getCategoriesUserCorporate = async () => {
      const data = await getCategorList();
      data && setCat(data);
      if (id !== 0) {
        handleApiUserCorporate(id);
        return;
      }
      data?.data[0]?.scenario_category_id && handleApiUserCorporate(data?.data[0]?.scenario_category_id);
      data?.data[0]?.scenario_category_id && setId(data?.data[0]?.scenario_category_id);
    };


    if (variant === "userAddScenarios") {
      getCategoriesUser();
      setLoading(false);
    } else if (variant === "userAddCorporate") {
      getCategoriesUserCorporate();
      setLoading(false);
    } else {
      getCategories();
      setLoading(false);
    }
  }, [loading]);

  const handleApi = async (item) => {
    const value = await scenarioCategoryDetail(item);

    if (value) {
      if (variant === "challenges") {
        const filteredData = value.data.filter(
          (item) => item.isChallenge !== true
        );
        setData(filteredData);
      } else {
        setData(value.data);
      }

      setMem(value?.data);
    }

  };

  const handleOnClick = async (item) => {
    if (variant === "userAddScenarios") {
      handleApiUser(item);
    } else if (variant === "userAddCorporate") {
      handleApiUserCorporate(item);
    } else {
      handleApi(item);
    }
  };

  const handleApiUser = async (item) => {
    const data = await getUserCategoryScenario(item, userId);
    if (data?.data) {
      setData(data?.data);
      setMem(data?.data);
      setId(item);
    }

  };
  const handleApiUserCorporate = async (item) => {
    const data = await getUserCategoryCorporate(item, userId);
    if (data?.data) {
      setData(data?.data);
      setMem(data?.data);
      setId(item);
    }
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

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setData(mem);
    }
    setMemInput(e.target.value.trimLeft().toLowerCase());
    const filterData = mem.filter((item) =>
      item.scenario_name
        .toLowerCase()
        .includes(e.target.value.trimLeft().toLowerCase())
    );
    setData(filterData);
  };

  return (
    <Stack>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading} // Open backdrop when loading state is true
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <BreadCrumbs
        breadcrumbs={
          variant === "scenarios" ? alternateBreadcrumbs : breadcrumbs
        }
      />
      <Box style={{ width: "100%", padding: 40 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h2">
            {variant === "scenarios" ? "All Squad" : "All Categories"}
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
              label={item.scenario_category_name}
              key={index}
              onClick={() => handleOnClick(item.scenario_category_id)}
              sx={{ textTransform: "inherit" }}
            />
          ))}
        </Tabs>
        <TransitionGroup>
          {data && data.length > 0
            ? data.map((item, index) => (
              <Collapse in={true} key={`${index}-${item?.scenario_id}`}>

                <Card
                  item={item}
                  variant={variant}
                  key={index}
                  loading={loading}
                  setLoading={setLoading}
                />
              </Collapse>
            ))
            : null}
        </TransitionGroup>

        {data && data.length === 0 && (
          <Typography variant="h3" sx={{ textAlign: "center", mt: "50px" }}>
            No result found
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
