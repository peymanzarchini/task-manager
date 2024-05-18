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
      return true;
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
      try {
        DB.createDB();
        return false;
      } catch (err) {
        throw new Error(err.message);
      }
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
      try {
        DB.createDB();
        return false;
      } catch (err) {
        throw new Error(err.message);
      }
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
      try {
        DB.createDB();
        return false;
      } catch (err) {
        throw new Error(err.message);
      }
    }

    try {
      data = JSON.parse(data);
      return data;
    } catch (err) {
      throw new Error("Can't get all tasks");
    }
  }

  static saveTask(title, completed = false, id = 0) {
    id = Number(id);
    if (id < 0 || id !== parseInt(id)) {
      throw new Error("id must be a positive integer");
    } else if (typeof title !== "string" || title.length < 3) {
      throw new Error("title must be a string of at least 3 characters");
    }

    const task = DB.getTaskByTitle(title);
    if (task && task.id != id) {
      throw new Error("Task already exists");
    }

    let data;

    if (DB.existsDB()) {
      data = fs.readFileSync("db.json", "utf-8");
    } else {
      try {
        DB.createDB();
        return false;
      } catch (err) {
        throw new Error(err.message);
      }
    }

    try {
      data = JSON.parse(data);
    } catch (err) {
      throw new Error("Can't parse DB");
    }

    if (id === 0) {
      if (data.length === 0) {
        id = 1;
      } else {
        id = data[data.length - 1].id + 1;
      }

      data.push({
        id,
        title,
        completed,
      });

      const jsonData = JSON.stringify(data);
      try {
        fs.writeFileSync("db.json", jsonData, "utf-8");
        return true;
      } catch (err) {
        throw new Error("Can't save task");
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          data[i].title = title;
          data[i].completed = completed;

          const jsonData = JSON.stringify(data);
          try {
            fs.writeFileSync("db.json", jsonData, "utf-8");
            return id;
          } catch (err) {
            throw new Error("Can't save task");
          }
        }
      }
      throw new Error("Task not found");
    }
  }

  static deleteTask(id) {
    id = Number(id);
    if (id > 0 && id === parseInt(id)) {
      let data;
      try {
        data = fs.readFileSync("db.json", "utf-8");
        data = JSON.parse(data);
      } catch (err) {
        throw new Error("Can't read DB file");
      }

      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          data.splice(i, 1);
          data = JSON.stringify(data);

          try {
            fs.writeFileSync("db.json", data, "utf-8");
            return id;
          } catch (err) {
            throw new Error("Can't delete task");
          }
        }
      }

      return false;
    } else {
      throw new Error("id must be a positive integer");
    }
  }
}
