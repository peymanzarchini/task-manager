console.clear();

import chalk from "chalk";
import Actions from "./command/actions.js";

const command = process.argv[2];
const commands = ["list", "add", "delete", "delete-all", "edit"];

const error = chalk.redBright.bold;
const warn = chalk.yellowBright.bold;

if (command) {
  if (command === "list") {
    Actions.list();
  } else if (command === "add") {
    Actions.add();
  } else if (command === "delete") {
    Actions.delete();
  } else if (command === "delete-all") {
    Actions.deleteAll();
  } else if (command === "edit") {
    Actions.edit();
  } else {
    const message = `${error("Unknown command.")}
    Available command are:
    ${warn(commands.join("\n"))}
    `;
    console.log(message);
  }
} else {
  const message = `${error("You must enter a command.")}
    Available command are:
    ${warn(commands.join("\n"))}
    `;
  console.log(message);
}
