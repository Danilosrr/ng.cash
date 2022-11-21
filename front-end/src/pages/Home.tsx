import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import api, { Transaction } from "../services/api";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import DateFilter from "../components/Filter";

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
    padding: "10px",
    gap: "10px",
  },
  containerButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "fit-content",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    width: "100%",
    height: "calc(100% - 60px)",
    borderRadius: "8px",
  },
  buttonSelected: {
    height: "30px",
    color: "#fff",
    backgroundColor: "#7431F4",
  },
  button: {
    height: "30px",
    color: "#7431F4",
    backgroundColor: "#fff",
  },
};

function Home() {
  const { token } = useAuth();
  const [type, setType] = useState<"credit" | "debit" | null>(null);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [date, setDate] = useState<Date | null>(null);
  const [info, setInfo] = useState<Transaction[] | []>([]);

  useEffect(() => {
    async function loadPage() {
      if (!token) return;
    }
    async function getInfo() {
      const { data: extract } = await api.getExtract({
        token: token as string,
        type,
        date,
      });
      setInfo(extract);
      console.log(extract);
    }

    loadPage();
    getInfo();
  }, [token, type, date]);

  return (
    <>
      <Box sx={styles.container}>
        <ButtonGroup
          color="secondary"
          variant="contained"
          sx={styles.containerButton}
        >
          <Button
            sx={type === "credit" ? styles.buttonSelected : styles.button}
            onClick={() => {
              setType("credit");
            }}
          >
            Crédito
          </Button>
          <Button
            sx={type === "debit" ? styles.buttonSelected : styles.button}
            onClick={() => {
              setType("debit");
            }}
          >
            Débito
          </Button>
          <Button
            sx={!type ? styles.buttonSelected : styles.button}
            onClick={() => {
              setType(null);
            }}
          >
            Todos
          </Button>
        </ButtonGroup>
        <Box sx={{ ...styles.info, overflowY: "scroll" }}>
          {info.map((transaction) => {
            return (
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {transaction.type === "debit" ? (
                      <ArrowDropDownIcon fontSize="large" color="error" />
                    ) : (
                      <ArrowDropUpIcon fontSize="large" color="success" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={transaction.value + " R$"}
                    secondary={String(transaction.createdAt).split("T")[0]}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </Box>
        <Box sx={{ position: "absolute", bottom: "20px", right: "20px" }}>
          <EventIcon color="primary" onClick={() => setDrawer(true)} />
        </Box>
        <Drawer
          anchor={"bottom"}
          open={drawer}
          onClose={(event: React.KeyboardEvent | React.MouseEvent) => {
            setDrawer(false);
          }}
        >
          <DateFilter date={date} setDate={setDate} />
        </Drawer>
      </Box>
    </>
  );
}

export default Home;
