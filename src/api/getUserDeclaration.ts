// Define the response interface.
export interface DeclarationResponse {
  id: number;
  userId: number | null;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  c5: string;
  c6: string;
  c7: string;
  c8: string;
  c9: string;
  c10: string;
}

export async function fetchUserDeclaration(token: string): Promise<DeclarationResponse> {
  const response = await fetch("http://localhost:8080/api/v1/declarations/user", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
