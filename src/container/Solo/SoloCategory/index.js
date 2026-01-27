import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { getCategory, getCategoryItem } from "../../../APIConfig/CtfConfig";
import {
  Backdrop,
  CircularProgress,
  Collapse,
  Stack,
  Typography,
} from "@mui/material";
import Card from "./Card";
import { useLocation, useParams } from "react-router-dom";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import SearchBar from "../../../components/ui/SearchBar";
import { getUserCategoryItem } from "../../../APIConfig/adminConfig";
import { TransitionGroup } from "react-transition-group";

export default function CtfCategory({ variant }) {
  const { userId } = useParams();
  const [value, setValue] = React.useState(0);
  const location = useLocation();
  const [memInput, setMemInput] = React.useState("");
  const [mem, setMem] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  // Access the data from the location state object
  const id = location.state;

  const [cat, setCat] = React.useState({});
  const [machines, setMachine] = React.useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await getCategory();
        setCat(data);
        if (!id) {
          handleApi(data?.data[0]?.ctf_category_id);
          return;
        }
        handleApi(id.id);
        setValue(id.index);
      } catch (error) { }
    };
    const getCategoriesUser = async () => {
      const data = await getCategory();
      setCat(data);
      if (!id) {
        handleApiUser(data?.data[0]?.ctf_category_id);
        return;
      }
      handleApi(id.id);
      setValue(id.index);
    };
    if (variant == "userAddCtf") {
      getCategoriesUser();
      setLoading(false);
    } else {
      getCategories();
      setLoading(false);
    }
  }, [loading]);

  const handleApi = async (item) => {
    const data = await getCategoryItem(item);
    setMachine(data?.data);
    setMem(data?.data);
  };
  const handleOnClick = async (item) => {
    if (variant == "userAddCtf") {
      handleApiUser(item);
    } else {
      handleApi(item);
    }
  };
  const handleApiUser = async (item) => {
    const data = await getUserCategoryItem(item, userId);
    setMachine(data?.data);
    setMem(data?.data);
  };
  const breadcrumbs = [
    {
      name: "Dashboard",
      link: "/",
    },
    {
      name: "Solo",
      link: "/categories/soloCategory",
    },
  ];

  const alternateBreadcrumbs = [
    {
      name: "Challenges",
      link: "/admin/challenges",
    },
    {
      name: "Solo Lists",
      link: "/admin/allSoloScenarios",
    },
  ];

  const handleSearch = (e) => {
    if (!e.target.value && !memInput) {
      setMachine(mem);
    }
    setMemInput(e.target.value.trimLeft().toLowerCase());
    const filterData = mem.filter((item) =>
      item.ctf_name
        .toLowerCase()
        .includes(e.target.value.trimLeft().toLowerCase())
    );
    setMachine(filterData);
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
        breadcrumbs={variant === "ctf" ? alternateBreadcrumbs : breadcrumbs}
      />
      <Box style={{ width: "100%", padding: 40 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h2">
            {variant === "ctf" ? "All Solo" : "All Categories"}
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
              label={item.ctf_category_name}
              key={index}
              onClick={() => handleOnClick(item.ctf_category_id)}
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
          {machines && machines?.length > 0
            ? machines.map((item, index) => (
              <Collapse in={true} key={`${index}-${item?.ctf_id}`}>
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
        {machines?.length === 0 && (
          <Typography variant="h3" sx={{ textAlign: "center", mt: "50px" }}>
            No result found
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
