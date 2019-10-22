
function Abstract() { }
module.exports = Abstract;

Abstract.prototype.log = {
    error: function(title, err){
        console.error(title, err);
        console.trace();
    },
    warn: function(title, warn){
        console.warn(title, warn);
    },
    msg: function(msg){
        console.log(msg);
    }
}


/**
 * Make string as CamelCase
 * @param str
 * @returns string
 */
Abstract.prototype.toCamelCase = function(str, isFirstLowerCase) {
    return str.replace(/_|-/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        return isFirstLowerCase && !index ? word : word.toUpperCase();
    }).replace(/\s+/g, '');
}


/**
 * Make object fields to CamelCase
 * @param object | array
 * @returns object | array
 */
Abstract.prototype.objectToCamelCase = function(obj) {
    let toReturn;
    if (Array.isArray(obj)) {
        toReturn = [];
        for (let i in obj) {
            toReturn.push( this.objectToCamelCase(obj[i]) );
        }
    } else if(typeof obj === 'object' && obj !== null) {
        toReturn = {};
        for (let field in obj) {
            toReturn[this.toCamelCase(field, true)] = this.objectToCamelCase(obj[field]);
        }
    } else {
        toReturn = obj;
    }
    return toReturn;
}

















