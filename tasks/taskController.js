import util from "util";

import chalk from "chalk";
import DB from "../data/db.js";

export default class Task {
  #id = 0;
  #title;
  #completed;
  constructor(title, completed = false) {
    this.title = title;
    this.completed = completed;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get completed() {
    return this.#completed;
  }

  set title(value) {
    if (typeof value !== "string" || value.length < 3) {
      throw new Error("title must be a string of at least 3 characters");
    }
    this.#title = value;
  }

  set completed(value) {
    if (typeof value !== "boolean") {
      throw new Error("completed must be a boolean");
    }
    this.#completed = value;
  }

  [util.inspect.custom]() {
    return `Task {
        id: ${chalk.yellowBright(this.id)}
        title: ${chalk.green('"' + this.title + '"')}
        completed: ${chalk.blue(this.completed)}
    }`;
  }

  save() {
    try {
      const id = DB.saveTask(this.#title, this.#completed, this.#id);
      this.#id = id;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static getTaskById(id) {
    const task = DB.getTaskById(id);
    if (task) {
      const item = new Task(task.title, task.completed);
      item.#id = id;
      return item;
    } else {
      return false;
    }
  }

  static getTaskByTitle(title) {
    const task = DB.getTaskByTitle(title);
    if (task) {
      const item = new Task(task.title, task.completed);
      item.#id = task.id;
      return item;
    } else {
      return false;
    }
  }

  static getAllTasks() {
    const tasks = DB.getAllTasks();
    const items = [];
    for (const task of tasks) {
      const item = new Task(task.title, task.completed);
      item.#id = task.id;
      items.push(item);
    }
    return items;
  }
}
