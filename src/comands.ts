import { Client, Message } from '@open-wa/wa-automate';
import axios from 'axios';

export async function viaCep(client: Client, message: Message) {
    let cep = message.body.split("!cep ")[1]


    client.sendText(message.from, "Pesquisando...");
    client.simulateTyping(message.from, true);

    const getAddressByCEP = async (cep: string): Promise<any> => {

        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            
            const res = `------------Informações do CEP------------\n\n*Cep:* ${response.data.cep}\n*Endereço:* ${response.data.logradouro}\n*Bairro:* ${response.data.bairro} \n*Cidade:* ${response.data.localidade} - ${response.data.uf}`;

            client.sendText(message.from, res);
            client.simulateTyping(message.from, false);

            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }

    };

    return getAddressByCEP(cep)
}

export async function createStick(client: Client, message: Message) {
    const { from, body } = message;

    client.sendText(from, "Pesquisando...");
    client.simulateTyping(from, true);
    
    client.sendText(from, "Criando figurinha");
    client.simulateTyping(from, true);
   
    const imageBuffer = Buffer.from(body, "base64");

    // Envia o sticker
    client.sendImageAsSticker(from, imageBuffer.toString("base64"));

    client.simulateTyping(from, false);
}