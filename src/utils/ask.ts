import inquirer from "inquirer";

export const confirm = async (message:string, defaultValue: boolean) => {
  console.log()
  let resp = await inquirer.prompt([
    {
      type: 'confirm',
      name: "confirm",
      message: message,
      default: defaultValue
    }
  ]);

  return resp.confirm
}

export const checkbox = async (message:string, listchoices: Array<string>) =>{
  console.log()
  const resp = await inquirer.prompt([
    {
      type: 'checkbox',
      name: "list",
      choices: listchoices,
      message: message
    }
  ]);

  return resp.list;
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

export const list = async(message: string, choices:string[]) => {
  const resp = await inquirer.prompt([
    {
      type:"list",
      name:"choices",
      choices,
      message
    }
  ])

  return resp.choices;
}