const express = require('express');
const { processarMensagem } = require('./bot');

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
    const { from, text } = req.body;

    const resposta = await processarMensagem(from, text);

    res.json({ reply: resposta });
});

app.get('/', (req, res) => {
    res.send("API rodando");
});

app.listen(process.env.PORT || 3000);
