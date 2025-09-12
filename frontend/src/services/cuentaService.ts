import axios from "axios";
import { CuentaDto, CuentaRequest } from "../types/auth";

const API_URL = "http://localhost:8080/api/cuentas";

export class CuentaService {
  private static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  /** GET /api/cuentas */
  static async obtenerCuentas(): Promise<CuentaDto[]> {
    try {
      const { data } = await axios.get<CuentaDto[]>(API_URL, {
        headers: this.getAuthHeaders(),
      });
      return data;
    } catch (error) {
      console.error("❌ Error al obtener cuentas:", error);
      throw new Error("Error al obtener cuentas.");
    }
  }

  /** POST /api/cuentas */
  static async crearCuenta(payload: CuentaRequest): Promise<CuentaDto> {
    try {
      const { data } = await axios.post<CuentaDto>(API_URL, payload, {
        headers: this.getAuthHeaders(),
      });
      return data;
    } catch (error) {
      console.error("❌ Error al crear cuenta:", error);
      throw new Error("Error al crear cuenta.");
    }
  }

  /** PATCH /api/cuentas/{id}/activo */
  static async actualizarActivo(id: number, activo: boolean): Promise<void> {
    try {
      await axios.patch(
        `${API_URL}/${id}/activo`,
        { activo }, // enviamos en body
        {
          headers: {
            ...this.getAuthHeaders(),
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("❌ Error al actualizar estado de cuenta:", error);
      throw new Error("Error al actualizar estado de cuenta.");
    }
  }
}


