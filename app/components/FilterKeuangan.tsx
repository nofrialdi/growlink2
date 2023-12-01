import { useEffect, useState } from "react";
import React from "react";

import {
  AppBar,
  Badge,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TransactionCategory } from "../interfaces/interface";

export default function FilterKeuangan(props: {
  selectedType: string;
  setSelectedType: any;
  getTransactions: any;
}) {
  const [open, setOpen] = useState(false);
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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleTypeChange = (event: any) => {
    props.setSelectedType(event.target.value as string);
  };

  const clearType = () => {
    props.setSelectedType("");
  };
  useEffect(() => {}, []);

  return (
    <>
      {/* BUTTON */}
      <IconButton sx={{ color: "#ffffff" }} onClick={handleClickOpen}>
        <Badge
          badgeContent={4}
          color="error"
          variant="dot"
          invisible={props.selectedType == ""}
        >
          <TuneIcon />
        </Badge>
      </IconButton>
      {/* DIALOG */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Filter"}</DialogTitle>
        <Stack direction={"row"} paddingX={3}>
          {props.selectedType !== "" && (
            <Chip size="small" label={"Tipe"} onDelete={clearType} />
          )}
        </Stack>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <DialogContentText>Tanggal</DialogContentText>
          <Stack direction={"row"} justifyContent={"space-between"} gap={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Dari" />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Hingga" />
            </LocalizationProvider>
          </Stack>

          <DialogContentText>Jenis</DialogContentText>
          <FormControl fullWidth>
            <InputLabel>Tipe</InputLabel>
            <Select
              value={props.selectedType}
              label="Tipe"
              onChange={handleTypeChange}
            >
              <MenuItem value={"EXPENSE"}>Pengeluaran</MenuItem>
              <MenuItem value={"INCOME"}>Pemasukan</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
            }}
          >
            Batal
          </Button>
          <Button
            onClick={() => {
              props.getTransactions();
              handleClose();
            }}
            autoFocus
          >
            Terapkan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
