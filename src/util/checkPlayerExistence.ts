import { Op } from "sequelize";
import { Player } from "../models/Player";

export const checkPlayerExistence = async (username: string, email: string) => {
  const user = await Player.findOne({
    where: { [Op.or]: [{ userName: username }, { email: email }] },
  });
  if (!user) {
    return false;
  }
  return true;
};
