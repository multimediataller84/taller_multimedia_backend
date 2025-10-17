import { Transaction } from "sequelize";
import { sequelize } from "../../../database/connection.js";
import Consecutive from "../domain/models/ConsecutiveGenModel.js";
import type { IConsecutiveResult } from "../domain/interfaces/IConsecutiveResult.js";
import type { IConsecutiveParsed } from "../domain/interfaces/IConsecutiveParsed.js";

export class ConsecutiveService {
  static async getNext(
    sucursal: string,
    terminal: string,
    tipo: string,
    transaction: Transaction
  ): Promise<IConsecutiveResult> {
    this.validateParameters(sucursal, terminal, tipo);

    const t = transaction || (await sequelize.transaction());

    try {
      let [consecutivoConfig, created] = await Consecutive.findOrCreate({
        where: { sucursal, terminal, tipo },
        defaults: {
          sucursal,
          terminal,
          tipo,
          secuencia_actual: 0,
        },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      const newSequence = consecutivoConfig.secuencia_actual + 1;

      if (newSequence > 9999999999999) {
        throw new Error(
          `Sequence limit reached for ${sucursal}-${terminal}-${tipo}. ` +
            `Maximum allowed: 9,999,999,999,999`
        );
      }

      await consecutivoConfig.update(
        { secuencia_actual: newSequence },
        { transaction: t }
      );

      const consecutive = this.formatConsecutive(
        sucursal,
        terminal,
        tipo,
        newSequence
      );

      const consecutiveFormatted = this.formatForDisplay(consecutive);

      if (!transaction) {
        await t.commit();
      }

      return {
        consecutive,
        consecutiveFormatted,
        sucursal,
        terminal,
        tipo,
        sequence: newSequence,
      };
    } catch (error) {
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }

  private static formatConsecutive(
    sucursal: string,
    terminal: string,
    tipo: string,
    sequence: number
  ): string {
    const secuenciaStr = sequence.toString().padStart(13, "0");

    return `${sucursal}${terminal}${tipo}${secuenciaStr}`;
  }

  static formatForDisplay(consecutivo: string): string {
    if (consecutivo.length !== 20) {
      throw new Error(
        `Consecutive must have 20 digits. Received: ${consecutivo.length}`
      );
    }

    if (!/^\d{20}$/.test(consecutivo)) {
      throw new Error("Consecutive must contain only numeric digits");
    }

    const sucursal = consecutivo.substring(0, 3);
    const terminal = consecutivo.substring(3, 5);
    const type = consecutivo.substring(5, 7);
    const sequence = consecutivo.substring(7, 20);

    return `${sucursal}-${terminal}-${type}-${sequence}`;
  }

  private static validateParameters(
    sucursal: string,
    terminal: string,
    tipo: string
  ): void {
    if (!sucursal || !/^\d{3}$/.test(sucursal)) {
      throw new Error(
        `Invalid sucursal: "${sucursal}". Must have exactly 3 numeric digits (e.g. "001")`
      );
    }

    if (!terminal || !/^\d{2}$/.test(terminal)) {
      throw new Error(
        `Invalid terminal: "${terminal}". Must have exactly 2 numeric digits (e.g. "01")`
      );
    }

    if (!tipo || !/^\d{2}$/.test(tipo)) {
      throw new Error(
        `Invalid type: "${tipo}". Must have exactly 2 numeric digits (e.g. "01")`
      );
    }
  }

  static async getCurrentSequence(
    sucursal: string,
    terminal: string,
    tipo: string
  ): Promise<number> {
    this.validateParameters(sucursal, terminal, tipo);

    const config = await Consecutive.findOne({
      where: { sucursal, terminal, tipo },
    });

    return config ? config.secuencia_actual : 0;
  }

  static parse(consecutivo: string): IConsecutiveParsed {
    if (!consecutivo || consecutivo.length !== 20) {
      throw new Error(
        `Invalid consecutive: "${consecutivo}". Must have exactly 20 digits.`
      );
    }

    if (!/^\d{20}$/.test(consecutivo)) {
      throw new Error("Consecutive must contain only numeric digits");
    }

    return {
      sucursal: consecutivo.substring(0, 3),
      terminal: consecutivo.substring(3, 5),
      tipo: consecutivo.substring(5, 7),
      secuencia: parseInt(consecutivo.substring(7, 20), 10),
    };
  }

  static async initialize(
    sucursal: string,
    terminal: string,
    tipo: string,
    secuenciaInicial: number = 0
  ): Promise<Consecutive> {
    this.validateParameters(sucursal, terminal, tipo);

    if (secuenciaInicial < 0 || secuenciaInicial > 9999999999999) {
      throw new Error(
        "Initial sequence must be between 0 and 9,999,999,999,999"
      );
    }

    const [consecutivo, created] = await Consecutive.findOrCreate({
      where: { sucursal, terminal, tipo },
      defaults: {
        sucursal,
        terminal,
        tipo,
        secuencia_actual: secuenciaInicial,
      },
    });

    if (!created) {
      throw new Error(
        `There is already a consecutive for ${sucursal}-${terminal}-${tipo}`
      );
    }

    return consecutivo;
  }

  static async getAll(): Promise<Consecutive[]> {
    return await Consecutive.findAll({
      order: [
        ["sucursal", "ASC"],
        ["terminal", "ASC"],
        ["tipo", "ASC"],
      ],
    });
  }

  static async exists(
    sucursal: string,
    terminal: string,
    tipo: string
  ): Promise<boolean> {
    this.validateParameters(sucursal, terminal, tipo);

    const count = await Consecutive.count({
      where: { sucursal, terminal, tipo },
    });

    return count > 0;
  }

  static async reset(
    sucursal: string,
    terminal: string,
    tipo: string,
    newSequence: number = 0
  ): Promise<void> {
    this.validateParameters(sucursal, terminal, tipo);

    if (newSequence < 0 || newSequence > 9999999999999) {
      throw new Error("New sequence must be between 0 and 9,999,999,999,999");
    }

    const resultado = await Consecutive.update(
      { secuencia_actual: newSequence },
      { where: { sucursal, terminal, tipo } }
    );

    if (resultado[0] === 0) {
      throw new Error(
        `No consecutive found for ${sucursal}-${terminal}-${tipo}`
      );
    }
  }
}

export default ConsecutiveService;
