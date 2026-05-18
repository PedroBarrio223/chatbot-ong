const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
const { processarMensagem } = require('./bot');

const app = express();

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send("API rodando");
});

app.post('/webhook', async (req, res) => {

    const text = req.body.Body;
    const from = req.body.From;

    console.log("Mensagem:", text);

    const resposta = await processarMensagem(from, text);

    const twiml = new MessagingResponse();

    twiml.message(resposta);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando");
});
