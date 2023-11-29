"use client";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import React, { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
	const router = useRouter();

	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const submitLogin = async (e: SyntheticEvent) => {
		e.preventDefault();

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/auth/login`, {
				method: "POST",
				body: JSON.stringify({
					password: password,
					email: email,
				}),
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) {
				const errorData = await response.json();
				toast.error("email or password incorrect!", {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				console.log(errorData);
			} else {
				const data = await response.json();

				const accessToken = data.accessToken;

				// Set the access token in local storage
				setLocalStorage("accessToken", accessToken);

				toast.success("User logged in successfully!", {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
				router.push("/home");

				// alert('User logged in successfully!');
			}
		} catch (error) {
			console.error("Error during fetch: ", error);
		}
	};

	const setLocalStorage = (key: string, value: string) => {
		try {
			localStorage.setItem(key, value);
		} catch (error) {
			console.error("Error setting value in local storage:", error);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<Paper
				square
				sx={{
					bgcolor: "primary.main",

					width: "100vw",
					zIndex: 50,
				}}
			>
				<Container maxWidth={"sm"} sx={{ display: "flex", justifyContent: "space-between" }}>
					<Button
						onClick={() => router.push("/")}
						startIcon={<ArrowBackIosNewIcon />}
						variant="text"
						sx={{ color: "#ffffff" }}
					>
						Login
					</Button>
				</Container>
			</Paper>

			<ToastContainer />

			<Container
				maxWidth={"sm"}
				sx={{
					p: 2,
					mt: 8,
					width: "100%",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Typography variant="h5" component="h5">
					Masuk
				</Typography>
				<Typography variant="body1" component="p">
					Belum punya akun?{" "}
					<a href="/register" style={{ textDecoration: "none" }}>
						Buat akun
					</a>
				</Typography>

				<Box
					component="form"
					sx={{
						"& .MuiTextField-root": { width: "100%" },
					}}
					noValidate
					autoComplete="off"
					onSubmit={submitLogin}
				>
					<TextField
						sx={{ mt: 6 }}
						fullWidth
						label="Email"
						id="Email"
						type="email"
						onChange={(e) => setEmail(e.target.value)}
					/>

					<FormControl required sx={{ mt: 2, width: "100%" }} variant="outlined">
						<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
						<OutlinedInput
							id="outlined-adornment-password"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge="end"
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
							label="Password"
						/>
					</FormControl>
					<Button type="submit" variant="contained" sx={{ mt: 2, width: "100%" }}>
						Login
					</Button>
				</Box>
			</Container>
		</Box>
	);
}
