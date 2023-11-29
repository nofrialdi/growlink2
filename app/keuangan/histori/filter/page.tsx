"use client";

import {
	Button,
	Container,
	IconButton,
	MenuItem,
	Paper,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useState } from "react";
import Navigation from "@/app/components/navigation2";

export default function Page() {
	const [selectedCategory, setSelectedCategory] = useState("");
	const categories = [
		{ id: 0, label: "Benih dan Tanaman" },
		{ id: 1, label: "Pupuk dan Pembenah Tanah" },
		{ id: 2, label: "Pestisida dan Herbisida" },
		{ id: 3, label: "Peralatan dan Mesin" },
		{ id: 4, label: "Bahan Bakar dan Energi" },
		{ id: 5, label: "Tenaga Kerja" },
		{ id: 6, label: "Air" },
		{ id: 7, label: "Perbaikan dan Pemeliharaan" },
		{ id: 8, label: "Pengemasan dan Transportasi" },
		{ id: 9, label: "Asuransi" },
		{ id: 10, label: "Pemasaran dan Penjualan" },
		{ id: 11, label: "Utilitas" },
		{ id: 12, label: "Pendidikan dan Pelatihan" },
		{ id: 13, label: "Pajak dan Izin" },
	];
	return (
		<Stack
			display={"flex"}
			flexDirection={"column"}
			alignItems={"center"}
			sx={{ width: "100vw", height: "100vh" }}
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
			<Stack direction={"column"} gap={2} padding={2} width={1} height={1} maxWidth={"sm"}>
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

				{/* JENIS */}
				<Select value={selectedCategory} label="Jenis pengeluaran">
					{categories.map((category) => (
						<MenuItem key={category.id} onClick={() => setSelectedCategory(category.label)}>
							{category.label}
						</MenuItem>
					))}
				</Select>
			</Stack>
			<Navigation />
		</Stack>
	);
}
