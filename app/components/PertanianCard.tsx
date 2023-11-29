import { Box, Button, Card, Modal, Paper, Stack, TextField, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { time } from "console";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface Product {
	id: number;
	name: string;
}

interface Yield {
	id: number;
	productId: number;
	plantingTime: string;
	harvestTime: any;
	description: string;
	quantity: number;
	isHarvested: boolean;
	product: Product;
}

export default function PertanianCard(props: { yields: Yield }) {
	const route = useRouter();

	// CONVERT TO READABLE DATE
	const isoDateString = props.yields.harvestTime;
	const isoDate = new Date(isoDateString);
	const options = { year: "numeric", month: "numeric", day: "numeric" };
	const readableDate = isoDate.toLocaleDateString("id-ID", options as Intl.DateTimeFormatOptions);

	const timeDifference = (time: any) => {
		const currentDateString = new Date().toISOString();
		const harvestDateString = new Date(time);

		const currentDate = new Date(currentDateString);
		const harvestDate = new Date(harvestDateString);

		const differenceMs = Math.abs(harvestDate.getTime() - currentDate.getTime());
		const differenceDays = differenceMs / (1000 * 60 * 60 * 24);
		return Math.floor(differenceDays);
	};

	const [modalOpen, setModalOpen] = useState(false);
	const handleOpenModal = () => {
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
	};

	const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
		props.yields.quantity = parseInt(event.target.value);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVICE_BASE}/yields/${props.yields.id}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						quantity: props.yields.quantity,
						isHarvested: true,
					}),
				}
			);
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
				setModalOpen(false);
				location.reload();
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<Card
				onClick={() => route.push(`/pertanian/update-catatan/${props.yields.id}`)}
				sx={{ cursor: "pointer" }}
			>
				<Stack direction={"row"} padding={2} justifyContent={"space-between"} alignItems={"center"}>
					{/* LEFT SIDE */}
					<Stack>
						{/* CATEGORY */}
						<Typography variant="body1">{props.yields.product.name}</Typography>
						{/* DESCRIPTION */}
						<Typography variant="caption">{props.yields.description}</Typography>
						{/* HARVEST DATE */}
						<Typography
							variant="caption"
							color={
								timeDifference(props.yields.harvestTime) == 0 ||
								props.yields.isHarvested ||
								props.yields.quantity > 0
									? "primary"
									: "warning.main"
							}
						>
							Panen {readableDate}
						</Typography>
					</Stack>
					<Stack>
						{props.yields.quantity > 0 ? (
							<Typography variant="body1" color={"primary"}>
								{props.yields.quantity} kg
							</Typography>
						) : timeDifference(props.yields.harvestTime) > 0 ? (
							<Button
								size="small"
								variant="outlined"
								startIcon={<AccessTimeIcon />}
								color="warning"
							>
								{timeDifference(props.yields.harvestTime)} HARI
							</Button>
						) : (
							<Button
								type="button"
								size="small"
								variant="contained"
								color="primary"
								onClick={(event: any) => {
									event.stopPropagation();
									handleOpenModal();
								}}
							>
								PANEN
							</Button>
						)}
					</Stack>
				</Stack>
			</Card>
			<Modal open={modalOpen} onClose={handleCloseModal}>
				<Box
					component="form"
					onSubmit={handleSubmit}
					maxWidth={"sm"}
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
						Jumlah Panen
					</Typography>
					<TextField
						sx={{ my: 1 }}
						id="outlined-basic"
						label="Jumlah Panen"
						variant="outlined"
						onChange={handleChangeQuantity}
					/>
					<Button type="submit" sx={{ my: 1 }} variant="contained">
						Simpan
					</Button>
				</Box>
			</Modal>
		</>
	);
}
