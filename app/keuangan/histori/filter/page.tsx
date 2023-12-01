"use client";

import {
	Box,
	Button,
	Container,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import Navigation from "@/app/components/navigation2";
import { Transaction } from "@/app/interfaces/interface";
import TransactionCard from "@/app/components/TransactionCard";

export default function Page() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [typeTransaction, setTypeTransaction] = useState("");

	const types = [
		{
			id: 1,
			name: "EXPENSE",
		},
		{
			id: 2,
			name: "INCOME",
		},
	];

	async function getTransactions() {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/transactions`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
			},
		});
	}

	useEffect(() => {
		getTransactions();
	}, []);

	async function handleSearch(event: FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVICE_BASE}/transactions?type=${typeTransaction}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
				}
			);
			const data = await response.json();
			setTransactions(data);

			console.log(response);
		} catch (error) {
			console.log(error);
		}
	}

	const filteredTransactions = transactions.filter(
		(transaction) => !typeTransaction || transaction.type === typeTransaction
	);

	return (
		<Stack
			display={"flex"}
			flexDirection={"column"}
			alignItems={"center"}
			sx={{ width: "100%", height: "100%" }}
		>
			{/* TOP BAR */}
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
						startIcon={<ChevronLeftIcon />}
						size="large"
						variant="text"
						sx={{ color: "#ffffff" }}
						onClick={() => (window.location.href = "/keuangan/histori")}
					>
						Filter
					</Button>
					<Button variant="text" sx={{ color: "#ffffff" }}>
						Reset
					</Button>
				</Container>
			</Paper>

			{/* CONTENT */}
			<Stack
				component={"form"}
				direction={"column"}
				gap={2}
				padding={2}
				width={1}
				height={1}
				maxWidth={"sm"}
				sx={{
					width: "100%",
				}}
				onSubmit={handleSearch}
			>
				<Typography variant="h6">Cari transaksi</Typography>
				<Stack direction={"row"} justifyContent={"space-between"} gap={2}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						{/* <DemoContainer components={["DatePicker"]}> */}
						<DatePicker label="Dari" />
						{/* </DemoContainer> */}
					</LocalizationProvider>

					<LocalizationProvider dateAdapter={AdapterDayjs}>
						{/* <DemoContainer components={["DatePicker"]}> */}
						<DatePicker label="Hingga" />
						{/* </DemoContainer> */}
					</LocalizationProvider>
				</Stack>

				<FormControl sx={{ my: 1 }} fullWidth>
					<InputLabel id="typeSelected">Type transaksi</InputLabel>
					<Select
						labelId="typeSelected"
						label="Type transaksi"
						value={typeTransaction}
						onChange={(e) => setTypeTransaction(e.target.value)}
					>
						{types?.map((type) => (
							<MenuItem key={type.id} value={type.name}>
								{type.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Button variant="contained" type="submit" startIcon={<SearchIcon />} fullWidth>
					Search
				</Button>
			</Stack>
			<Stack gap={2} padding={2} width={1} maxWidth={"sm"}>
				{filteredTransactions?.map((transaction) => (
					<TransactionCard key={transaction.id} transaction={transaction} />
				))}
			</Stack>

			{/* LIST TRANSACTION */}

			<Navigation />
		</Stack>
	);
}
