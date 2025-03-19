export interface RegisterRequest {
  firstname: string;
  email: string;
  lastname: string;
  middlename: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
}

export async function registerUser(user: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch("http://localhost:8080/api/v1/auth/register", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: RegisterResponse = await response.json();
  return data;
}
