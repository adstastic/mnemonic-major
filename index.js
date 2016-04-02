'use strict'
const _ = require('lodash');
const fs = require('fs');
const num = (() => { 
    if (process.argv[2]) {
        return process.argv[2];
    } else {
        console.log('No input provided!');
        process.exit(1);
    }
})();

let chunkList = (() => { 
    if (process.argv[3]) {
        return process.argv[3].split(',');
    } else {
        console.log('No chunk length provided, using default.');
        return [];
    }
})();

const dict = JSON.parse(fs.readFileSync('encoding.json', 'utf8'));

String.prototype.hasOne = function(char) {
    var first = this.indexOf(char);
    var last = this.lastIndexOf(char);
    return (first !== -1 && first === last) ? first : -1;
};

String.prototype.contains = function(re) {
    return this.search(re) !== -1;
}

var P_readFile = new Promise((resolve, reject) => {
    fs.readFile('words.txt', (err, data) => {
        if (data) resolve(data.toString().split('\n'));
        if (err) reject(err);
    });
});

console.time('exec');
P_readFile.then((word_list) => { 
    _.each(simplify(num), (input) => {
        let combs = combinations(input);
        console.log(input)
        _.each(combs, (str) => {
            let words = filterWords(word_list, str);
            if (words.length > 0) {
                console.log('  ' + str.toUpperCase() + ' : ' + words.join(', '));
            } else {
                // console.log('  ' + str.toUpperCase() + ': 0')
            }
        });
    });
})
.catch((err) => {
    console.log(err.toString());
});
console.timeEnd('exec');

function simplify(input) {
    let chunks = [];
    if (chunkList.length === 0) {
        switch (true) {
            case input.length > 4:
                chunks = input.match(/.{1,3}/g);
                break;
            case input.length === 4:
                chunks = input.match(/.{1,2}/g);
                chunks.push(input);
                break;
            default:
                chunks.push(input);
                break;
        }
    } else {
        let re = "";
        let c = _.map(chunkList, (chunk) => {
                    return parseInt(chunk);
                });
        c = _.map(c, (chunk, i) => {
                return _.sum(_.slice(c, 0, i));
            });
        c.push(input.length);
        _.each(c, (chunk, i) => {
            if (i !== 0) {
                chunks.push(input.slice(c[i-1], c[i]));
            }
        });
    }
    return chunks;
}

function combinations(input) {
    let all = [];
    _.each(input, (char) => {
        let c = dict[char];
        if (all.length > 0) {
            let r1 = _.flatten(all.slice());
            let r2 = _.flatten(all.slice());
            _.each(r1, (el) => {
                el += c[0];
                all.push(el);
            });
            _.each(r2, (el) => {
                el += c[1];
                all.push(el);
            });
        } else {
            all.push(c);
        }
        // console.log(all);
    });
    return _.remove(all, (el) => { return el.length == input.length && typeof(el) === 'string'; });
}
    
function filterWords(words, expr) {
    let consonants = 'qwrtypsdfghjklzxcvbnm';
    consonants = consonants.replace(regexOR(expr), '');
    let filtered = _.filter(words, (word) => {
        let index = -1;
        let ret = true;
        _.each(expr, (char) => {
            let current = word.hasOne(char);
            if (current > index) {
                index = current;
            } else {
                ret = false;
            }
        });
        return ret && !word.contains(regexOR(consonants));
    });
    
    return filtered;
};

function regexOR(s) {
    return new RegExp('(' + s.split('').join('|') + ')+', 'igm');
}

function divrem(num, div) { 
    if (num/div % 1 !== 0) { 
        return [Math.floor(num/div), num % div] 
    } else return [num/div]; 
}
