require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const Todolist = require("./models/todolist");
const TodolistItem = require("./models/todolistitem");
const db = require("./models/index"); //bcos of no assoc is found, we need to use the Associate() that is called in models/todolists and /todolistitem so we need to import from index

const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3000;
// const mysqlURI = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASS}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DB}`;
// const sequelize = new Sequelize(mysqlURI);

const TodolistModel = Todolist(db.sequelize, DataTypes);
const TodolistItemModel = TodolistItem(db.sequelize, DataTypes);

app.get("/api/v1/todolist/:todolistID", async (req, res) => {
  // find todolist with associated todolist items
  let todolist = null;
  try {
    todolist = await db.Todolist.findOne({
      where: {
        id: req.params.todolistID,
      },
      include: db.TodolistItem,
    });
    // # what if we do function above in Mysql
    // SELECT * from todolists LEFT JOIN todolist_items ON todolists_items.todolist_id WHERE todolist.id = req.params.todolistID
  } catch (err) {
    res.statusCode = 500;
    return res.json();
  }

  if (!todolist) {
    res.statusCode = 404;
    return res.json();
  }
  return res.json(todolist);
});

app.get("/api/v1/todolist", (req, res) => {
  // this will return a promise - need to do async await
  const todolist = db.Todolist.findAll()
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
  const todolist = new db.Todolist();
  todolist.title = title;

  //   this is to save = persist to database
  todolist.save();

  console.log(todolist);
  return res.json({});
});

// how to post 1 todolist-item inside todolist
app.post("/api/v1/todolist/:todolistID/items", async (req, res) => {
  //   get the todolist from model
  let todolist = null;
  try {
    todolist = await db.Todolist.findOne({
      where: {
        id: req.params.todolistID,
      },
    });
  } catch (err) {
    res.statusCode = 500;
    return res.json();
  }

  //   if not exist, return not found
  if (!todolist) {
    res.statusCode = 404;
    return res.json();
  }

  //   create the todolist item
  const item = new db.TodolistItem();
  item.todolist_id = todolist.id;
  item.title = req.body.title;
  if (req.body.description) {
    item.description = req.body.description;
  }

  //   persists to db
  item.save();

  return res.json();
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
