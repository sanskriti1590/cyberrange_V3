import { Backdrop, Button, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserData, UserDataUpdate } from "../../../APIConfig/adminConfig";
import CustomizeInput from "../../../components/CustomizeInput";
import { toast } from "react-toastify";

export const CheckMark = ({ label, onChange, value, name }) => {
  //console.log('value of true and false', value)

  return (
    <Stack direction='row' width="100%" justifyContent='space-between'>
      <Typography style={{ color: "#acacac" }}>
        {label}
      </Typography>
      <input type="checkbox" onChange={onChange} name={name} checked={value ? true : false} />
    </Stack>
  )
}

export const UserUpdate = () => {
  const [user, setUser] = useState({})
  const [reload, setReload] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const location = useLocation();

  const data = location.state.the;
  //console.log("locations", location.state);

  useEffect(() => {
    const getData = async () => {
      const value = await UserData(data)
      //console.log('value is here', value.data)
      if (value.data) {

        setUser(value.data)
        setUpdated(value?.data)
      }
    }
    getData()
  }, [reload])


  const handleSignInChange = (e) => {
    const { name, checked } = e.target;
    //console.log('checked is here', checked)
    setUpdated({
      ...updated,
      [name]: checked,
    });
    //console.log(updated)
  };

  const handleSignInChanges = (e) => {
    const { name, value } = e.target;
    //console.log('value is here', value)
    setUpdated({
      ...updated,
      [name]: value,
    });
    //console.log(updated)
  };

  const handleChange = async () => {
    setIsActive(true)
    const value = await UserDataUpdate(data, updated)
    setIsActive(false)
    setUpdated({})
    setReload(!reload)
    toast.success('user has been updated!!!')
    //console.log('value is here', value)
  }
  const [updated, setUpdated] = useState({
    user_full_name: user?.user_full_name,
    email: user.email,
    user_role: user?.user_role,
    is_superadmin: user?.is_superadmin,
    user_role: user?.user_role,
    is_admin: user?.is_admin,
    is_premium: user?.is_premium,
    is_verified: user?.is_verified,
    password: null,
    confirm_password: null,
  })
  //console.log('updated', updated)
  return (
    <Stack padding={5} >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isActive}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography variant="h1">User Details</Typography>
      <Stack justifyContent='center' alignItems='center'>


        <Stack sx={{ justifyContent: 'center', alignItems: 'center', my: 4 }}>
          <Stack >
            <img src={user?.user_avatar} alt="img" style={{ width: '150px', height: "150px", borderRadius: '50%' }} />
            <Typography variant="h2">{user.user_full_name}</Typography>
          </Stack>
          <Grid container sx={{ width: '100%', gap: 2, my: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Grid item xs={5}>
              <CustomizeInput
                type="text"
                name='user_full_name
            'onChange={handleSignInChanges}
                value={updated.user_full_name}
                placeholder={user.user_full_name}
              />
            </Grid>
            <Grid item xs={5}>
              <CustomizeInput
                type="text"
                name='user_role'
                onChange={handleSignInChanges}
                value={updated.user_role}
                placeholder={user.user_role}
              />
            </Grid>
            <Grid item xs={5}>
              <CustomizeInput
                type="text"
                name='mobile_number'
                onChange={handleSignInChanges}
                value={updated.mobile_number}
                placeholder={user.mobile_number}
              />
            </Grid>
            <Grid item xs={5}>
              <CustomizeInput
                type="text"
                name='mobile_number'
                onChange={handleSignInChanges}
                value={updated.email}
                placeholder={user.email}
              />
            </Grid>
            <Grid item xs={5}>
              <CustomizeInput
                type="text"
                name='password'
                onChange={handleSignInChanges}
                value={updated.password}
                placeholder='Password'
              />
            </Grid>
            <Grid item xs={5}>
              <CustomizeInput
                type="text"
                name='confirm_password'
                onChange={handleSignInChanges}
                value={updated.confirm_password}
                placeholder="Confirm Password"
              />
            </Grid>
          </Grid >
          <Grid container sx={{ width: '100%', gap: 2, my: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Grid item xs={5}>
              <CheckMark label="Super Admin"
                name='is_superadmin'
                onChange={handleSignInChange}
                value={updated.is_superadmin} />
            </Grid>
            <Grid item xs={5}>
              <CheckMark label="Admin"
                name='is_admin'
                onChange={handleSignInChange}
                value={updated.is_admin} />
            </Grid>
            <Grid item xs={5}>
              <CheckMark label="Premium"
                name='is_premium'
                onChange={handleSignInChange}
                value={updated.is_premium} />
            </Grid>
            <Grid item xs={5}>
              <CheckMark label="Verified"
                name='is_verified'
                onChange={handleSignInChange}
                value={updated.is_verified} />
            </Grid>
          </Grid >
        </Stack>
        <Button onClick={handleChange} sx={{ fontWeight: "bold", marginTop: "5vh", padding: 2 }}
          variant="contained"
          color="secondary">Submit</Button>
      </Stack>
    </Stack>
  )
}
