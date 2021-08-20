"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TodolistItem extends Model {
    static associate(models) {}
  }
  TodolistItem.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT.UNSIGNED,
      },
      todolist_id: {
        allowNull: false,
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: "todolists", //entity or table that we want to connect with
          key: "id", // columns that we want to migrate to
        },
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING,
        allowNul: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
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
      modelName: "TodolistItem",
    }
  );
  return TodolistItem;
};
