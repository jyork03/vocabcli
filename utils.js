"use strict";

const prompt = require('prompt');
const fs = require('fs');

const dataDir = (process.env.HOME || process.env.USERPROFILE) + '/.vocabcli';
const configFile = dataDir + '/conf.json';
const config = getConfig(dataDir, configFile);

function learn(subject) {
	if(typeof subject === "string") {
		let newConfig = config;
		subject = subject.toLowerCase();
		newConfig.subject = subject;

		if(newConfig.subjects && newConfig.subjects.constructor === Array) {
			if(newConfig.subjects.indexOf(subject) == -1)
			newConfig.subjects.push(subject);
		} else {
			newConfig.subjects = [subject];
		}

		fs.writeFile(configFile, JSON.stringify(newConfig), (err) => { 
			if(err) throw err;
			console.log("Learning subject: " + subject);
			process.exit(0);
		});
	} else {
		console.error("You must supply a subject to learn");
		process.exit(1);
	}
}

function addEntry(term, entries) {
	let entry = {
		term: term
	};
	startPrompt(['definition', 'description'], '', false, (results) => {
		entry.definition = results.definition;
		entry.description = results.description;
		entries.push(entry);
		setEntries(entries, () => {
			console.log("Added entry: " + term);
		});
	});
}

function deleteEntry(term, entries, ignore) {
	ignore = typeof ignore === "undefined" ? [] : ignore;
	let index = entries.findIndex((entry, i) => {
		if(ignore.indexOf(i) >= 0) return false;
		return entry.term === term;
	});

	let entry = entries[index];
	if(index >= 0 && typeof entry !== "undefined") {
		console.log("You are about to delete:");
		console.log("term: ", entry.term);
		console.log("definition: ", entry.definition);
		console.log("description: ", entry.description);
	} else {
		console.log("Couldn't find a matching entry.");
		process.exit(0);
	}
	promptYesNo('delete', () => {
		// delete entry
		entries.splice(index, 1);
		setEntries(entries, () => {
			console.log("Removed entry: " + term);
			deleteEntry(term, entries, ignore);
		});
	}, () => {
		// skip this entry
		ignore.push(index); // make sure this index gets skipped
		console.log("Did not delete: " + term);
		deleteEntry(term, entries, ignore);
	});
}

function editEntry(term, entries, ignore) {
	ignore = typeof ignore === "undefined" ? [] : ignore;
	let index = entries.findIndex((entry, i) => {
		if(ignore.indexOf(i) >= 0) return false;
		return entry.term === term;
	});

	let entry = entries[index];
	if(index >= 0 && typeof entry !== "undefined") {
		console.log("You are about to edit:");
		console.log("term: ", entry.term);
		console.log("definition: ", entry.definition);
		console.log("description: ", entry.description);
	} else {
		console.log("Couldn't find a matching entry.");
		process.exit(0);
	}
	promptYesNo('edit', () => {
		// edit entry
		startPrompt(['terms', 'definition', 'description'], '', false, (results) => {
			entry.term = results.term;
			entry.definition = results.definition;
			entry.description = results.description;
			setEntries(entries, () => {
				console.log("Edited entry: " + term);
				editEntry(term, entries, ignore);
			});
		});
	}, () => {
		ignore.push(index); // make sure this index gets skipped
		console.log("Did not edit: " + term);
		editEntry(term, entries, ignore);
	});
}

function queryEntry(term, entries, ignore) {
	ignore = typeof ignore === "undefined" ? [] : ignore;
	let index = entries.findIndex((entry, i) => {
		if(ignore.indexOf(i) >= 0) return false;
		return entry.term === term;
	});

	let entry = entries[index];
	if(index >= 0 && typeof entry !== "undefined") {
		console.log("term: ", entry.term);
		console.log("definition: ", entry.definition);
		console.log("description: ", entry.description);
	} else {
		console.log("Couldn't find a matching entry.");
		process.exit(0);
	}
	promptYesNo('continue', () => {
		ignore.push(index); // make sure this index gets skipped
		queryEntry(term, entries, ignore);
	}, () => {
		console.log("Ending search for term: " + term);
		process.exit(0);
	});
}

