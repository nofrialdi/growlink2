import {
	BottomNavigation,
	BottomNavigationAction,
	Button,
	Container,
	IconButton,
	Paper,
	SpeedDial,
	SpeedDialAction,
	Stack,
} from "@mui/material";
import Grass from "@mui/icons-material/Grass";
import Home from "@mui/icons-material/Home";
import AttachMoney from "@mui/icons-material/AttachMoney";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import AddCardIcon from "@mui/icons-material/AddCard";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useState } from "react";

export default function Navigation() {
	const [value, setValue] = useState("recents");
	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	const actions = [
		{
			icon: <AddCardIcon />,
			name: "Transaksi Baru",
			onclick: () => {
				window.location.href = "/keuangan/catat/pengeluaran";
			},
		},
		{
			icon: <AddBusinessIcon />,
			name: "Pertanian Baru",
			onclick: () => {
				window.location.href = "/pertanian/catat";
			},
		},
	];
	return (
		<Stack width={1} maxWidth={"sm"} position={"fixed"} bottom={0}>
			<BottomNavigation showLabels value={value} onChange={handleChange}>
				<BottomNavigationAction
					showLabel
					label="Home"
					icon={<Home />}
					onClick={() => (window.location.href = "/home")}
				/>
				<BottomNavigationAction
					showLabel
					label="Pertanian"
					icon={<Grass />}
					onClick={() => (window.location.href = "/pertanian")}
				/>
				<BottomNavigationAction showLabel label="" disabled />
				<BottomNavigationAction
					showLabel
					label="Keuangan"
					icon={<AttachMoney />}
					onClick={() => (window.location.href = "/keuangan/histori")}
				/>
				<BottomNavigationAction
					showLabel
					label="Cuaca"
					icon={<WbSunnyIcon />}
					onClick={() => (window.location.href = "/cuaca")}
				/>
			</BottomNavigation>
			<SpeedDial
				ariaLabel="SpeedDial basic example"
				sx={{ position: "absolute", bottom: 10, right: 0, left: 0 }}
				icon={<SpeedDialIcon />}
			>
				{actions.map((action) => (
					<SpeedDialAction
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						onClick={action.onclick}
					/>
				))}
			</SpeedDial>
		</Stack>
	);
}
