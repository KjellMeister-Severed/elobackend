import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelCtor,
  Sequelize,
} from "sequelize";

export interface LeagueI
  extends Model<InferAttributes<LeagueI>, InferCreationAttributes<LeagueI>> {
  id: CreationOptional<string>;
  leagueName: string;
  leagueDeadline: Date;
  isPrivate: boolean;
  password?: CreationOptional<string>;
}

export interface LeagueSettingsI
  extends Model<
    InferAttributes<LeagueSettingsI>,
    InferCreationAttributes<LeagueSettingsI>
  > {
  id: CreationOptional<string>;
  entryRequiresMeleeGG: boolean;
  leagueLogo: string;
}

export let League: ModelCtor<LeagueI>;
export let LeagueSettings: ModelCtor<LeagueSettingsI>;

export const registerLeagueModels = async (sequelize: Sequelize) => {
  League = sequelize.define<LeagueI>("League", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: new DataTypes.UUIDV4(),
    },
    leagueName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leagueDeadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  LeagueSettings = sequelize.define<LeagueSettingsI>("LeagueSettings", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: new DataTypes.UUIDV4(),
    },
    entryRequiresMeleeGG: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    leagueLogo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  League.hasOne(LeagueSettings);
  LeagueSettings.belongsTo(League);
};
