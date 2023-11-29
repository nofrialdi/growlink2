"use client";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Container,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	Paper,
	Select,
	Stack,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TuneIcon from "@mui/icons-material/Tune";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Navigation from "@/app/components/navigation2";
import React from "react";

export default function CatatKeuangan() {
	const [value, setValue] = useState("1");
	const [amount, setAmount] = useState(0);
	const [description, setDescription] = useState("");
	const [transactionTime, setTransactionTime] = React.useState<Date | null>(null);

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	const handleTransactionTime = (selectedTransactionTime: any) => {
		setTransactionTime(selectedTransactionTime);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const data = {
				amount: amount,
				description: description,
				transactionTime: transactionTime,
			};
			console.log(data);
		} catch (error) {
			console.log(error);
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
					position: "fixed",
				}}
			>
				<Container maxWidth={"sm"} sx={{ display: "flex", justifyContent: "space-between" }}>
					<Button startIcon={<ArrowBackIosNewIcon />} variant="text" sx={{ color: "#ffffff" }}>
						Pertanian
					</Button>
				</Container>
			</Paper>

			<Box
				maxWidth={"sm"}
				sx={{
					width: "100%",
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<Box sx={{ width: "100%", typography: "body1", mt: 6 }}>
					<TabContext value={value}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<TabList
								centered
								onChange={handleChange}
								aria-label="lab API tabs example"
								variant="fullWidth"
							>
								<Tab label="Catat Pemasukan" value="1" />
								<Tab label="Catat Pengeluaran" value="2" />
							</TabList>
						</Box>
						<TabPanel value="1">
							<Typography align="center" variant="h6" color={"primary.main"} marginBottom={2}>
								Catat Pemasukan
							</Typography>

							<Box
								component="form"
								onSubmit={handleSubmit}
								sx={{
									"& .MuiTextField-root": { width: "100%" },
								}}
								noValidate
								autoComplete="off"
							>
								<TextField
									sx={{ my: 1 }}
									label="Jumlah Panen (kosongkan jika belum  panen)"
									id="jumlah panen"
									value={amount}
									onChange={(e) => setAmount(Number(e.target.value))}
									InputProps={{
										startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
										inputMode: "numeric",
									}}
								/>

								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker
										value={transactionTime}
										onChange={handleTransactionTime}
										format="DD/MM/YYYY"
										label="Tanggal Tanam"
									/>
								</LocalizationProvider>

								<TextField
									sx={{ my: 1 }}
									fullWidth
									label="Deskripsi"
									id="deskripsi"
									type="text"
									onChange={(event) => setDescription(event.target.value)}
									value={description}
								/>

								<Button type="submit" variant="contained" sx={{ width: "100%", my: 1 }}>
									Simpan
								</Button>
							</Box>
						</TabPanel>
						<TabPanel value="2">Pengeluaran</TabPanel>
					</TabContext>
				</Box>
			</Box>

			<Navigation />
		</Box>
	);
}
