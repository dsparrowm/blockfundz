import axiosInstance from "../api/axiosInstance";




export async function fetchNotifications() {
  try {
    const response = await axiosInstance.get(`/api/notifications`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}
