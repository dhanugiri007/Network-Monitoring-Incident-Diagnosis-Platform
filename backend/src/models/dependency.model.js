import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Dependency = sequelize.define(
  "Dependency",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parentMonitorId: {
      // the monitor that others depend on (e.g. "Database")
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    childMonitorId: {
      // the monitor that depends on parent (e.g. "API Server")
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "dependencies",
    timestamps: false,
  }
);