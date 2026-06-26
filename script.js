/* =========================
   SAUDAÇÃO COM COOKIE (IMAGEM)
========================= */
const saudacao = document.getElementById("saudacao");

if (saudacao) {
    const hora = new Date().getHours();
    let texto = "";
    let cookieImg = "";

    if (hora >= 6 && hora < 12) {
        texto = "Bom dia";
        cookieImg = "imagens/cookietradicional.png";
    } 
    else if (hora >= 12 && hora < 18) {
        texto = "Boa tarde";
        cookieImg = "imagens/cookiechocolateduplo.png";
    } 
    else if (hora >= 18 && hora <= 23) {
        texto = "Boa noite";
        cookieImg = "imagens/cookielimao.png";
    } 
    else {
        texto = "Boa madrugada";
        cookieImg = "imagens/cookietradicional.png";
    }

    saudacao.innerHTML = `
        <span>${texto}</span>
        <img src="${cookieImg}" class="cookie-emoji" alt="">
    `;
}

/* =========================
   COOKIES DECORATIVOS (LATERAIS)
========================= */
const cookies = document.querySelectorAll(".cookie-decor");

function controlarCookies() {
    requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const alturaTela = window.innerHeight;

        cookies.forEach((cookie, index) => {
            const trigger = (index + 0.5) * (alturaTela * 0.30);
            if (scrollY > trigger) {
                cookie.classList.add("show");
            } else {
                cookie.classList.remove("show");
            }
        });
    });
}

window.addEventListener("scroll", controlarCookies, { passive: true });
window.addEventListener("load", controlarCookies);

/* =========================
   LÓGICA DO MODAL DE PEDIDO
========================= */
const modal = document.getElementById("modalPedido");
const btnFechar = document.getElementById("fecharModal");
const botoesAbrir = document.querySelectorAll(".btn-abrir-modal");

// Elementos internos do modal para atualização de dados
const modalImg = document.getElementById("modalImg");
const modalTitulo = document.getElementById("modalTitulo");
const modalPreco = document.getElementById("modalPreco");
const btnMenos = document.getElementById("btnMenos");
const btnMais = document.getElementById("btnMais");
const displayQtd = document.getElementById("quantidadeDisplay");
const inputObs = document.getElementById("observacao");
const displayTotal = document.getElementById("modalTotal");
const btnConfirmar = document.getElementById("btnConfirmarPedido");

// Variáveis que vão armazenar o estado do pedido atual
let pedidoAtual = {
    sabor: "",
    precoUnitario: 0,
    quantidade: 1
};

// Função para formatar o número em Moeda Brasileira (Ex: R$ 12,00)
const formatarMoeda = (numeroDigitado) => {
    // Usando 'numeroDigitado' para evitar confusões de escopo
    return `R$ ${numeroDigitado.toFixed(2).replace('.', ',')}`;
};

// Calcula e atualiza o total na tela
const atualizarTotal = () => {
    const total = pedidoAtual.precoUnitario * pedidoAtual.quantidade;
    displayTotal.innerText = formatarMoeda(total);
};

// ABRIR O MODAL
botoesAbrir.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        
        // Pega os dados armazenados nos atributos 'data-' do HTML
        pedidoAtual.sabor = card.getAttribute("data-sabor");
        pedidoAtual.precoUnitario = parseFloat(card.getAttribute("data-preco"));
        pedidoAtual.quantidade = 1; // Sempre reseta a quantidade para 1 ao abrir

        // Preenche o modal visualmente
        modalImg.src = card.getAttribute("data-img");
        modalTitulo.innerText = pedidoAtual.sabor;
        modalPreco.innerText = formatarMoeda(pedidoAtual.precoUnitario);
        displayQtd.innerText = pedidoAtual.quantidade;
        inputObs.value = ""; // Limpa qualquer observação anterior

        atualizarTotal();
        
        // Exibe o modal na tela
        modal.classList.add("ativo");
    });
});

// FECHAR O MODAL
const fecharModal = () => {
    modal.classList.remove("ativo");
};

// Fechar ao clicar no "X"
if(btnFechar) btnFechar.addEventListener("click", fecharModal);

// Fechar ao clicar fora da caixinha branca (no fundo escuro)
if(modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });
}

// CONTROLES DE QUANTIDADE (+ E -)
if(btnMais) {
    btnMais.addEventListener("click", () => {
        pedidoAtual.quantidade++;
        displayQtd.innerText = pedidoAtual.quantidade;
        atualizarTotal();
    });
}

if(btnMenos) {
    btnMenos.addEventListener("click", () => {
        if (pedidoAtual.quantidade > 1) { 
            pedidoAtual.quantidade--;
            displayQtd.innerText = pedidoAtual.quantidade;
            atualizarTotal();
        }
    });
}

// ENVIAR O PEDIDO PARA O WHATSAPP
if(btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
        const total = pedidoAtual.precoUnitario * pedidoAtual.quantidade;
        const obs = inputObs.value.trim();
        
        // Formata a mensagem com negritos (*) para o WhatsApp
        let mensagem = `Olá! Gostaria de fazer um pedido 🍪\n\n`;
        mensagem += `*Sabor:* ${pedidoAtual.sabor}\n`;
        mensagem += `*Quantidade:* ${pedidoAtual.quantidade}\n`;
        mensagem += `*Total:* ${formatarMoeda(total)}\n`;
        
        if (obs !== "") {
            mensagem += `\n*Observações:* ${obs}`;
        }

        const numeroWhatsApp = "5561981570523";
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        
        window.open(url, "_blank");
        fecharModal();
    });
}