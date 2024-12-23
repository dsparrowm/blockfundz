import axios from "axios";

export async function fetchNotifications() {
  try {
    const response = await axios.get("/api/notifications");
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}
