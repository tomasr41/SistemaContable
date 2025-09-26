// src/services/libroDiarioService.ts
import axios from "axios";
import { AsientoDto } from "../types/auth";

const API_BASE = "http://localhost:8080/api/asientos";

export class LibroDiarioService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }

  /** GET /api/asientos/libro-diario?desde=yyyy-MM-dd&hasta=yyyy-MM-dd */
static async obtenerPorRangoFechas(desde: string, hasta: string) {
  try {
    const { data } = await axios.get<AsientoDto[]>(
      `${API_BASE}/libro-diario?desde=${desde}&hasta=${hasta}`,
      { headers: this.getAuthHeaders() }
    );
    console.log("Asientos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener libro diario:", error);
    throw error;
  }
}
}