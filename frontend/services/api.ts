import axios from "axios";


const api = axios.create({
  baseURL: "https://industrial-knowledge-ai-backend.onrender.com",
});


export async function getDocuments() {

  const response = await api.get(
    "/api/documents"
  );

  return response.data;
}


export default api;