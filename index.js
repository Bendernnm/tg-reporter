const fs = require('fs');

const Reporter = require('./reporter');
const { eachLimitWithDuration } = require('./utils');
const {
  PHONE,
  MESSAGE,
  REPORT_SLEEP,
  REPORT_ITEMS_LIMIT,
} = require('./config');

(async () => {
  let reporter;
  let use2FA = false;

  try {
    reporter = new Reporter(PHONE);

    try {
      await reporter.auth();
    } catch (err) {
      // some unexpected error
      if (err.message !== 'Account has 2FA enabled.') {
        throw err;
      }

      use2FA = true;
    }

    if (use2FA) {
      console.log('Use 2FA for your account');

      await reporter.auth2FA();
    }

    const peersFile = await fs.promises.readFile('./peers.txt');

    const peers = peersFile.toString().split('\n');

    peers.pop();

    await eachLimitWithDuration(peers, REPORT_ITEMS_LIMIT, REPORT_SLEEP,
        async (peer) => {
          try {
            await reporter.reportPeer(peer, MESSAGE);
          } catch (err) {
            console.error(err);
          }
        });
  } catch (err) {
    console.error(err);
  } finally {
    await reporter.disconnect();

    process.exit(0);
  }
})();
