const NodeCache = require("node-cache");
//const myCache = new NodeCache({ stdTTL: 180, checkperiod: 300 });
const myCache = new NodeCache();
function setCache(key, value, ttl) {
    myCache.set(key, value, ttl);
}

function getCache(key) {
    return myCache.get(key);
}

function delCache(key) {
    myCache.del(key);
}

function hasCache(key) {
    return myCache.has(key);
}

module.exports = {
    setCache,
    getCache,
    delCache,
    hasCache
};