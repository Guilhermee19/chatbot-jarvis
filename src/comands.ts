import { Client, Message } from '@open-wa/wa-automate';
import { decryptMedia } from '@open-wa/wa-decrypt';
import axios from 'axios';

export async function sendMenu(client: Client, message: Message) {
    const { from } = message;
    const defaultMessage = `*╼╼╼╼╼ Central de Comandos 🖥️ ╼╼╼╼╼*\n\nOpa `+message.chat.contact.name+`! o que deseja:\n\n_#fig_ -> + a imagem para criar a figurinha 📄\n_#cep_ ->  + CEP para buscar  📚\n╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼\n╰╼╼>👋 Criado por Gui.\n`;
    client.sendText(from, defaultMessage);
}

export async function viaCep(client: Client, message: Message) {
    let cep = message.body.split("!cep ")[1]

    client.sendText(message.from, "Pesquisando...");
    client.simulateTyping(message.from, true);
    client.react(message.id, "✅");

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

export async function createStick2(client: Client, message: Message) {
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

export async function createStick(client: Client, message: Message) {
    const { id, from, isMedia, mimetype , type, quotedMsg } = message;

    const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';
  
    if (isMedia && type === 'image') {
        const mediaData = await decryptMedia(message, uaOverride);
        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`;
        await client.react(message.id, "✅");
        await client.sendImageAsSticker(from, imageBase64, { 
            author: 'Bot do Gui', 
            pack: 'Minhas Figurinhas' 
        });
    } 
    else if (quotedMsg && quotedMsg.type == 'image') {
        const mediaData = await decryptMedia(quotedMsg, uaOverride);
        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`;
        await client.react(message.id, "✅");
        await client.sendImageAsSticker(from, imageBase64, { 
            author: 'Bot do Gui', 
            pack: 'Minhas Figurinhas' 
        });
    } 
    else if ((mimetype === 'video/mp4' && (message.duration || 31) < 30) || (mimetype === 'image/gif' && (message.duration || 31) < 30)) {
        const mediaData = await decryptMedia(message, uaOverride);
        await client.react(message.id, "✅");
        await client.sendMp4AsSticker(from, `data:${mimetype};base64,${mediaData.toString('base64')}`, undefined,  { 
            author: 'Bot do Gui', 
            pack: 'Minhas Figurinhas' 
        });
    } 
    else if ((quotedMsg?.mimetype === 'video/mp4' && (quotedMsg?.duration || 31) < 30) || (quotedMsg?.mimetype === 'image/gif' && (quotedMsg?.duration || 0) < 30)) {
        const mediaData = await decryptMedia(quotedMsg, uaOverride);
        await client.react(message.id, "✅");
        await client.sendMp4AsSticker(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, undefined,  { 
            author: 'Bot do Gui', 
            pack: 'Minhas Figurinhas' 
        })
    }
}

export async function messageError(client: Client, message: Message) {
    client.react(message.id, "❓");
    sendMenu(client, message)
}

