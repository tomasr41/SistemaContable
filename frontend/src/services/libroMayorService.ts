// src/services/libroMayorService.ts
import axios from "axios";
import { LibroMayorDto } from "../types/auth";

const API_BASE = "http://localhost:8080/api/asientos";

export class LibroMayorService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }

  /**
   * GET /api/asientos/libro-mayor/{cuentaId}?desde=yyyy-MM-dd&hasta=yyyy-MM-dd
   */
  static async obtenerLibroMayor(cuentaId: number, desde: string, hasta: string) {
    try {
      const { data } = await axios.get<LibroMayorDto>(
        `${API_BASE}/libro-mayor/${cuentaId}?desde=${desde}&hasta=${hasta}`,
        { headers: this.getAuthHeaders() }
      );
      console.log("Libro Mayor:", data);
      return data;
    } catch (error) {
      console.error("Error al obtener libro mayor:", error);
      throw error;
    }
  }
}
