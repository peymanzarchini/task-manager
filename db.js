import fs from "fs";
import chalk from "chalk";

const warn = chalk.yellowBright.bold;
const success = chalk.greenBright.bold;

export default class DB {
  static createDB() {
    if (fs.existsSync("db.json")) {
      console.log(warn("DB already exists"));
      return false;
    }
    try {
      fs.writeFileSync("db.json", "[]", "utf-8");
      console.log(success("DB file created"));
      return true;
    } catch (err) {
      throw new Error("Can't create DB");
    }
  }

  static resetDB() {
    try {
      fs.writeFileSync("db.json", "[]", "utf-8");
      console.log(success("DB file reset"));
    } catch (err) {
      throw new Error("Can't reset DB");
    }
  }

  static existsDB() {
    if (fs.existsSync("db.json")) {
      return true;
    } else {
      return false;
    }
  }

  static getTaskById(id) {
    let data;
    if (DB.existsDB()) {
      data = fs.readFileSync("db.json", "utf-8");
    } else {
      DB.createDB();
      return false;
    }

    try {
      data = JSON.parse(data);
      const task = data.find((task) => task.id === Number(id));
      return task ? task : false;
    } catch (err) {
      throw new Error("Can't get task by id");
    }
  }

  static getTaskByTitle(title) {
    let data;
    if (DB.existsDB) {
      data = fs.readFileSync("db.json", "utf-8");
    } else {
      DB.createDB();
      return false;
    }

    try {
      data = JSON.parse(data);
      const task = data.find((task) => task.title === title);
      return task ? task : false;
    } catch (err) {
      throw new Error("Can't get task by title");
    }
  }

  static getAllTasks() {
    let data;
    if (DB.existsDB) {
      data = fs.readFileSync("db.json", "utf-8");
    } else {
      DB.createDB();
      return false;
    }

    try {
      data = JSON.parse(data);
      return data;
    } catch (err) {
      throw new Error("Can't get all tasks");
    }
  }
}
