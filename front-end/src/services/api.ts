import axios from "axios";

const baseAPI = axios.create({
  baseURL: "http://localhost:4000/",
});

interface UserData {
  username: string;
  password: string;
}

function getConfig(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

async function signUp(signUpData: UserData) {
  await baseAPI.post("/signup", signUpData);
}

async function signIn(signInData: UserData) {
  return baseAPI.post<{ token: string }>("/signin", signInData);
}

export type Extract = {
  token: string;
  date?: Date | null;
  type?: "credit" | "debit" | null;
};

export type Transaction = {
  id: number;
  creditedAccountId: number;
  debitedAccountId: number;
  type: "credit" | "debit";
  value: number;
  createdAt: Date;
};

async function getExtract(request: Extract) {
  const { token, date, type } = request;
  const config = getConfig(token);
  const dateFilter = !!date ? `date=${date.toISOString().split("T")[0]}` : "";
  const typeFilter = !!type ? `type=${type}` : "";
  return baseAPI.get<Transaction[]>(
    `/extract?${dateFilter}&${typeFilter}`,
    config
  );
}

const api = {
  signUp,
  signIn,
  getExtract,
};

export default api;
