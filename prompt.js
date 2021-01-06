// const inquirer = require('inquirer');

// (async () => {
//   const prompt = await inquirer.prompt([
//     {
//       name: 'personName',
//       type: 'input',
//       message: 'What is your name?',
//     },
//     {
//       name: 'personLastName',
//       type: 'input',
//       message: 'What is your last name?',
//     },
//   ]);
//   const fullName = `${prompt.personName} ${prompt.personLastName}`;
//   const confirmationPrompt = await inquirer.prompt([
//     {
//       name: 'isCorrect',
//       type: 'confirm',
//       message: `Is your full name ${fullName}?`,
//     },
//   ]);
//   if (confirmationPrompt.isCorrect) console.log(`Welcome ${fullName}`);
//   else console.log('Welcome anonymous user!');
// })();

// const rl = require('readline');
// const { promisify } = require('util');
// const readline = rl.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// // Prepare readline.question for promisification
// readline.question[promisify.custom] = (question) => {
//   return new Promise((resolve) => {
//     readline.question(question, resolve);
//   });
// };

// // Usage example:
// (async () => {
//   const answer = await promisify(readline.question)('What is your name? ');
//   readline.close();
//   console.log('Hi %s!', answer);
// })();


const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => {
      readline.question(query, resolve);
  })
}

async function main() {
  const name = await question('Whats your name? ');
  console.log(`Hello ${name}!`);
  readline.close();
}

main();