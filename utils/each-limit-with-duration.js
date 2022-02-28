const each = require('./each');
const timer = require('./timer');

module.exports = async (items, limit, duration, fn) => {
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);

    await each(chunk, fn);

    await timer(duration);
  }
};
