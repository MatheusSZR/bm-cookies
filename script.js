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
   MENU HAMBÚRGUER (MOBILE) 🌟 NOVO
   - Transição suave com altura dinâmica
   - Fecha ao clicar em um link
========================= */
const btnHamburguer = document.getElementById('btnHamburguer');
const navMenu = document.getElementById('navMenu');

if (btnHamburguer && navMenu) {
    btnHamburguer.addEventListener('click', () => {
        const estaAberto = navMenu.classList.toggle('aberto');
        btnHamburguer.classList.toggle('ativo');
        btnHamburguer.setAttribute('aria-expanded', estaAberto);

        if (estaAberto) {
            // Pega a altura real do menu (scrollHeight) para animação perfeita
            navMenu.style.maxHeight = navMenu.scrollHeight + 'px';
        } else {
            navMenu.style.maxHeight = '0px';
        }
    });

    // Fecha o menu ao clicar em qualquer link
    const linksMenu = navMenu.querySelectorAll('a');
    linksMenu.forEach(link => {
        link.addEventListener('click', (e) => {
            // Fecha o menu suavemente
            navMenu.classList.remove('aberto');
            btnHamburguer.classList.remove('ativo');
            btnHamburguer.setAttribute('aria-expanded', 'false');
            navMenu.style.maxHeight = '0px';

            // Rolagem suave com offset da navbar
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =========================
   LÓGICA DO MODAL DE PEDIDO
========================= */
const modal = document.getElementById("modalPedido");
const btnFechar = document.getElementById("fecharModal");
const botoesAbrir = document.querySelectorAll(".btn-abrir-modal");

const modalImg = document.getElementById("modalImg");
const modalTitulo = document.getElementById("modalTitulo");
const modalPreco = document.getElementById("modalPreco");
const btnMenos = document.getElementById("btnMenos");
const btnMais = document.getElementById("btnMais");
const displayQtd = document.getElementById("quantidadeDisplay");
const inputObs = document.getElementById("observacao");
const displayTotal = document.getElementById("modalTotal");
const btnConfirmar = document.getElementById("btnConfirmarPedido");

let pedidoAtual = {
    sabor: "",
    precoUnitario: 0,
    quantidade: 1
};

const formatarMoeda = (numeroDigitado) => {
    return `R$ ${numeroDigitado.toFixed(2).replace('.', ',')}`;
};

const atualizarTotal = () => {
    const total = pedidoAtual.precoUnitario * pedidoAtual.quantidade;
    displayTotal.innerText = formatarMoeda(total);
};

// ABRIR O MODAL
botoesAbrir.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        
        pedidoAtual.sabor = card.getAttribute("data-sabor");
        pedidoAtual.precoUnitario = parseFloat(card.getAttribute("data-preco"));
        pedidoAtual.quantidade = 1;

        modalImg.src = card.getAttribute("data-img");
        modalTitulo.innerText = pedidoAtual.sabor;
        modalPreco.innerText = formatarMoeda(pedidoAtual.precoUnitario);
        displayQtd.innerText = pedidoAtual.quantidade;
        inputObs.value = "";

        atualizarTotal();
        modal.classList.add("ativo");
    });
});

// FECHAR O MODAL
const fecharModal = () => {
    modal.classList.remove("ativo");
};

if(btnFechar) btnFechar.addEventListener("click", fecharModal);

if(modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });
}

// Fechar com tecla ESC 🌟 NOVO
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('ativo')) {
        fecharModal();
    }
});

// CONTROLES DE QUANTIDADE
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