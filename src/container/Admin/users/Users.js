import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/navbar/BreadCrumb";
import { Button, Stack, Typography } from "@mui/material";
import WinningWall from "../../../components/winningWall/WinningWall";
import { useNavigate } from "react-router-dom";
import { allUsersDataGet } from "../../../RTK/admin/users/allUsersSlice";
import { useDispatch, useSelector } from "react-redux";
import SearchBar from "../../../components/ui/SearchBar";

const Users = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState("");

  const [filteredUsersData, setFilteredUsersData] = useState([]);

  const { allUsersData } = useSelector((state) => state.allUsers);

  const breadcrumbs = [{ name: "Users", link: "/users" }];

  const handleAddUser = () => {
    navigate("/admin/addUser");
  };

  const searchInputHandler = (value) => {
    setSearchValue(value);

    if (value.trim() === "") {
      setFilteredUsersData([]);
    } else {
      const filteredData = allUsersData.filter((item) =>
        item?.user_full_name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsersData(filteredData);
    }
  };

  useEffect(() => {
    dispatch(allUsersDataGet());
  }, []);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Stack px={2} py={4}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography componant="h1" variant="h2">
            Users
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
          >
            <SearchBar
              value={searchValue}
              onChange={(event) =>
                searchInputHandler(event.target.value.trimStart())
              }
            />
            <Button variant="contained" onClick={handleAddUser}>
              Add User
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Stack px={2} py={4}>
        {searchValue && filteredUsersData.length === 0 ? (
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Typography variant="h4">No Results Found</Typography>
          </Stack>
        ) : (
          <WinningWall
            template="users"
            data={searchValue ? filteredUsersData : allUsersData}
            height="62vh"
          />
        )}
      </Stack>
    </>
  );
};

export default Users;
