const numero = "5561981570523";

/* =========================
   SAUDAÇÃO DINÂMICA
========================= */
const saudacao = document.getElementById("saudacao");

const hora = new Date().getHours();

if (hora < 12) {
    saudacao.innerText = "Bom dia! 🍪";
} else if (hora < 18) {
    saudacao.innerText = "Boa tarde! 🍪";
} else {
    saudacao.innerText = "Boa noite! 🍪";
}

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
   PEDIDO POR SABOR (WHATSAPP)
========================= */
document.querySelectorAll(".btn-card").forEach(btn => {
    btn.addEventListener("click", (e) => {

        const card = e.target.closest(".card");
        const sabor = card.getAttribute("data-sabor");

        const mensagem = `Olá! Quero pedir o cookie de ${sabor} 🍪`;

        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, "_blank");
    });
});

/* =========================
   INTERAÇÃO VISUAL (APP FEEL)
========================= */
document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mousedown", () => {
        card.style.transform = "scale(0.97)";
    });

    card.addEventListener("mouseup", () => {
        card.style.transform = "";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
    });

});