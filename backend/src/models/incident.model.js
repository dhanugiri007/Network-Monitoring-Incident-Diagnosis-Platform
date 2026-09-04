import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Incident = sequelize.define(
  "Incident",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    monitorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("ONGOING", "RESOLVED"),
      defaultValue: "ONGOING",
    },
    failureType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    downtimeSeconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "incidents",
    timestamps: false,
  }
);