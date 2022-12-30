import inquirer from "inquirer";

export const confirm = async (name:string, message:string, defaultValue: boolean) => {
  console.log()
  let resp = await inquirer.prompt([
    {
      type: 'confirm',
      name: name,
      message: message,
      default: defaultValue
    }
  ]);

  return resp[name]
}

export const choices = async ( name:string, message:string, listchoices: Array<string>) =>{
  console.log()
  const resp = await inquirer.prompt([
    {
      type: 'list',
      name: name,
      choices: listchoices,
      message: message
    }
  ]);

  return resp[name];
}

export const ask = async ( name:string, message:string, defaultValue: string) =>{
  console.log()
  const resp = await inquirer.prompt([
    {
      type: 'input',
      name: name,
      message: message,
      default:defaultValue
    }
  ]);

  return resp[name];
}