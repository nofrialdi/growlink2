import React from "react";
import { BottomNavigation, BottomNavigationAction, Box, SpeedDial } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import GrassIcon from "@mui/icons-material/Grass";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function Navigation() {
	const [value, setValue] = React.useState("recents");

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};

	return (
		<BottomNavigation
			sx={{
				width: 320,
				height: 50,
				position: "fixed",
				bottom: 0,
				backgroundColor: "#ffffff",
				opacity: "100%",
				zIndex: 1,
			}}
			value={value}
			onChange={handleChange}
		>
			<BottomNavigationAction label="home" value="home" icon={<HomeIcon />} />
			<BottomNavigationAction label="Pertanian" value="Pertanian" icon={<GrassIcon />} />
			<BottomNavigationAction label="Keuangan" value="Keuangan" icon={<AttachMoneyIcon />} />
			<BottomNavigationAction label="Cuaca" value="Cuaca" icon={<ThunderstormIcon />} />
		</BottomNavigation>
	);
}
