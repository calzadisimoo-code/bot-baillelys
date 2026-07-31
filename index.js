console.clear();

console.log("==================================");
console.log("      KYRO BOT - BAILEYS");
console.log("==================================");
console.log("Iniciando...");
console.log("==================================");

const iniciarBot = require("./bot");

iniciarBot().catch((err) => {

    console.error("Error iniciando el bot:");
    console.error(err);

});