const db = require('./db');


function menu() {
    return `Olá! Seja bem-vindo(a) ao Núcleo Batuíra.


Somos uma organização social dedicada ao apoio de famílias em situação de vulnerabilidade.

Selecione uma das opções abaixo:

1️⃣ - Sobre a ONG
2️⃣ - Como ajudar
3️⃣ - Projetos e serviços
4️⃣ - Voluntariado
5️⃣ - Endereço e contato
6️⃣ - Falar com atendente
7️⃣ - Doação via PIX

✍ Digite o número da opção desejada.`;
}


function sobre() {
    return `🏢 O Núcleo Batuíra é uma organização social localizada em Guarulhos (SP), que atua no apoio a famílias em situação de vulnerabilidade social.

🎯 Nossa missão é promover desenvolvimento social, educação e dignidade.

Atuamos por meio de:

• 👶 Educação infantil
• 🤝 Assistência social
• 🌎 Projetos comunitários

Trabalhamos para fortalecer famílias e transformar realidades.

🔙 Digite "menu" para voltar ao início.`;
}


function ajuda() {
    return `Você pode contribuir com o Núcleo Batuíra de diversas formas:

• 👕 Doação de roupas e itens essenciais
• 🍞 Doação de alimentos
• 📢 Divulgação do nosso trabalho

Toda ajuda contribui diretamente para o bem-estar das famílias atendidas.

📞 Para mais informações, fale com um atendente (6).

🔙 Digite "menu" para voltar ao início.`;
}


function listarProjetos() {
    return new Promise((resolve) => {

        db.query("SELECT * FROM projetos", (err, res) => {

            if (err) {
                resolve("❌ Erro ao buscar projetos.");
                return;
            }

            let resposta = `📚 O Núcleo Batuíra oferece diversos projetos sociais:\n\n`;

            res.forEach((p, index) => {
                resposta += `${index + 1}. ${p.titulo_projeto}\n`;
            });

            resposta += `\n✍️ Para saber mais sobre um projeto, digite:\n\n`;
            resposta += `opcao número\n\n`;
            resposta += `📌 Exemplo:\nopcao 1\n\n`;
            resposta += `🔙 Digite "menu" para voltar ao início.`;

            resolve(resposta);
        });

    });
}


function detalhesProjeto(numeroProjeto) {

    return new Promise((resolve) => {

        db.query(
            "SELECT * FROM projetos LIMIT 1 OFFSET ?",
            [numeroProjeto - 1],
            (err, res) => {

                if (err || res.length === 0) {
                    resolve("❌ Projeto não encontrado.");
                    return;
                }

                const projeto = res[0];

                resolve(
`📚 ${projeto.titulo_projeto}

📝 Descrição:\n
${projeto.descricao_projeto}
\n🔙 Digite "projetos" para voltar para a lista.`
                );
            }
        );

    });
}


function voluntariado() {
    return `🙋 Faça parte da nossa missão.


Como voluntário, você pode atuar em:

• 🤝 Apoio em atividades sociais
• 🎉 Eventos e campanhas
• 📚 Projetos educacionais

Sua participação faz a diferença.

📝 Para se cadastrar, digite:

cadastrar SeuTelefone SeuNome SeuEmail

📌 Exemplo:
cadastrar 1195666-9876 Gustavo gustavo@email.com

🔙 Digite "menu" para voltar ao início.`;
}


function endereco() {
    return `📍 Estamos localizados na Rua Segundo Tenente Renato Ometi, em Guarulhos - SP.

Estamos à disposição para atender você.

📞 Para mais informações, entre em contato com nossa equipe ou acompanhe nossas redes sociais (6).

🔙 Digite "menu" para voltar ao início.`;
}


function atendente() {
    return `Você pode falar com um atendente por meio de um desses dois números:

📞 +55 (11) 2412-2186
📞 +55 (11) 2412-1659

💙 Agradecemos pelo contato.

🔙 Digite "menu" para voltar ao início.`;
}

function pix() {
    return `💰 *Doação via PIX*

Sua ajuda faz a diferença na vida de muitas famílias.

📌 Chave PIX:
nucleobatuira2@gmail.com

💙 Agradecemos pela sua contribuição ao Núcleo Batuíra.

🔙 Digite "menu" para voltar ao início.`;
}

function erro() {
    return `❌ Opção inválida.

🔙 Por favor, selecione uma opção de 1 a 6 ou digite "menu" para voltar ao início.`;
}


async function processarMensagem(from, text) {


    if (!text) return erro();


    text = text.trim();
    const comando = text.toLowerCase();

    if (comando === "menu" || comando === "oi" || comando === "olá" || comando === "bom dia" || comando === "boa tarde" || comando === "boa noite") return menu();

    if (comando === "1") return sobre();

    if (comando === "2") return ajuda();

    if (comando === "3") {
        return await listarProjetos();
    }

    if (comando.startsWith("opcao")) {

    const partes = comando.split(" ");

    if (partes.length < 2) {
        return "❌ Use: opcao número";
    }

    const numeroProjeto = parseInt(partes[1]);

    if (isNaN(numeroProjeto)) {
        return "❌ Digite um número válido.";
    }

    return await detalhesProjeto(numeroProjeto);
    }

    if (comando === "projetos") return listarProjetos();

    if (comando === "4") return voluntariado();

    if (comando === "5") return endereco();

    if (comando === "6") return atendente();

    if (comando === "7") return pix();

    if (comando.startsWith("cadastrar")) {

    const partes = text.split(" ");

    if (partes.length < 4) {
        return "Use: cadastrar Telefone Nome Email";
    }

    const telefone = partes[1];
    const email = partes[partes.length - 1];
    const nome = partes.slice(2, -1).join(" ");

    return new Promise((resolve) => {

        db.query(
            "SELECT * FROM voluntarios WHERE telefone = ? OR email = ?",
            [telefone, email],
            (err, results) => {

                if (err) {
                    resolve("Erro ao verificar cadastro.");
                    return;
                }

                if (results.length > 0) {
                    resolve("Já existe um cadastro com esse telefone ou email.");
                    return;
                }

                db.query(
                    "INSERT INTO voluntarios (telefone, nome, email) VALUES (?, ?, ?)",
                    [telefone, nome, email],
                    (err) => {

                        if (err) {
                            resolve("Erro ao realizar cadastro.");
                            return;
                        }

                        resolve(`✅ Cadastro realizado com sucesso!\n\n🔙 Digite "menu" para voltar ao início.`);
                    }
                );
            }
        );
    });
}

    return erro();
}


module.exports = { processarMensagem };
