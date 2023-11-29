"use client";
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Container,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useRouter } from "next/navigation";
import AccountMenu from "../components/accountMenu";
import Navigation from "../components/navigation2";

import { Transaction, Yield } from "../interfaces/interface";
import PertanianCard from "../components/PertanianCard";
import TransactionCard from "../components/TransactionCard";

export default function Home() {
	const router = useRouter();
	const [yields, setYields] = useState<Yield[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);

	async function getUser() {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/user/me`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				"Content-Type": "application/json",
			},
		});
		console.log(response);
	}

	async function getYields() {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/yields`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			});
			const data = await response.json();
			console.log(data);

			setYields(data);
		} catch (error) {
			console.log(error);
		}
	}

	async function getTransactions() {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_BASE}/transactions`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			});
			const data = await response.json();

			setTransactions(data);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getUser();
		getYields();
		getTransactions();
	}, []);

	return (
		<Container
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
					position: "fixed",
				}}
			>
				<Container maxWidth={"sm"} sx={{ display: "flex", justifyContent: "space-between" }}>
					<Button variant="text" sx={{ color: "#ffffff" }}>
						Home
					</Button>
					<AccountMenu />
				</Container>
			</Paper>

			{/* CONTENTS */}
			<Stack maxWidth={"sm"} width={1} paddingX={0} paddingY={8} gap={2}>
				{/* TOTAL SALDO */}
				<Paper
					sx={{
						backgroundColor: "#ffffff",
						height: 100,
						alignItems: "center",
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
						borderRadius: 2,
						paddingY: 8,
					}}
				>
					<Typography variant="caption" component="p">
						Total Saldo
					</Typography>
					<Typography variant="h4" component="h5">
						Rp 1000.000
					</Typography>
				</Paper>

				{/* PENGELUARAN */}
				<Box
					sx={{
						width: "100%",
						display: "flex",
						justifyContent: "center",
						flexDirection: "row",
						gap: 2,
					}}
				>
					<Paper
						sx={{
							backgroundColor: "#ffffff",
							height: 80,
							width: "50%",
							alignItems: "center",
							display: "flex",
							justifyContent: "center",
							flexDirection: "column",
							borderRadius: 2,
							paddingY: 8,
						}}
					>
						<Typography variant="caption" component="p">
							Total Pemasukan
						</Typography>
						<Typography variant="h6" component="h6" sx={{ color: "success.main" }}>
							+ Rp 2000.000
						</Typography>
					</Paper>

					<Paper
						sx={{
							backgroundColor: "#ffffff",
							height: 80,
							width: "50%",
							alignItems: "center",
							display: "flex",
							justifyContent: "center",
							flexDirection: "column",
							borderRadius: 2,
							paddingY: 8,
						}}
					>
						<Typography variant="caption" component="p">
							Total Pengeluaran
						</Typography>
						<Typography variant="h6" component="h6" sx={{ color: "error.main" }}>
							- Rp 1000.000
						</Typography>
					</Paper>
				</Box>
				{/* <Box
          maxWidth={"sm"}
          sx={{ width: "100%", display: "flex", my: 1, justifyContent: "left" }}
        > */}
				<Typography variant="body1" component="p" marginBottom={-1}>
					Transaksi terakhir
				</Typography>

				{/* </Box> */}

				{/* TRANSAKSI TERAKHIR */}

				{transactions[0] && <TransactionCard transaction={transactions[0]} {...transactions[0]} />}
				{/* <TransactionCard /> */}
				<Button
					onClick={() => router.push("/keuangan")}
					fullWidth
					sx={{ my: 1, width: "100%" }}
					variant="contained"
				>
					Lihat History Keuangan
				</Button>

				<Typography variant="body1" component="p" marginBottom={-1}>
					Panen terakhir
				</Typography>
				{/* </Box> */}

				{yields[0] && <PertanianCard yields={yields[0]} />}
				{/* <Card sx={{ maxWidth: "sm" }}>
          <CardContent sx={{ width: "100%" }}>
            <Stack
              padding={"2"}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Stack direction={"column"}>
                <Typography variant="body1">Bulir</Typography>
                <Typography variant="caption" color={"secondary.text"}>
                  Nasi
                </Typography>
                <Typography color={"warning.main"} variant="caption">
                  Panen dalam 2 hari
                </Typography>
              </Stack>
              <Stack justifyContent={"center"}>
                <Chip
                  sx={{
                    color: "warning.main",
                    borderColor: "warning.main",
                  }}
                  icon={<AccessTimeIcon color="warning" />}
                  label={"20 HARI"}
                  variant="outlined"
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card> */}

				<Button
					onClick={() => router.push("/pertanian")}
					fullWidth
					sx={{ my: 1, width: "100%" }}
					variant="contained"
				>
					Lihat History Pertanian
				</Button>
			</Stack>
			<Navigation />
		</Container>
	);
}
