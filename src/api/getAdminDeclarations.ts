export interface DeclarationResponse {
  id: number;
  userId: number | null;
  c1: any;
  c2: string;
  c3: string;
  c4: string;
  c5: string;
  c6: string;
  c7: string;
  c8: string;
  c9: string;
  c10: string;
  status: string;
  created_at: string;
  manager_id: number;
}

export async function fetchAdminDeclarations(): Promise<DeclarationResponse[]> {
  const response = await fetch("http://localhost:8080/api/v1/declarations/admin", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
