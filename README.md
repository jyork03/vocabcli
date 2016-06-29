#Vocabcli
## Motivation
I wanted a no nonsense tool to help memorize whatever I wanted to learn.  I've always like flashcards, especially for studying languages, but didn't like the hassle of making them or carrying them around.  I also typically prefer the simplicity of the command line over GUIs.

## Installation

```bashp
npm install -g vocabcli
```

## Usage
To start or switch to a subject:
```bashp
vocab --learn <subject>
```

To add/delete/edit/search a term/definition
```bashp
vocab --add <term>
vocab --delete <term>
vocab --edit <term>
vocab --query <term>
```

To list all available subjects
```bashp
vocab --subjects
```

To review your entries
```bashp
vocab review
vocab review --reverse --fullScreen
```

To quiz yourself
```bashp
vocab quiz
vocab quiz --reverse --fullScreen
```
The --reverse option switches to show the 'definition' first, as opposed to the default of 'term' first, while the --fullScreen option will clear the terminal with each new entry is presented.

##TODO
* Add tags as a way to make subgroups within subjects
* Add spaced repition
* Improve logging messages with color/font styles/spacing
