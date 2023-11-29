"use client";

import {
	Autocomplete,
	Box,
	Button,
	ButtonGroup,
	Container,
	FormControl,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import TopBar from "@/app/components/TopBar";
import { useEffect, useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Navigation from "@/app/components/navigation2";
import { ToastContainer, toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

interface TransactionCategory {
	id: number;
	name: string;
}

interface Transaction {
	amount: number;
	date: Date;
	description: string;
	categoryId: number;
	categories: {
		id: number;
		name: string;
	};
}

export default function Page({ params }: { params: { id: string } }) {
	const [active, setActive] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [transactionCategory, setTransactionCategory] = useState<TransactionCategory[]>([]);
	const [amount, setAmount] = useState(0);
	const [description, setDescription] = useState("");
	const [transactionTime, setTransactionTime] = useState("");
	const [selectedTransactionTime, setSelectedTransactionTime] = useState(new Date(transactionTime));
	const [selectedTransactionDate, setSelectedTransactionDate] = useState<Dayjs | null>(null);
	const [categoryId, setCategoryId] = useState("");

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleChange = (event: SelectChangeEvent) => {
		setSelectedCategory(event.target.value as string);
		setCategoryId(event.target.value as string);
	};

	const handleTransactionDateChange = (date: any) => {
		setSelectedTransactionDate(date);
	};

	async function getCategories() {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVICE_BASE}/transactions/categories`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
				}
			);
			const data = await response.json();
			setTransactionCategory(data);
		} catch (error) {
			console.log(error);
		}
	}

	async function getTransaction() {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVICE_BASE}/transactions/${params.id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
				}
			);
			const data = await response.json();
			setAmount(data.amount);
			setDescription(data.description);

			const dt = convertDateDes(data.transactionTime);
			setTransactionTime(dt);
			setSelectedTransactionDate(dayjs(dt));
			setSelectedCategory(data.transactionCategory.name);
		} catch (error) {
			console.log(error);
		}
	}

	const convertDateDes = (isoDate: string) => {
		const date = new Date(isoDate);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();

		if (month < 10) {
			return `${year}-0${month}-${day}`;
		}
		if (day < 10) {
			return `${year}-${month}-0${day}`;
		}

		return `${year}-${month}-${day}`;
	};

	const handleSubmitAmount = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVICE_BASE}/transactions/${params.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
					},
					body: JSON.stringify({
						amount: amount,
					}),
				}
			);
			handleCloseModal();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getCategories();
	}, []);

	useEffect(() => {
		getTransaction();
	}, [params.id]);

	// const handelSubmitPengeluaran = async (event: React.FormEvent<HTMLFormElement>) => {
	// 	event.preventDefault();
	// 	try {
	// 		const response = await axios.patch(
	// 			`${process.env.NEXT_PUBLIC_SERVICE_BASE}/transactions/${params.id}`,
	// 			{
	// 				amount: amount,
	// 				description: description,
	// 				transactionTime: transactionTime,
	// 				transactionCategory: {
	// 					id: categoryId,
	// 					name: selectedCategory,
	// 				},
	// 			},
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
	// 				},
	// 			}
	// 		);
	// 		console.log(response.data);
	// 		toast.success("Pengeluaran Berhasil");
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	const updateDataPengeluaran = async (id: string, data: any) => {
		let response = null;
		let bearer = "";

		if (typeof window !== "undefined") {
			const accessToken = localStorage.getItem("accessToken");
			if (accessToken) {
				bearer = `Bearer ${accessToken}`;

				try {
					const config = {
						headers: {
							Authorization: bearer,
							"Content-Type": "application/json",
						},
					};

					const updatedData = {
						amount: data.amount,
						description: data.description,
						transactionTime: data.transactionTime,
						transactionCategory: {
							name: selectedCategory,
						},
					};

					const response = await axios.patch(
						`${process.env.NEXT_PUBLIC_SERVICE_BASE}/transactions/${id}`,
						updatedData,
						config
					);
					return response.data;
				} catch (error) {
					console.error("Error:", error);
					return null;
				}
			} else {
				response = { error: "Access token not found" };
			}
		} else {
			response = { error: "localStorage not available on the server" };
		}

		return response;
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const data: any = {};

		Array.from(formData.entries()).forEach(([key, value]) => {
			data[key] = value;
		});

		data.transactionTime = selectedTransactionDate;
		data.amout = amount;
		data.transactionCategory = selectedCategory;

		try {
			const res: any = await updateDataPengeluaran(params.id, data);
			console.log(res);
			if (res) {
				toast.success("Data updated successfully!", {
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
				toast.error("Data failed to update", {
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
		} catch {
			toast.error("Data failed to update", {
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
	};

	return (
		<Stack
			display={"flex"}
			flexDirection={"column"}
			alignItems={"center"}
			padding={0}
			height={"100vh"}
		>
			{/* TOPBAR */}
			<TopBar />

			<ToastContainer />

			<Modal open={isModalOpen} onClose={handleCloseModal}>
				<Box
					maxWidth={"sm"}
					component={"form"}
					onSubmit={handleSubmitAmount}
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						borderRadius: "10px",
						boxShadow: 24,
						p: 4,
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Typography sx={{ my: 1 }} id="modal-modal-title" variant="h6" component="h2">
						Jumlah Pengeluaran
					</Typography>
					<TextField
						sx={{ my: 1 }}
						id="outlined-basic"
						label="Jumlah Pengeluaran"
						variant="outlined"
						type="number"
						name="amount"
						onChange={(e) => setAmount(Number(e.target.value))}
					/>
					<Button type="submit" sx={{ my: 1 }} variant="contained">
						Simpan
					</Button>
				</Box>
			</Modal>

			{/* CONTENT */}

			<Stack
				maxWidth={"sm"}
				component={"form"}
				width={1}
				height={1}
				bgcolor={"#FFFFFF"}
				padding={2}
				alignItems={"center"}
				paddingBottom={10}
				onSubmit={handleSubmit}
			>
				{/* TOP */}
				<Typography variant="h6" color={"primary.main"} marginBottom={2}>
					Ubah Pengeluaran
				</Typography>

				<Typography
					onClick={handleOpenModal}
					variant="h4"
					color={"primary.main"}
					marginTop={"auto"}
					sx={{ cursor: "pointer" }}
				>
					{Number(amount).toLocaleString("id-ID", {
						currency: "IDR",
						style: "currency",
					})}
				</Typography>

				{/* MODAL */}

				{/* FORM */}

				<Stack direction={"column"} width={"100%"} gap={2} marginTop={"auto"}>
					{/* DATE */}
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							format="DD/MM/YYYY"
							label="Tanggal transaksi"
							value={selectedTransactionDate}
							onChange={(date) => handleTransactionDateChange(date)}
						/>
					</LocalizationProvider>

					<FormControl sx={{ my: 1 }} fullWidth>
						<InputLabel id="categorySelected">Category</InputLabel>
						<Select
							onChange={handleChange}
							value={selectedCategory}
							labelId="categorySelected"
							label="Category"
						>
							{transactionCategory?.map((category) => (
								<MenuItem key={category.id} value={category.name}>
									{category.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* DESKRIPSI */}
					<TextField
						id="description"
						label="Deskripsi (opsional)"
						variant="outlined"
						fullWidth
						value={description}
						name="description"
						onChange={(e) => setDescription(e.target.value)}
					/>
					<Button variant="contained" size="large" type="submit">
						Simpan
					</Button>
				</Stack>
				{/* </Stack> */}
			</Stack>
			<Navigation />
		</Stack>
	);
}
