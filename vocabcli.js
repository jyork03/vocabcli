#!/usr/bin/env node

const program = require('commander');
const utils = require('./utils.js');

program
.version('1.0.0')
.usage('commands options <keywords>')
.option('-l, --learn [subject]', 'Set the subject you wish to learn')
.option('-a, --add [create]', 'Add a new entry')
.option('-d, --delete [delete]', 'Remove an entry')
.option('-e, --edit [edit]', 'Edit an entry')
.option('-q, --query [search]', 'Search for an entry by term or definition')
.option('-s, --subjects', 'List all subjects')
.command('review', 'Study your subject')
.command('quiz', 'Test your knowledge')
.parse(process.argv);

if(program.learn) {
	utils.learn(program.learn);
}

if(program.add) {
	utils.getEntries((entries) => {
		utils.addEntry(program.add, entries);
	});
}

if(program.delete) {
	utils.getEntries((entries) => {
		utils.deleteEntry(program.delete, entries);
	});
}

if(program.edit) {
	utils.getEntries((entries) => {
		utils.editEntry(program.edit, entries);
	});
}

if(program.query) {
	utils.getEntries((entries) => {
		utils.queryEntry(program.query, entries);
	});
}

if(program.subjects) {
	utils.getSubjects();
}
