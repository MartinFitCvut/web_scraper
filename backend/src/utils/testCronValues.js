const parser = require('cron-parser');

async function TestCronValues(values){
    const times = [];
    try {
        const interval = parser.parseExpression(values);
        for (let i = 0; i < 8; i++) {
            times.push(interval.next().toString());
        }
        return times;
    } catch (err) {
        console.log('Error: ' + err.message);
    }
}

module.exports = {
    TestCronValues
}

