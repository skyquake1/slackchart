
const cron = require('node-cron');
const fs = require('fs');
const moment = require('moment');
const Abstract = require('../Abstract');
GarbageCollector.prototype = new Abstract();

const ignore = {
    '.gitignore': true,
};

/**
 * clearing the old images
 *
 * @constructor
 */

function GarbageCollector()
{
    function clearImages(){
        const date = moment().subtract(14, 'day').valueOf();
        fs.readdirSync(process.env.HTTP_STATIC_PATH).forEach(file => {
            if (!ignore[file]) {
                const filePath = process.env.HTTP_STATIC_PATH + file;
                fs.stat(filePath, function(err, stat){
                    if(date > stat.birthtimeMs) {
                        fs.unlinkSync(filePath);
                    }
                })
            }
        });
    }

    this.init = function(){
        cron.schedule(process.env.GARBAGE_COLLECTOR_SCHEDULE, clearImages);
    }
}

module.exports = GarbageCollector;

