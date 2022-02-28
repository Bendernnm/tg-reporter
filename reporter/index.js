const input = require('input');
const { TelegramClient, Api } = require('telegram');
const { StringSession } = require('telegram/sessions');

const { API_ID, API_HASH } = require('../config');

class Index {
  constructor(phoneNumber) {
    this.phoneNumber = phoneNumber;
    this.stringSession = new StringSession('');

    this.client = new TelegramClient(
        this.stringSession,
        API_ID,
        API_HASH,
        { connectionRetries: 5 },
    );
  }

  async auth() {
    await this.client.start({
      phoneNumber: this.phoneNumber,
      phoneCode  : async () => input.text(
          'Please enter the code you received: '),
    });
  }

  async auth2FA() {
    await this.client.start({
      phoneNumber: this.phoneNumber,
      password   : async () => input.text('Please enter your password: '),
      phoneCode  : async () => input.text(
          'Please enter the code you received: '),
    });
  }

  async reportPeer(peer, message) {
    const peerId = await this.client.getPeerId(peer);

    await this.client.invoke(new Api.account.ReportPeer({
      message,
      peer  : peerId,
      reason: new Api.InputReportReasonOther(),
    }));

    console.log(`Peer was reported: ${peer} (${peerId})`);
  }

  disconnect() {
    return this.client.disconnect();
  }
}

module.exports = Index;
