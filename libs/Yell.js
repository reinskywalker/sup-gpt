const cron = require("node-cron");

class Yell {
  #socket;
  #getText;
  #sendMessage;
  #membersLimit;
  #prefix;

  constructor(config = {}) {
    this.#membersLimit = config.membersLimit || 100;
    this.#prefix = config.prefix || "!yell! ";
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

  init(socket, getText, sendMessage) {
    this.#socket = socket;
    this.#getText = getText;
    this.#sendMessage = sendMessage;
  }

  async process(key, message) {
    const text = this.#getText(key, message);

    if (!text.toLowerCase().includes(this.#prefix)) return;

    try {
      const grp = await this.#socket.groupMetadata(key.remoteJid);
      const members = grp.participants;

      const sender = members.find((member) => member.id === key.participant);

      if (!sender || !sender.admin) {
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
          /* pre-formatted text on whatsapp */
          {
            text: `_[${this.dateStr}] - Broadcasted Message_\n\n${text.slice(
              this.#prefix.length,
            )}\n\n\n${items.join(", ")}`,
            mentions,
          },
          { quoted: { key, message } },
        );
      }
    } catch (err) {
      console.log("ERROR in Yell:", err);
    }
  }
}

module.exports = Yell;
