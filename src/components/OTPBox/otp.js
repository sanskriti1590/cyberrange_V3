import { Button, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { optSend, optVerification, unverified } from "../../APIConfig/CtfConfig";
import rangestormlogo from "../../assests/rangestormlogo.png"
import jwtDecode from "jwt-decode";
import "../index.css";
import "./index.css";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import ErrorHandler from "../../ErrorHandler";

const OtpBox = () => {
	const token = localStorage.getItem("access_token");
	const pathurl = useSelector((state) => state?.pathUrl?.mode?.currentPath);
	const [data, setData] = useState({});
	const [otp, setOtp] = useState("");
	const user = token && jwtDecode(token);
	const navigate = useNavigate();
	const [inputs, setInputs] = useState({
		otp: "",
	});

	useEffect(() => {
		const userDetails = async () => {
			const data = await unverified();
			data.data && setData(data.data);
		};
		userDetails();
	}, []);



	const handleChange = (e) => {
		const { name, value } = e.target;
		setInputs({
			...inputs,
			[name]: value,
		});
	};

	const otpFunction = async () => {
		try {
			const value = await optVerification(otp);

			if (value.data.message == "OTP Verification: Successful") {
				localStorage.setItem("access_token", value.data.access_token);
				localStorage.setItem("refresh_token", value.data.refresh_token);
				navigate(pathurl ? pathurl : "/");
			}
		} catch (error) {
			const obj = error.response.data.errors;
			for (let i in obj) {
				toast.error(
					i.charAt(0).toUpperCase() +
					i.slice(1).replace(/_/g, " ") +
					" - " +
					obj[i]
				);
			}
		}
	};

	const resendOTPHandler = async () => {
		try {
			const response = await optSend();
			if (response.data) {
				toast.success(response.data.message);
			}
		} catch (error) {
			ErrorHandler(error)
		}
	}

	return (
		<Stack height="100dvh" width="100%" display="flex" justifyContent="center">
			<Stack
				width={{ xs: "100%", sm: "100%", md: "50%", lg: "40%", xl: "40%" }}
				display="flex"
				justifyContent="center"
				alignItems="center"
				px={4}
			>
				<Stack
					display="flex"
					width="100%"
					flexDirection="column"
					maxWidth={"400px"}
				>
					<Typography
						style={{ fontWeight: 'bold', color: '#F4F4F4' }}
						variant='h1'
						sx={{ mb: 1 }}
					>
						Enter Verification Code
					</Typography>
					<Typography
						style={{ fontWeight: '400', color: '#BCBEC1 !important' }}
						variant='h5'
					>
						We have sent a code to{" "}
						<span
							style={{ color: "#F4F4F4", fontWeight: "400", fontSize: "14px" }}
						>
							{data.email}
						</span>
					</Typography>

					<Box my={6}>
						<OtpInput
							value={otp}
							onChange={setOtp}
							numInputs={6}
							inputStyle={{
								color: '#EAEAEB',
								backgroundColor: '#1C1F28',
								height: '50px',
								width: '50px',
								border: '2px solid #1C1F28',
								borderRadius: '8px',
							}}
							containerStyle={{
								display: 'flex', justifyContent: 'space-between', alignItems: 'center',
							}}
							renderInput={(props) => <input {...props} className="inputTag" />}
						/>
					</Box>

					<Stack>
						<Typography
							mb={2}
							variant='h5'
							mt={1}
							sx={{ color: '#BCBEC1 !important', textDecoration: 'none', textAlign: "center", fontWeight: '400' }}
						>
							Didn’t received code?{' '}
							<span
								style={{ fontSize: '14px', color: '#00FFFF', cursor: 'pointer' }}
								onClick={resendOTPHandler}
							>
								Resend Code
							</span>{' '}
						</Typography>
					</Stack>
					<Box style={{ width: "100%", border: "1px solid #12464C" }} />
					<Button
						sx={{ marginTop: "24px", width: "100%" }}
						variant="contained"
						color="secondary"
						onClick={otpFunction}
					>
						Verify
					</Button>
				</Stack>
			</Stack>
			<Stack
				alignItems="center"
				width={{ xs: "0%", sm: "0%", md: "50%", lg: "60%", xl: "60%" }}
				position="fixed"
				right={0}
			>
				<img
					src={rangestormlogo}
					alt="login-img"
					style={{ width: "60%", height: "20vh", cursor: "default" }}
				/>
			</Stack>
		</Stack>
	);
};

export default OtpBox;