function quiz(opts, entries) {
	let randomEntry = entries[Math.round(Math.random() * (entries.length - 1))];
	let question = "term";
	let answer = "definition";

	if(opts.reverse) {
		question = "definition";
		answer = "term";
	}
	
	if(opts.fullScreen) {
		process.stdout.write("\x1B[2J");
	}

	console.log(question + ": " + randomEntry[question]);

	startPrompt(answer, '', false, (results) => {
		if(results[answer].toLowerCase() == randomEntry[answer].toLowerCase()) {
			// TODO maybe record some stats to know how well you did
			console.log('Correct!');
		} else {
			console.log('Wrong.');
		}
		console.log("	" + answer + ": " + randomEntry[answer]);;
		console.log("	description: " + randomEntry.description);
				
		promptYesNo('continue', () => {
			quiz(opts, entries);
		}, () => {
			console.log("Quiz session ended.");
			process.exit(0);
		});
	});
}

function review(opts, entries) {
	let randomEntry = entries[Math.round(Math.random() * (entries.length - 1))];
	let question = "term";
	let answer = "definition";

	if(opts.reverse) {
		question = "definition";
		answer = "term";
	}
	
	if(opts.fullScreen) {
		process.stdout.write("\x1B[2J");
	}

	console.log(question + ": " + randomEntry[question]);

	startPrompt('press enter', '', false, (results) => {
		console.log("	" + answer + ": " + randomEntry[answer]);;
		console.log("	description: " + randomEntry.description);
				
		promptYesNo('continue', () => {
			review(opts, entries);
		}, () => {
			console.log("Quiz session ended.");
			process.exit(0);
		});
	});
}

function startPrompt(prompts, message, colors, next) {
	prompt.start();
	prompt.message = message;
	prompt.colors = colors;
	prompt.get(prompts, (err, results) => {
		if(err) process.exit(1); //probably ctrl-c cancelled, so just exit quietly
		next(results);
	});
}

function promptYesNo(promptStr, yesCb, noCb) {
	startPrompt(promptStr, "('yes' or 'no')", false, (results) => {
		let response = results[promptStr].toLowerCase();
		if(response == "y" || response == "yes") {
			yesCb();
		} else {
			noCb();
			process.exit(0);
		}
	});
}

function setEntries(entries, next) {
	fs.writeFile(getEntryFilePath(), JSON.stringify(entries), (err) => {
		if(err) throw err;
		next();
		process.exit(0);
	});
}

function getEntries(next, proceedAnyway) {
	let entryFile = getEntryFilePath();
	try {
		fs.accessSync(entryFile, fs.F_OK);
	} catch (e) {
		fs.writeFileSync(entryFile, JSON.stringify([]));
	}
	fs.readFile(entryFile, 'utf8', (err, data) => {
		if(err) throw err;
		let entries = [];
		if(typeof data !== "undefined") {
			entries = JSON.parse(data);
		}
		if(entries.length === 0 && !proceedAnyway) {
			console.log("You currently do not have any entries for this subject.  Please add some with vocab --add <term>");
			process.exit(0);
		}
		next(entries);
	});
}

function getConfig(dataDir, configFile) {
	// Make sure the .vocabcli dir exists in the homepage
	try {
		fs.accessSync(dataDir, fs.F_OK);
	} catch (e) {
		fs.mkdirSync(dataDir);
	}

	// Make sure the config file exists in the .vocabcli dir
	try {
		fs.accessSync(configFile, fs.F_OK);
	} catch (e) {
		fs.writeFileSync(configFile, JSON.stringify({}));
	}

	try {
		return JSON.parse(fs.readFileSync(configFile, 'utf8'));
	} catch(e) {
		console.error(e);
		process.exit(1);
	}
}

function getSubjects() {
	for (let i = 0, l = config.subjects.length; i < l; i++) {
		console.log( config.subjects[i] );
	}
}

function getEntryFilePath() {
	try {
		if(!config.subject) throw("You must choose a subject.  --help for more info.");
		return dataDir + "/" + config.subject + '.json';
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
}

module.exports = { 
	learn: learn,
	getEntries: getEntries,
	addEntry: addEntry,
	editEntry: editEntry,
	deleteEntry: deleteEntry,
	queryEntry: queryEntry,
	quiz: quiz,
	review: review,
	getSubjects: getSubjects,
};
