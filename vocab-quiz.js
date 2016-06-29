#!/usr/bin/env node
"use strict";

const program = require('commander');
const utils = require('./utils.js');

program
.version(require('./package.json').version)
.usage('options')
.option('-r, --reverse', 'Reverse order. Ask for the definition, and answer with the term')
.option('-f, --fullScreen', 'Run the quiz in full screen mode')
.parse(process.argv);


//Start Quiz
utils.getEntries((entries) => {
	utils.quiz({"reverse": program.reverse, "fullScreen": program.fullScreen}, entries);
});
