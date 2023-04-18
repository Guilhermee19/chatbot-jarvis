import { STATE, create, Client } from "@open-wa/wa-automate";
import options from "./config/options";
import { createStick, viaCep } from "./comands";

const defaultMessage = `Ola Senhor, \nComo posso te ajudar? 🖥️\n
*!cep <CEP>* -> ViaCep
*!fig* -> Criar Figurinha \n`;

const start = async (client: Client) => {
  console.log("\x1b[1;32m✓ USING:", process.env.USING, "\x1b[0m");
  console.log("\x1b[1;32m✓ NUMBER:", await client.getHostNumber(), "\x1b[0m");
  console.log("\x1b[1;32m[SERVER] Servidor iniciado!\x1b[0m");

  client.onStateChanged((state: STATE) => {
    console.log("[Status do cliente]", state);
    if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
  });

  client.onMessage((message) => {
    const { text, from } = message;

    // let aux = text.indexOf("!") != -1;
    // console.log(aux);

    const comand = text.split(' ')[0].replace('!', '');
    console.log('-->', comand);

    switch (comand) {
      case 'cep': viaCep(client, message); break;
      case 'fig': createStick(client, message); break;
      default: client.sendText(from, defaultMessage);
    }

  });

  return client;
};


create(options(true, start))
  .then((client) => start(client))
  .catch((error) => console.log(error));
