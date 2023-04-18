import { STATE, create, Client } from "@open-wa/wa-automate";
import options from "./config/options";
import { createStick, messageError, viaCep } from "./comands";

const defaultMessage = `Ola Senhor, \nComo posso te ajudar? 🖥️\n
*!cep <CEP>* -> ViaCep
*!fig* -> Criar Figurinha \n`;

const start = async (client: Client) => {

  client.onStateChanged((state: STATE) => {
    console.log("[Status do cliente]", state);
    if (state === "CONFLICT" || state === "UNLAUNCHED") client.forceRefocus();
  });

  client.onMessage((message: any) => {
    const { text, from } = message;
    // console.log(message)

    if (message.disappearingModeInitiator === 'chat' && text && text[0] === '#') {
   
      const comand = text.split(' ')[0].replace('#', '');
  
      switch (comand) {
        case 'cep': viaCep(client, message); break;
        case 'fig': createStick(client, message); break;
        default: messageError(client, message); break;
      }
    }
  });

  return client;
};


create(options(true, start))
  .then((client: any) => start(client))
  .catch((error: any) => console.log(error));
