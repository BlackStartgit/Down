import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { format } from 'date-fns';
import { DiaryManager } from './diaryManager.js';

const diary = new DiaryManager();

program
  .version('1.0.0')
  .description('Command-line diary application');

program
  .command('add')
  .description('Add a new diary entry')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter entry title:',
        validate: input => input.length > 0
      },
      {
        type: 'editor',
        name: 'content',
        message: 'Enter your diary entry:',
        validate: input => input.length > 0
      }
    ]);

    const entry = {
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      title: answers.title,
      content: answers.content
    };

    diary.addEntry(entry);
    console.log(chalk.green('Entry added successfully!'));
  });

program
  .command('list')
  .description('List all diary entries')
  .action(() => {
    const entries = diary.getEntries();
    if (entries.length === 0) {
      console.log(chalk.yellow('No entries found.'));
      return;
    }

    entries.forEach((entry, index) => {
      console.log(chalk.blue(`\n--- Entry ${index + 1} ---`));
      console.log(chalk.cyan('Date:'), entry.date);
      console.log(chalk.cyan('Title:'), entry.title);
      console.log(chalk.cyan('Content:'), entry.content);
    });
  });

program
  .command('delete')
  .description('Delete a diary entry')
  .action(async () => {
    const entries = diary.getEntries();
    if (entries.length === 0) {
      console.log(chalk.yellow('No entries to delete.'));
      return;
    }

    const choices = entries.map((entry, index) => ({
      name: `${entry.date} - ${entry.title}`,
      value: index
    }));

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'index',
        message: 'Select entry to delete:',
        choices
      }
    ]);

    diary.deleteEntry(answer.index);
    console.log(chalk.green('Entry deleted successfully!'));
  });

program.parse(process.argv);