
import chalk from "chalk";
const dim = chalk.dim;
/**
 * Welcome.
 *
 * @param String heading Heading text.
 * @param String subHeading Sub heading text.
 * @param Object options Configurable options.
 */
export default (options: any) => {
  // Options.
  const defaultOptions = {
    title: `smartmake🔥`,
    tagLine: `by Djemai Samy`,
    description: ["A flexible app generator"],
    version: "0.0.1",
    bgColor: '#36BB09',
    color: '#000000',
    bold: true,
  };
  const opts = { ...defaultOptions, ...options };
  const {
    title,
    tagLine,
    description,
    bgColor,
    color,
    bold,
    version
  } = opts;

  // Configure.
  const bg = bold
    ? chalk.hex(bgColor).inverse.bold
    : chalk.hex(bgColor).inverse;
  const clr = bold ? chalk.hex(color).bold : chalk.hex(color);
  console.log();
  // Do it.
  console.log(
    `${clr(`${bg(` ${title} `)}`)} ${version} ${dim(tagLine)}\n\n${
      
        description.length ? description?.join('\n\n'): description
    
    }`
  );
  console.log(`${chalk.bgBlack.hex(bgColor).underline('                                    ')}`)
  console.log();
};