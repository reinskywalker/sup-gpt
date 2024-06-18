const botConfig = {
  authFolder: "auth",
  selfReply: false,
  logMessages: true,
};

const pluginsConfig = {
  mirror: {
    prefix: "!mirror!",
  },
  checkEveryone: {
    membersLimit: 100,
    setTrigger: "checkforpresence",
  },
};

module.exports = { botConfig, pluginsConfig };
