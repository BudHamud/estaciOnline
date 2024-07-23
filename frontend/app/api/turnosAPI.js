// turnosAPI.js

import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_APP_URL}/turnos`,
});

const getTurnos = async (tel) => {
  try {
    const response = await api.get(`/${tel}`);
    return response.data; // Devuelve los datos de los turnos
  } catch (error) {
    console.error("Error al obtener los turnos:", error.message);
    throw error;
  }
};

const createTurnos = async (turno) => {
  try {
    const response = await api.post("/", turno);
    return response.data; // Devuelve el turno creado
  } catch (error) {
    console.error("Error al crear el turno:", error.message);
    throw error;
  }
};

const updateTurnos = async (id, turno) => {
  try {
    const response = await api.put(`/${id}`, turno);
    return response.data; // Devuelve el turno modificado
  } catch (error) {
    console.error("Error al modificar el turno:", error.message);
    throw error;
  }
};

const turnosAPI = { getTurnos, createTurnos, updateTurnos };

export default turnosAPI;
