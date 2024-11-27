import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelCtor,
  Sequelize,
} from "sequelize";
import { League } from "./League";

export enum UserRole {
  "admin",
  "user",
}

export interface PlayerI
  extends Model<InferAttributes<PlayerI>, InferCreationAttributes<PlayerI>> {
  id: CreationOptional<string>;
  displayName: string;
  playerTag: string;
  userName: string;
  password: string;
  email: string;
  role: UserRole;
  refreshToken?: string;
}

export interface PlayerEnrollmentI
  extends Model<
    InferAttributes<PlayerEnrollmentI>,
    InferCreationAttributes<PlayerEnrollmentI>
  > {
  id: CreationOptional<string>;
  isOwner: boolean;
  isOrganizer: boolean;
  elo: number;
}

export let PlayerEnrollment: ModelCtor<PlayerEnrollmentI>;

export let Player: ModelCtor<PlayerI>;

export const registerPlayerModels = async (sequelize: Sequelize) => {
  Player = sequelize.define<PlayerI>("Player", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: new DataTypes.UUIDV4(),
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    playerTag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    userName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  PlayerEnrollment = sequelize.define<PlayerEnrollmentI>("PlayerEnrollment", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: new DataTypes.UUIDV4(),
    },
    isOwner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isOrganizer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    elo: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
      allowNull: false,
    },
  });

  Player.hasMany(PlayerEnrollment);
  PlayerEnrollment.belongsTo(Player);
  League.hasMany(PlayerEnrollment);
  PlayerEnrollment.belongsTo(League);
};
