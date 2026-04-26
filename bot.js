const db = require('./db');

function menu() {
    return `Olá! Seja bem-vindo(a) ao Núcleo Batuíra.

            Somos uma organização social dedicada ao apoio de famílias em situação de vulnerabilidade.
            
            Selecione uma das opções abaixo:
            1 - Sobre a ONG
            2 - Como ajudar
            3 - Projetos e serviços
            4 - Voluntariado
            5 - Endereço e contato
            6 - Falar com atendente
            
            Digite o número da opção desejada.`;
            }

function sobre() {
    return `O Núcleo Batuíra é uma organização social localizada em Guarulhos (SP), que atua no apoio a famílias em situação de vulnerabilidade social.

            Nossa missão é promover desenvolvimento social, educação e dignidade.
            
            Atuamos por meio de:
            
            Educação infantil
            Assistência social
            Projetos comunitários
            
            Trabalhamos para fortalecer famílias e transformar realidades.
            
            Digite menu para voltar ao início.`;
            }

function ajuda() {
    return `Você pode contribuir com o Núcleo Batuíra de diversas formas:
            
            Doações financeiras
            Doação de roupas e itens essenciais
            Doação de alimentos
            Divulgação do nosso trabalho
            
            Toda ajuda contribui diretamente para o bem-estar das famílias atendidas.
            
            Para mais informações, fale com um atendente (opção 6).`;
            }

function listarProjetos() {
    return new Promise((resolve) => {
        db.query("SELECT * FROM projetos", (err, res) => {

            if (err) {
                resolve("Erro ao buscar projetos.");
                return;
            }

            let resposta = `O Núcleo Batuíra oferece diversos serviços sociais, como:\n\n`;

            res.forEach(p => {
                resposta += `• ${p.nome}\n`;
            });

            resposta += `\nNosso objetivo é promover inclusão, desenvolvimento e qualidade de vida.`;

            resolve(resposta);
        });
    });
}

function voluntariado() {
    return `Faça parte da nossa missão.

            Como voluntário, você pode atuar em:
            
            Apoio em atividades sociais
            Eventos e campanhas
            Projetos educacionais
            
            Sua participação faz a diferença.
            
            Para se cadastrar, digite:
            cadastrar SeuNome SuaArea
            Exemplo: cadastrar João eventos`;
            }

function endereco() {
    return `Estamos localizados em Guarulhos - SP.

            Para mais informações, entre em contato com nossa equipe ou acompanhe nossas redes sociais.
            
            Estamos à disposição para atender você.`;
            }

function atendente() {
    return `Você será direcionado(a) para um de nossos atendentes.

            Aguarde um momento, por favor.
            
            Agradecemos pelo contato.`;
            }

function erro() {
    return `Opção inválida.

            Por favor, selecione uma opção de 1 a 6 ou digite menu para voltar ao início.`;
            }

async function processarMensagem(from, text) {

    if (!text) return erro();

    text = text.trim().toLowerCase();

    if (text === "menu") return menu();

    if (text === "1") return sobre();

    if (text === "2") return ajuda();

    if (text === "3") {
        return await listarProjetos();
    }

    if (text === "4") return voluntariado();

    if (text === "5") return endereco();

    if (text === "6") return atendente();

    if (text.startsWith("cadastrar")) {

        const partes = text.split(" ");
    
        if (partes.length < 3) {
            return "Use: cadastrar Nome Area";
        }
    
        const nome = partes.slice(1, -1).join(" ");
        const area = partes[partes.length - 1];
    
        db.query(
            "INSERT INTO voluntarios (telefone, nome, area_interesse) VALUES (?, ?, ?)",
            [from, nome, area]
        );
    
        return "Cadastro realizado com sucesso!";
}

    return erro();
}

module.exports = { processarMensagem };
