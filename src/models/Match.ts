import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelCtor,
  Sequelize,
} from "sequelize";
import { PlayerEnrollment } from "./Player";

export enum PlayerEnumI {
  "playerOne",
  "playerTwo",
}

export interface MatchI
  extends Model<InferAttributes<MatchI>, InferCreationAttributes<MatchI>> {
  id: CreationOptional<string>;
  entryDate: Date;
  playerOneResult: number;
  playerTwoResult: number;
  eloDeltaPlayerOne: number;
  eloDeltaPlayerTwo: number;
  tournamentLink: string;
  wonBy: PlayerEnumI;
}

export let Match: ModelCtor<MatchI>;

export const registerMatchModels = async (sequelize: Sequelize) => {
  Match = sequelize.define<MatchI>("Match", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: new DataTypes.UUIDV4(),
    },
    entryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    playerOneResult: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    playerTwoResult: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tournamentLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eloDeltaPlayerOne: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    eloDeltaPlayerTwo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    wonBy: {
      type: DataTypes.ENUM("playerOne", "playerTwo"),
      allowNull: false,
    },
  });

  Match.belongsTo(PlayerEnrollment, {
    foreignKey: {
      name: "playerOneId",
    },
  });

  Match.belongsTo(PlayerEnrollment, {
    foreignKey: {
      name: "playerTwoId",
    },
  });
};
