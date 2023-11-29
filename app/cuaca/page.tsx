"use client";
import { Box, Button, Card, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";
import Navigation from "../components/navigation2";
import Image from "next/image";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

export default function Cuaca() {
	const router = useRouter();
	const [city, setCity] = useState("");
	const [weatherData, setWeatherData] = useState<any[]>([]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCity(event.target.value);
	};

	const getWeatherDetail = (city: string, lat: number, lon: number) => {
		const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY}`;
		try {
			fetch(WEATHER_API_URL).then((res) => {
				res.json().then((data) => {
					console.log(data);

					//filter the forecasts to get only one forecast per day
					const uniqueForecastDays: number[] = [];
					const fiveDaysForecast = data.list.filter(
						(forecast: { dt_txt: string | number | Date }) => {
							const forecastDate = new Date(forecast.dt_txt).getDate();
							if (!uniqueForecastDays.includes(forecastDate)) {
								return uniqueForecastDays.push(forecastDate);
							}
						}
					);
					console.log(fiveDaysForecast);
					const weatherData = fiveDaysForecast.map((forecast: any) => ({
						dt_txt: forecast.dt_txt,
						main: forecast.main,
						weather: forecast.weather,
						wind: forecast.wind,
					}));
					setWeatherData(weatherData);
					console.log(weatherData);
				});
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_MAP_API_KEY}`;

		try {
			fetch(GEOCODING_API_URL).then((res) => {
				res.json().then((data) => {
					if (!data) {
						alert("Kota tidak ditemukan");
					}
					const { city, lat, lon } = data[0];
					getWeatherDetail(city, lat, lon);
					console.log(data);
					setCity(city);
				});
			});
		} catch (error) {
			console.log(error);
		}
	};
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
				<Container maxWidth={"sm"} sx={{ display: "flex" }}>
					<Button
						onClick={() => router.push("/")}
						startIcon={<ArrowBackIosNewIcon />}
						variant="text"
						sx={{ color: "#ffffff" }}
					>
						Cuaca
					</Button>
				</Container>
			</Paper>

			{/* CONTENT */}

			<Box
				maxWidth={"sm"}
				width={1}
				display={"flex"}
				flexDirection={"column"}
				paddingX={4}
				paddingY={8}
			>
				<Box
					component={"form"}
					onSubmit={handleSubmit}
					sx={{ my: 1, width: "100%", flexDirection: "row" }}
					display={"flex"}
				>
					<TextField defaultValue={city} onChange={handleChange} fullWidth label="Kota" />
					<Button type="submit" variant="contained" sx={{ ml: 3 }}>
						Cari
					</Button>
				</Box>

				{/* <Button sx={{ mt: 2 }} variant="contained" fullWidth>
					Cuaca Kota: {weatherData[0]?.city}
				</Button> */}

				{/* WEATHER DATA */}

				<Box
					maxWidth={"sm"}
					display={"flex"}
					width={"100%"}
					flexDirection={"row"}
					gap={2}
					flexWrap={"wrap"}
					justifyContent={"center"}
				>
					{weatherData.map((item, index) => (
						<Box
							key={index}
							bgcolor={"#ffffff"}
							borderRadius={2}
							border={1}
							borderColor={"primary.main"}
							mt={2}
							sx={{ width: "100%", flexDirection: "row" }}
							display={"flex"}
							p={2}
							justifyContent={"space-between"}
						>
							<Box sx={{ width: "100%" }} display={"flex"} flexDirection={"column"}>
								<Typography variant="h6">{item.dt_txt.split(" ")[0]}</Typography>
								<Typography variant="body1">temperatur : {item.main.temp} °C</Typography>
								<Typography variant="body1">Angin : {item.wind.speed}</Typography>
								<Typography variant="body1">Kelembaban : {item.main.humidity}%</Typography>
							</Box>
							<Box flexDirection={"column"} display={"flex"}>
								<img
									src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
									alt="cuaca"
									width={90}
									height={90}
								/>
								<Typography textAlign={"center"} variant="caption">
									{item.weather[0].description}
								</Typography>
							</Box>
						</Box>
					))}
				</Box>
			</Box>
			<Navigation />
		</Stack>
	);
}
