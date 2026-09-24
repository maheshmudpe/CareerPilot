import api from "../../services/api";

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export const registerUser = async (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    "/auth/register",
    payload,
  );

  return response.data;
};

export const loginUser = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    payload,
  );

  return response.data;
};