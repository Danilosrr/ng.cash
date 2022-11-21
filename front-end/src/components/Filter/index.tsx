import { Box, Button, TextField } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SetStateAction } from "react";

interface Props {
  date: Date | null;
  setDate: React.Dispatch<SetStateAction<Date | null>>;
}

function DateFilter({ date, setDate }: Props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDatePicker
          value={date}
          renderInput={(params) => <TextField {...params} />}
          onChange={(newValue: Date | null) => {
            setDate(newValue);
          }}
        />
      </LocalizationProvider>
      <Button variant="contained" type="submit" onClick={() => setDate(null)}>
        remover filtro
      </Button>
    </Box>
  );
}

export default DateFilter;
