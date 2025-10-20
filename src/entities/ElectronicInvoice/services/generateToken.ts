import axios from "axios";

export class GenerateToken {
  private tokenActual: string | null = null;
  private expiracion: number = 0;

  private readonly client_id = "api-stag";
  private readonly client_secret = "api-stag";
  private readonly username =
    "cpf-01-0011-0000100537@stag.comprobanteselectronico.go.cr";
  private readonly password = "abc123";

  private readonly url =
    "https://idp.comprobanteselectronicos.go.cr/auth/realms/rut-stag/protocol/openid-connect/token";

  private async obtenerToken(): Promise<string> {
    const data = new URLSearchParams();
    data.append("client_id", this.client_id);
    data.append("client_secret", this.client_secret);
    data.append("grant_type", "password");
    data.append("username", this.username);
    data.append("password", this.password);

    try {
      const response = await axios.post(this.url, data.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      console.log("Token successfully obtained");
      return response.data.access_token;
    } catch (error: any) {
      console.error(
        "Error obtaining token from the Hacienda",
        error.response?.data || error.message
      );
      throw new Error("Error obtaining token from the Hacienda");
    }
  }

  async getToken(): Promise<string> {
    const ahora = Date.now();

    if (!this.tokenActual || ahora >= this.expiracion) {
      console.log("Generating new token...");
      this.tokenActual = await this.obtenerToken();
      this.expiracion = ahora + 4 * 60 * 1000;
    } else {
      console.log("Reusing existing token");
    }

    return this.tokenActual;
  }
}
