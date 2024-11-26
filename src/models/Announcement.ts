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

export interface AnnouncementI
  extends Model<
    InferAttributes<AnnouncementI>,
    InferCreationAttributes<AnnouncementI>
  > {
  id: CreationOptional<string>;
  description: string;
  isPublished: Date;
  datePublished: Date;
}
export let Announcement: ModelCtor<AnnouncementI>;

export const registerAnnouncementModels = async (sequelize: Sequelize) => {
  Announcement = sequelize.define<AnnouncementI>("Announcement", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: new DataTypes.UUIDV4(),
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPublished: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    datePublished: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Announcement.belongsTo(League);
};
