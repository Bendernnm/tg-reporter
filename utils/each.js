module.exports = (items, fn) => Promise.all(items.map(item => fn(item)));
