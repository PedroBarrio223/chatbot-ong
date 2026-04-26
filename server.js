const express = require('express');
const { processarMensagem } = require('./bot');

const app = express();
app.use(express.json());

// rota teste
app.get('/', (req, res) => {
    res.send("API rodando 🚀");
});

// simulação do WhatsApp
app.post('/webhook', async (req, res) => {

    const text = req.body.text;
    const from = req.body.from;

    const resposta = await processarMensagem(from, text);

    res.json({
        resposta: resposta
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando");
});
