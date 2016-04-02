# Mnemonic major system encoder

Uses the [mnemonic major system](https://en.wikipedia.org/wiki/Mnemonic_major_system) (with a _slightly_ different encoding) to search a list of [english words](https://github.com/dwyl/english-words) for matches.

## Usage

Inputs: number to be encoded, comma-delimited list of chunk lengths e.g. for a number `5` digits long, the chunking could be `3,2`.

To run: `node index.js arg x,y,z`
**arg** must be a number
**x**+**y**+**z** must be the length of **arg**
e.g. `node index.js 01234567890 3,2,5`

There is a default setting for when chunking is unspecified.

Word matching is done by sequentially searching through the entire word list, checking if the consonants required are in the correct order, and that no other consonants are contained in the word being checked.

The mnemonic major system is intended to be used for human memorisation of large numbers and  works best when the words returned are easily visualised so a sequence of images can be constructed easy memorisation and recall. Doing this programmatically is quite far into the realm of machine learning so I'm not going to attempt it here. 

## Dependencies

* **Node.js >= v5.x.x** for ES6 features
* **lodash**

## Things to do
* Automate chunking 
* Optimise search
* Host online 