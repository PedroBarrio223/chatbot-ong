const express = require('express');
const { processarMensagem } = require('./bot');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("API rodando");
});

app.post('/webhook', async (req, res) => {

    const text = req.body.text;
    const from = req.body.from;

    const resposta = await processarMensagem(from, text);

    res.json({
        resposta: resposta
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor rodando");
});
