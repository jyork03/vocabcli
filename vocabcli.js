#!/usr/bin/env node
"use strict";

const program = require('commander');
const utils = require('./utils.js');

program
.version(require('./package.json').version)
.usage('commands options <keywords>')
.option('-l, --learn [subject]', 'Set the subject you wish to learn')
.option('-a, --add [create]', 'Add a new entry')
.option('-d, --delete [delete]', 'Remove an entry')
.option('-e, --edit [edit]', 'Edit an entry')
.option('-q, --query [search]', 'Search for an entry by term or definition')
.option('-s, --subjects', 'List all subjects')
.option('-c, --count', 'Display number of entries in subject')

program
.command('quiz')
.description('Test your knowledge')
.option('-r, --reverse', 'Reverse order. Ask for the definition, and answer with the term')
.option('-f, --fullScreen', 'Run the quiz in full screen mode')
.action((options) => {
	//Start Quiz
	utils.getEntries((entries) => {
		utils.quiz({"reverse": options.reverse, "fullScreen": options.fullScreen}, entries);
	});
});

program
.command('review')
.description('Study your subject')
.option('-r, --reverse', 'Reverse order. Ask for the definition, and answer with the term')
.option('-f, --fullScreen', 'Run the quiz in full screen mode')
.action((options) => {
	//Start Reviewing
	utils.getEntries((entries) => {
		utils.review({"reverse": options.reverse, "fullScreen": options.fullScreen}, entries);
	});
});

program.parse(process.argv);

if(program.learn) {
	utils.learn(program.learn);
}

if(program.add) {
	utils.getEntries((entries) => {
		utils.addEntry(program.add, entries);
	}, true);
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

if(program.count) {
	utils.getEntries((entries) => {
		console.log(entries.length);
	});
}
