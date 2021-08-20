"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todolist extends Model {
    static associate(models) {
      this.hasMany(models.TodolistItem);
    }
  }

  Todolist.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      // currently type is different with john
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Todolist",
      underscored: true, // to set a snakecase
      timestamps: false, // to delete duplicate created_at
    }
  );
  return Todolist;
};
