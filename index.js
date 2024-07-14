const Bot = require("./Bot");
const MirrorPlugin = require("./libs/Mirror");
const CheckEveryonePlugin = require("./libs/CheckEveryone");
const {botConfig, pluginsConfig} = require("./config");
const Yell = require('./libs/Yell');
const GetGID = require("./libs/GetGID");

const plugins = [
  new MirrorPlugin(pluginsConfig.mirror),
  new CheckEveryonePlugin(pluginsConfig.checkEveryone),
  new GetGID(pluginsConfig.getremoteid),
  new Yell(pluginsConfig.setYell),
];

const bot = new Bot(plugins, botConfig);

(async () => {
  try {
    await bot.connect();
    await bot.run();
  } catch (error) {
    console.error("An error occurred while running the bot:", error);
  }
})();
