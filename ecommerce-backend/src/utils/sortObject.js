const sortObject = (obj) => {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (let key of keys) {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    }
    return sorted;
};

module.exports = {
    sortObject
}