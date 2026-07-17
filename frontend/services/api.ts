import axios from "axios";


const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});


export async function getDocuments() {

  const response = await api.get(
    "/api/documents"
  );

  return response.data;
}


export default api;