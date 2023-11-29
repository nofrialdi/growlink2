"use client";
import {
	Avatar,
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
	styled,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";
import Navigation from "@/app/components/navigation2";
import Shortcut from "@/app/components/shortcut";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ImageKit from "imagekit";

export default function Profile() {
	const router = useRouter();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [imageInput, setImageInput] = useState<FileList | null>(null);
	const [imageUrl, setImageUrl] = useState("");

	const publicKeyEnv = process.env.NEXT_PUBLIC_KEY as string;
	const privateKeyEnv = process.env.NEXT_PUBLIC_PRIVATE_KEY as string;
	const urlEndpointEnv = process.env.NEXT_PUBLIC_URL_ENDPOINT as string;
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const [imageUploadKey, setImageUploadKey] = useState(Date.now());

	const imageKit = new ImageKit({
		publicKey: publicKeyEnv,
		privateKey: privateKeyEnv,
		urlEndpoint: urlEndpointEnv,
	});

	useEffect(() => {
		getUser();
		if (imageInput) {
			updateImage();
		}
	}, [imageInput, imageUploadKey]);

	const updateImage = async () => {
		setIsUploading(true);
		try {
			const file = imageInput ? imageInput[0] : undefined;

			const imageKitResponse = await imageKit.upload({
				file: file as any,
				fileName: `${Date.now()}-${file}`,
			});

			setImageUrl(`${imageKitResponse.url}?${imageUploadKey}`);
		} catch (error) {
			console.log(error);
		}
		setIsUploading(false);
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setImageInput(e.target.files);
			updateImage();
		}
	};

	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	async function getUser() {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/user/me`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();
		setImageUrl(data.imageUrl);
		setName(data.name);
		setEmail(data.email);
		setPhoneNumber(data.phoneNumber);
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/user/me`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					imageUrl: imageUrl,
					name,
					email,
					password,
					phoneNumber,
				}),
			});

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
				toast.success("User updated successfully!", {
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

	const VisuallyHiddenInput = styled("input")({
		clip: "rect(0 0 0 0)",
		clipPath: "inset(50%)",
		height: 1,
		overflow: "hidden",
		position: "absolute",
		bottom: 0,
		left: 0,
		whiteSpace: "nowrap",
		width: 1,
	});

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
						onClick={() => router.push("/home")}
						startIcon={<ArrowBackIosNewIcon />}
						variant="text"
						sx={{ color: "#ffffff" }}
					>
						Profile
					</Button>
				</Container>
			</Paper>

			<ToastContainer />

			<Container
				maxWidth={"sm"}
				sx={{ my: 2, p: 2, width: "100%", display: "flex", flexDirection: "column" }}
			>
				<Typography variant="h5" component="h5">
					Data Diri
				</Typography>

				<Box
					component="form"
					sx={{
						"& .MuiTextField-root": { width: "100%" },
						my: 2,
					}}
					noValidate
					autoComplete="off"
					onSubmit={handleSubmit}
				>
					<Box sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
						{imageUrl ? (
							<Avatar sx={{ width: 80, height: 80 }} src={imageUrl} />
						) : (
							<Avatar sx={{ width: 80, height: 80 }} />
						)}

						<Button component="label" variant="outlined" sx={{ ml: 2 }}>
							Upload foto
							<VisuallyHiddenInput accept="image/*" onChange={handleFileInputChange} type="file" />
						</Button>
					</Box>
					<TextField
						sx={{ my: 2 }}
						fullWidth
						label="Nama Lengkap"
						id="Nama Lengkap"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

					<TextField
						sx={{ mt: 1 }}
						fullWidth
						label="Nomor Telepon"
						id="Nomor Telepon"
						type="number"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
					/>

					<TextField
						sx={{ my: 2 }}
						fullWidth
						label="Email"
						id="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<FormControl required sx={{ width: "100%" }} variant="outlined">
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
					<Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
						Simpan
					</Button>
				</Box>
			</Container>

			<Navigation />
		</Box>
	);
}
