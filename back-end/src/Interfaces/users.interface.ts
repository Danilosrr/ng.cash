export interface createUser {
  username: string;
  password: string;
}

export interface token {
  id: number;
  username: string;
  exp: number;
  iat: number;
};
