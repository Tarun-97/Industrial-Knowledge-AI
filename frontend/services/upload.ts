import api from "./api";

export const uploadPDF = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/api/upload",
    formData
  );

  return response.data;
};