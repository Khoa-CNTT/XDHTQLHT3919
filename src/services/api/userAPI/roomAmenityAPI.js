import axios from "axios";

const API_URL = "https://localhost:7154/api/RoomAmenity";

export const getAmenitiesByRoom = (roomId) =>
  axios.get(`${API_URL}/${roomId}`);

export const assignAmenitiesToRoom = (roomId, amenityIds) =>
  axios.post(`${API_URL}/assign`, {
    roomId,
    amenityIds,
  });
