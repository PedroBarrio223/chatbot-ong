const express = require('express');
const axios = require('axios');
const { processarMensagem } = require('./bot');

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "teste123";


// 🔹 Verificação do webhook
app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
        return res.send(req.query['hub.challenge']);
    }
    res.sendStatus(403);
});


// 🔹 Receber mensagem
app.post('/webhook', async (req, res) => {

    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message) {
        const from = message.from;
        const text = message.text?.body;

        const resposta = await processarMensagem(from, text);

        // 🔹 enviar resposta
        await axios.post(
            `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: from,
                text: { body: resposta }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.TOKEN}`
                }
            }
        );
    }

    res.sendStatus(200);
});


// 🔹 rota simples pra testar
app.get('/', (req, res) => {
    res.send("API funcionando");
});


app.listen(process.env.PORT || 3000);
