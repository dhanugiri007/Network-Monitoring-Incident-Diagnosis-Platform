import {sequelize} from '../config/db.js';
import { Monitor } from './monitor.model.js';
import { CheckResult } from './checkResult.model.js';
import { Incident } from './incident.model.js';
import { Dependency } from './dependency.model.js';


Monitor.hasMany(CheckResult, { foreignKey: "monitorId" });
CheckResult.belongsTo(Monitor, { foreignKey: "monitorId" });

Monitor.hasMany(Incident, { foreignKey: "monitorId" });
Incident.belongsTo(Monitor, { foreignKey: "monitorId" });

Monitor.belongsToMany(Monitor, {
  through: Dependency,
  as: "dependsOn",
  foreignKey: "childMonitorId",
  otherKey: "parentMonitorId",
});

export const syncModels = async () => {
  await sequelize.sync({ alter: true });
  console.log("Models synced to PostgreSQL");
};

export { Monitor, CheckResult, Incident, Dependency };