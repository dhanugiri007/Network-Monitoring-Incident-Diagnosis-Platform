import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const CheckResult = sequelize.define(
  "CheckResult",
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
      type: DataTypes.ENUM("SUCCESS", "FAILURE"),
      allowNull: false,
    },
    failureType: {
      type: DataTypes.ENUM(
        "DNS_FAILURE",
        "CONNECTION_FAILURE",
        "TLS_FAILURE",
        "HTTP_FAILURE",
        "TIMEOUT",
        "LATENCY_DEGRADED"
      ),
      allowNull: true,
    },
    responseTimeMs: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    httpStatusCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    checkedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "check_results",
    timestamps: false,
  }
);