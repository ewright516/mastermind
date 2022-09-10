import inquirer from "inquirer";
import chalk from "chalk";

const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
let code = [];
let guessHistory = [];
let currentGuess = [];

const setCode = () => {
  // Code is 4 colors long
  for (let i = 0; code.length < 4; i++) {
    let randomNumber = Math.floor(Math.random() * 6);

    // the code cannot have 3 or more of the same color
    // this allows 2 of the same color
    if (!isDuplicate(code, colors[randomNumber])) {
      code.push(colors[randomNumber]);
    }
  }
};

const isDuplicate = (arr, ele) => {
  const firstIndex = arr.indexOf(ele);

  if (firstIndex === -1) {
    return false;
  } else {
    const secondIndex = arr.indexOf(ele, firstIndex + 1);
    if (secondIndex !== -1) {
      return true;
    } else {
      return false;
    }
  }
};

const guessColor = async (pos) => {
  const choices = colors.filter((color) => !isDuplicate(currentGuess, color));
  const guess = await inquirer.prompt({
    name: "color_guess",
    type: "list",
    message: `Color No. ${pos}:`,
    choices: colors,
  });

  return guess.color_guess;
};

const guessCode = (colors) => {
  let correctGuess = scoreGuess(colors)[1];
  guessHistory.push(colors);
  currentGuess = [];
  console.clear();
  guessHistory.forEach((guess, index) => {
    console.log(`Guess No. ${index + 1}: `, scoreGuess(guess)[0]);
  });
  return correctGuess;
};

const scoreGuess = (guess) => {
  let scoredGuess = "";
  let matched = 0;
  let correctGuess = false;
  guess.forEach((color, index) => {
    if (color === code[index]) {
      scoredGuess = scoredGuess.concat(`${chalk.green(color)}`, ", ");
      matched++;
    } else if (code.includes(color)) {
      scoredGuess = scoredGuess.concat(`${chalk.yellow(color)}`, ", ");
    } else {
      scoredGuess = scoredGuess.concat(`${chalk.gray(color)}`, ", ");
    }
  });
  if (matched === 4) correctGuess = true;
  return [scoredGuess, correctGuess];
};

const welcome = async () => {
  console.clear();
  console.log(`
    Welcome to ${chalk.bold(
      "Mastermind"
    )}! The computer has picked a random code of 4 colors.
    The choices are RED, ORANGE, YELLOW, GREEN, BLUE, and PURPLE
    A color can appear no more than twice in a code.
    Try to guess the code! A ${chalk.green(
      "green"
    )} color means that is the right color in the right spot.
    A ${chalk.yellow(
      "yellow"
    )} color means that the code contains that color in a different spot.
  `);
  const start = await inquirer.prompt({
    name: "start",
    type: "confirm",
    message: "Would you like to start the game?",
  });
  return start;
};

const winner = () => {
  console.log(`
    ${chalk.blue("Congratulations player!")} You've won in ${
    guessHistory.length
  } guesses!
  `);
};

const main = async () => {
  setCode();
  console.clear();
  const start = await welcome();
  if (!start.start) process.exit(0);
  console.clear();
  let playerWin = false;
  while (!playerWin) {
    currentGuess.push(await guessColor(1));
    currentGuess.push(await guessColor(2));
    currentGuess.push(await guessColor(3));
    currentGuess.push(await guessColor(4));

    if (guessCode(currentGuess)) {
      playerWin = true;
      winner();
    }
  }
};

main();
