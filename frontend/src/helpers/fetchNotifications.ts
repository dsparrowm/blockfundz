import axios from "axios";


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3001";

export async function fetchNotifications() {
  try {
    const response = await axios.get(`${apiBaseUrl}/api/notifications`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}
