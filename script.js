
/* =========================
   SAUDAÇÃO COM COOKIE (IMAGEM)
========================= */
const saudacao = document.getElementById("saudacao");

const hora = new Date().getHours();

let texto = "";
let cookieImg = "";

if (hora < 12) {
    texto = "Bom dia";
    cookieImg = "imagens/cookietradicional.png";
} 
else if (hora < 18) {
    texto = "Boa tarde";
    cookieImg = "imagens/cookiechocolateduplo.png";
} 
else {
    texto = "Boa noite";
    cookieImg = "imagens/cookielimao.png";
}

saudacao.innerHTML = `
    <span>${texto}</span>
    <img src="${cookieImg}" class="cookie-emoji" alt="cookie">
`;

/* =========================
   BOTÃO VOLTAR AO TOPO
========================= */
const topoBtn = document.getElementById("topoBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        topoBtn.style.display = "block";
    } else {
        topoBtn.style.display = "none";
    }
});

topoBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/* =========================
   WHATSAPP DOS CARDS
========================= */
document.querySelectorAll(".btn-card").forEach(btn => {
    btn.addEventListener("click", (e) => {

        const card = e.target.closest(".card");
        const sabor = card.getAttribute("data-sabor");

        const mensagem = `Olá! Quero pedir o cookie de ${sabor} 🍪`;

        const url = `https://wa.me/5561981570523?text=${encodeURIComponent(mensagem)}`;

        window.open(url, "_blank");
    });
});

/* =========================
   COOKIES DECORATIVOS (LATERAIS ESTÁVEIS)
   - só adiciona/remove classe
========================= */
const cookies = document.querySelectorAll(".cookie-decor");

function controlarCookies() {

    const scrollY = window.scrollY;
    const alturaTela = window.innerHeight;

    cookies.forEach((cookie, index) => {

        const trigger = (index + 1) * (alturaTela * 0.35);

        if (scrollY > trigger) {
            cookie.classList.add("show");
        } else {
            cookie.classList.remove("show");
        }

    });
}

window.addEventListener("scroll", controlarCookies);
window.addEventListener("load", controlarCookies);