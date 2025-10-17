export interface IConsecutiveResult {
  consecutive: string;           // '00101010000000000123' (20 dígitos)
  consecutiveFormatted: string; // '001-01-01-0000000000123'
  sucursal: string;              // '001'
  terminal: string;              // '01'
  tipo: string;                  // '01'
  sequence: number;             // 123
}