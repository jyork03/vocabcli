#!/usr/bin/env node

const program = require('commander');
const utils = require('./utils.js');

program
.version('1.0.0')
.usage('options')
.option('-r, --reverse', 'Reverse order. Ask for the definition, and answer with the term')
.option('-f, --fullScreen', 'Run the quiz in full screen mode')
.parse(process.argv);


//Start Review
utils.getEntries((entries) => {
	utils.review({"reverse": program.reverse, "fullScreen": program.fullScreen}, entries);
});