import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

export const updateProfile = async (data) => {
  const response = await axios.put(
    `${API_URL}/users/me`,
    data
  );

  return response.data;
};

export const deleteProfile = async () => {
  const response = await axios.delete(
    `${API_URL}/users/me`
  );

  return response.data;
};