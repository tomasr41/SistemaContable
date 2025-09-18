// src/services/asientoService.ts
import axios from "axios";
import { AsientoDto, AsientoRequest, CuentaDto } from "../types/auth";

const API_BASE = "http://localhost:8080/api/asientos";
const API_CUENTAS = "http://localhost:8080/api/cuentas";

export class AsientoService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /** GET /api/cuentas */
  static async obtenerCuentas(): Promise<CuentaDto[]> {
    try {
      const { data } = await axios.get<CuentaDto[]>(API_CUENTAS, {
        headers: this.getAuthHeaders(),
      });
      return data;
    } catch (error) {
      console.error("❌ Error al obtener cuentas:", error);
      throw new Error("Error al obtener cuentas.");
    }
  }

 /** POST /api/asientos/crear */
static async crearAsiento(payload: AsientoRequest): Promise<AsientoDto> {
  try {
    const { data } = await axios.post<AsientoDto>(`${API_BASE}/crear`, payload, {
      headers: this.getAuthHeaders(),
    });
    return data;
  } catch (error: any) {
    console.error("❌ Error al crear asiento:", error);
    throw new Error(error.response?.data || "Error al crear asiento.");
  }
}


  /** GET /api/asientos/ultimos?n=5 */
  static async obtenerUltimosAsientos(n: number = 5): Promise<AsientoDto[]> {
    try {
      const { data } = await axios.get<AsientoDto[]>(`${API_BASE}/ultimos?n=${n}`, {
        headers: this.getAuthHeaders(),
      });
      return data;
    } catch (error) {
      console.error("❌ Error al obtener últimos asientos:", error);
      throw new Error("Error al obtener últimos asientos.");
    }
  }
}


