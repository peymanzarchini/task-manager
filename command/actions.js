import chalk from "chalk";
import inquirer from "inquirer";
import Task from "../tasks/taskController.js";
import DB from "../data/db.js";

const error = chalk.redBright.bold;
const warn = chalk.yellowBright.bold;
const success = chalk.greenBright.bold;

export default class Actions {
  static list() {
    const tasks = DB.getAllTasks();
    if (tasks.length) {
      console.table(tasks);
    } else {
      console.log(warn("There is not any task."));
    }
  }

  static async add() {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter task title",
        validate: (value) => {
          if (value.length < 3) {
            return "The title must contain at least 3 letters.";
          }
          return true;
        },
      },
      {
        type: "confirm",
        name: "completed",
        message: "Is this task completed?",
        default: false,
      },
    ]);

    try {
      const task = new Task(answers.title, answers.completed);
      task.save();
      console.log(success("New task saved successfully"));
    } catch (err) {
      console.log(error(err.message));
    }
  }

  static async delete() {
    const tasks = Task.getAllTasks();
    const choices = [];

    for (const task of tasks) {
      choices.push(task.title);
    }

    const answers = await inquirer.prompt({
      type: "list",
      name: "title",
      message: "Select a task to delete:",
      choices,
    });

    const task = Task.getTaskByTitle(answers.title);

    try {
      DB.deleteTask(task.id);
      console.log(success("Selected task deleted successfully"));
    } catch (err) {
      console.log(error(err.message));
    }
  }

  static async deleteAll() {
    const answer = await inquirer.prompt({
      type: "confirm",
      name: "result",
      message: "Are you sure want to delete all tasks?",
    });

    if (answer.result) {
      try {
        DB.resetDB();
        console.log(success("All tasks deleted successfully"));
      } catch (err) {
        console.log(error(err.message));
      }
    }
  }

  static async edit() {
    const tasks = Task.getAllTasks();
    const choices = [];

    for (const task of tasks) {
      choices.push(task.title);
    }

    const selectedTask = await inquirer.prompt({
      type: "list",
      name: "title",
      message: "Select a task to edit:",
      choices,
    });

    const task = Task.getTaskByTitle(selectedTask.title);

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter task title",
        validate: (value) => {
          if (value.length < 3) {
            return "The title must contain at least 3 letters.";
          }
          return true;
        },
        default: task.title,
      },
      {
        type: "confirm",
        name: "completed",
        message: "Is this task completed?",
        default: false,
      },
    ]);

    try {
      DB.saveTask(answers.title, answers.completed, task.id);
      console.log(success("Selected task edited successfully"));
    } catch (err) {
      console.log(error(err.message));
    }
  }
}
