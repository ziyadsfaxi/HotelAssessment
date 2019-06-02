/**
 * Returns true if the value passed is a safe and positive integer. 
 * @param {any} value 
 */
const isNumber = (value) => Number.isSafeInteger(value) && Math.sign(value) !== -1;

/**
 * Templete Tag to escape white spaces in template literals
 * @param {Array<string>} strings 
 * @param  {...any} values 
 */
const singleLineString = (strings, ...values) => {
    // Interweave the strings with the
    // substitution vars first.
    let output = '';
    for (let i = 0; i < values.length; i++) {
      output += strings[i] + values[i];
    }
    output += strings[values.length];
  
    // Split on newlines.
    let lines = output.split(/(?:\r\n|\n|\r)/);
  
    // Rip out the leading whitespace.
    return lines.map((line) => {
      return line.replace(/^\s+/gm, '');
    }).join(' ').trim();
};

module.exports = { isNumber, singleLineString };