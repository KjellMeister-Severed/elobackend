import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelCtor,
  Sequelize,
} from "sequelize";
export interface PlatformSettingsI
  extends Model<
    InferAttributes<PlatformSettingsI>,
    InferCreationAttributes<PlatformSettingsI>
  > {
  id: CreationOptional<string>;
  showMaintenance: boolean;
  showTechnicalDifficulties: number;
  nextMaintenance: Date;
}

export let PlatformSettings: ModelCtor<PlatformSettingsI>;

export const registerPlatformSettingsModels = async (sequelize: Sequelize) => {
  PlatformSettings = sequelize.define<PlatformSettingsI>("PlatformSettings", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: new DataTypes.UUIDV4(),
    },
    showMaintenance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    showTechnicalDifficulties: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nextMaintenance: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};
