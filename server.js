require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const Todolist = require("./models/todolist");

const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3000;
const mysqlURI = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASS}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DB}`;
const sequelize = new Sequelize(mysqlURI);

const TodolistModel = Todolist(sequelize, DataTypes);

app.get("/api/v1/todolist", (req, res) => {
  // this will return a promise - need to do async await
  const todolist = TodolistModel.findAll()
    .then(resp => {
      return res.json(resp);
    })
    .catch(err => {
      res.statusCode = 500;
      return res.json();
    });
});

app.post("/api/v1/todolist", (req, res) => {
  console.log(req.body);

  const title = req.body.title;

  //   # Second Method
  //  create model object without persisting to database
  const todolist = new TodolistModel();
  todolist.title = title;

  //   this is to save = persist to database
  todolist.save();

  console.log(todolist);
  return res.json({});
});

app.listen(port, () => {
  console.log(`Todolist app listening at http://localhost:${port}`);
});

// // test connection with sequalize
// sequelize
//   .authenticate()
//   .then(resp => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch(error => {
//     console.error("Unable to connect to the database:", error);
//   });
