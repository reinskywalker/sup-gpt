class checkEveryone {
  #socket;
  #getText;
  #sendMessage;
  #membersLimit;
  #setTrigger;

  constructor(config = {}) {
    this.#membersLimit = config.membersLimit || 100;
    this.#setTrigger = config.setTrigger;
  }

  init(socket, getText, sendMessage) {
    this.#socket = socket;
    this.#getText = getText;
    this.#sendMessage = sendMessage;
  }

  async process(key, message) {
    const text = this.#getText(key, message);

    if (!text.toLowerCase().includes("@" + this.#setTrigger)) return;

    try {
      const grp = await this.#socket.groupMetadata(key.remoteJid);
      const members = grp.participants;

      const sender = members.find(member => member.id === key.participant);

      if (!sender || !sender.admin) {
        console.log("Only admin members can send the message.");
        return;
      }

      const mentions = [];
      const items = [];

      members.forEach(({ id }) => {
        mentions.push(id);
        items.push("@" + id.slice(0, 12));
      });

      if (members.length < this.#membersLimit) {
        this.#sendMessage(
          key.remoteJid,
          { text: `[${this.#setTrigger}] \n${items.join(", ")}`, mentions },
          { quoted: { key, message } }
        );
      }
    } catch (err) {
      console.log("ERROR in checkEveryone:", err);
    }
  }
}

module.exports = checkEveryone;