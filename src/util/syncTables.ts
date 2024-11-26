import { Sequelize } from "sequelize";
import { registerPlayerModels } from "../models/Player";
import { registerLeagueModels } from "../models/League";
import { registerMatchModels } from "../models/Match";
import { registerPlatformSettingsModels } from "../models/platformSettings";
//import { registerLeagueModels } from "../models/League";
//import { registerMatchModels } from "../models/Match";
export default async (sequelizeimport: Sequelize) => {
  await registerLeagueModels(sequelizeimport);
  await registerPlayerModels(sequelizeimport);
  await registerMatchModels(sequelizeimport);
  await registerPlatformSettingsModels(sequelizeimport);
};
