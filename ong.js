const db = require('./db');

const estados = {};

// PROMISE
function queryPromise(sql, values = []) {

message.txt
5 KB
pietroarantess
﻿
const db = require('./db');

const estados = {};

// PROMISE
function queryPromise(sql, values = []) {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

// MENU
function menu() {
    return `👋 Olá! Bem-vindo ao Núcleo Batuira

Somos uma instituição que atua no apoio social, educação e acolhimento de famílias.

Escolha uma opção:

1 - Sobre nós
2 - Como doar
3 - Nossos projetos
4 - Eventos
5 - Voluntariado
6 - Falar com atendente`;
}

// SOBRE
function sobre() {
    return `🏢 O Núcleo Batuira é uma instituição social que atua com educação infantil, assistência social e acolhimento de pessoas em situação de vulnerabilidade.

Nosso objetivo é promover inclusão, dignidade e desenvolvimento social.`;
}

// DOAÇÃO
async function doacao(from, text) {

    let valores = { "1": 10, "2": 20, "3": 50 };

    if (text === "0") return { msg: menu(), estado: "menu" };

    if (valores[text]) {
        await queryPromise(
            "INSERT INTO doacoes (telefone, valor, metodo) VALUES (?, ?, ?)",
            [from, valores[text], "pix"]
        );

        return {
            msg: `❤️ Obrigado pela sua doação de R$${valores[text]}!
Sua ajuda faz a diferença na vida de muitas famílias.`,
            estado: "menu"
        };
    }

    return {
        msg: `💰 Como você deseja ajudar?

1 - R$10
2 - R$20
3 - R$50
0 - Voltar`,
        estado: "doacao"
    };
}

// PROJETOS
async function listarProjetos() {
    const res = await queryPromise("SELECT * FROM projetos");

    let resposta = "📌 Nossos projetos:\n\n";

    res.forEach(p => {
        resposta += `${p.id} - ${p.nome}\n`;
    });

    resposta += "\nDigite o número para saber mais\n0 - Voltar";

    return resposta;
}

// DETALHE PROJETO
async function detalheProjeto(text) {

    if (text === "0") return { msg: menu(), estado: "menu" };

    const res = await queryPromise(
        "SELECT * FROM projetos WHERE id = ?",
        [text]
    );

    if (res.length === 0) {
        return { msg: "Projeto não encontrado.", estado: null };
    }

    const p = res[0];

    return {
        msg: `📌 ${p.nome}

${p.descricao}

👥 Público atendido: ${p.publico}

Digite *menu* para voltar.`,
        estado: "menu"
    };
}

// EVENTOS
async function eventos() {
    const res = await queryPromise("SELECT * FROM eventos");

    if (res.length === 0) {
        return "📅 Nenhum evento disponível no momento.";
    }

    let resposta = "📅 Eventos:\n\n";

    res.forEach(e => {
        resposta += `${e.titulo} - ${e.data_evento}\n`;
    });

    return resposta;
}

// VOLUNTÁRIO
function voluntario() {
    return "🙋 Qual seu nome?";
}

// ATENDENTE
function atendente() {
    return "👨‍💻 Um atendente entrará em contato em breve.";
}

// PROCESSADOR
async function processarMensagem(from, text) {

    if (!estados[from]) estados[from] = "menu";

    let estado = estados[from];

    if (text === "menu" || estado === "menu") {
        estados[from] = "menu";
        return menu();
    }

    if (text === "1") return sobre();

    if (text === "2") {
        estados[from] = "doacao";
        const res = await doacao(from, text);
        estados[from] = res.estado;
        return res.msg;
    }

    if (estado === "doacao") {
        const res = await doacao(from, text);
        if (res.estado) estados[from] = res.estado;
        return res.msg;
    }

    if (text === "3") {
        estados[from] = "projetos";
        return await listarProjetos();
    }

    if (estado === "projetos") {
        const res = await detalheProjeto(text);
        if (res.estado) estados[from] = res.estado;
        return res.msg;
    }

    if (text === "4") {
        return await eventos();
    }

    if (text === "5") {
        estados[from] = "voluntario_nome";
        return voluntario();
    }

    if (estado === "voluntario_nome") {
        estados[from + "_nome"] = text;
        estados[from] = "voluntario_area";
        return "Como você gostaria de ajudar?";
    }

    if (estado === "voluntario_area") {
        await queryPromise(
            "INSERT INTO voluntarios (telefone, nome, area_interesse) VALUES (?, ?, ?)",
            [from, estados[from + "_nome"], text]
        );

        estados[from] = "menu";
        return "✅ Cadastro realizado!";
    }

    if (text === "6") return atendente();

    return "Digite *menu* para voltar.";
}

module.exports = { processarMensagem };
