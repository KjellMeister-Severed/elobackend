import bcrypt from "bcrypt";
import { Player, UserRole } from "../models/Player";
import { RegisterRequestI } from "../types/AuthTypes";
import { Op } from "sequelize";

export const checkUserCredentials = async (
  username: string,
  password: string,
) => {
  const user = await Player.findOne({ where: { userName: username } });
  if (!user) {
    return false;
  }
  return await bcrypt.compare(password, user.password);
};

export const registerPlayer = async (body: RegisterRequestI) => {
  const newUser = await Player.create({
    displayName: body.displayName,
    playerTag: body.playerTag,
    email: body.email.toUpperCase(),
    userName: body.username,
    role: "user" as unknown as UserRole,
    password: await bcrypt.hash(body.password, 10),
  });
  await newUser.save();
};

export const authenticateUser = async (username: string) => {
  const user = await Player.findOne({
    where: {
      [Op.or]: [{ userName: username }, { email: username.toUpperCase() }],
    },
  });
  if (!user) {
    return null;
  }

  return user;
};
