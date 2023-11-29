"use client";
import {
	Box,
	Button,
	Container,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import React, { useState } from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
	const router = useRouter();
	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/auth/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					email,
					password,
					phoneNumber,
				}),
			});
			console.log(response);

			if (!response.ok) {
				const error = await response.json();
				toast.error(error.message, {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
			} else {
				const data = await response.json();
				console.log("Response data: ", data);
				toast.success("User registered successfully!", {
					position: "top-center",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "colored",
				});
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
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
						Register
					</Button>
				</Container>
			</Paper>

			<ToastContainer />

			<Container
				maxWidth={"sm"}
				sx={{ px: 2, mt: 8, width: "100%", display: "flex", flexDirection: "column" }}
			>
				<Typography variant="h5" component="h5">
					Register
				</Typography>
				<Typography variant="body1" component="p">
					Sudah punya akun? <a href="/login">Login</a>
				</Typography>

				<Box
					component="form"
					sx={{
						"& .MuiTextField-root": { width: "100%" },
						mt: 1,
					}}
					noValidate
					autoComplete="off"
					onSubmit={handleSubmit}
				>
					<TextField
						required
						sx={{ mt: 6 }}
						fullWidth
						label="Name"
						id="name"
						type="text"
						onChange={(e) => setName(e.target.value)}
						value={name}
					/>
					<TextField
						sx={{ mt: 2 }}
						fullWidth
						label="Phone number"
						id="phoneNumber"
						type="text"
						onChange={(e) => setPhoneNumber(e.target.value)}
						value={phoneNumber}
					/>
					<TextField
						required
						sx={{ mt: 2 }}
						fullWidth
						label="Email"
						id="email"
						type="email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
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
						Register
					</Button>
				</Box>
			</Container>
		</Box>
	);
}
