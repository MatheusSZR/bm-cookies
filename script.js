const saudacao = document.getElementById('saudacao');

if (saudacao) {
  const hora = new Date().getHours();
  let texto = 'Boa madrugada';
  let emoji = '🍪';

  if (hora >= 6 && hora < 12) {
    texto = 'Bom dia';
  } else if (hora >= 12 && hora < 18) {
    texto = 'Boa tarde';
  } else if (hora >= 18 && hora <= 23) {
    texto = 'Boa noite';
  }

  saudacao.innerHTML = `${texto} ${emoji}`;
}

const cookies = document.querySelectorAll('.cookie-decor');

const controlarCookies = () => {
  requestAnimationFrame(() => {
    const scrollY = window.scrollY;
    const alturaTela = window.innerHeight;

    cookies.forEach((cookie, index) => {
      const trigger = (index + 0.5) * (alturaTela * 0.28);
      cookie.classList.toggle('show', scrollY > trigger);
    });
  });
};

window.addEventListener('scroll', controlarCookies, { passive: true });
window.addEventListener('load', controlarCookies);

const navbar = document.getElementById('navbar');
const btnHamburguer = document.getElementById('btnHamburguer');
const navMenu = document.getElementById('navMenu');

const fecharMenu = () => {
  if (!navMenu || !btnHamburguer) return;
  navMenu.classList.remove('aberto');
  btnHamburguer.classList.remove('ativo');
  btnHamburguer.setAttribute('aria-expanded', 'false');
  navMenu.style.maxHeight = '0px';
};

if (btnHamburguer && navMenu) {
  btnHamburguer.addEventListener('click', () => {
    const estaAberto = navMenu.classList.toggle('aberto');
    btnHamburguer.classList.toggle('ativo');
    btnHamburguer.setAttribute('aria-expanded', String(estaAberto));
    navMenu.style.maxHeight = estaAberto ? `${navMenu.scrollHeight}px` : '0px';
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      event.preventDefault();
      const targetSection = document.querySelector(targetId);
      const offset = navbar ? navbar.offsetHeight + 14 : 70;

      if (targetSection) {
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }

      fecharMenu();
    });
  });
}

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  const sections = document.querySelectorAll('main section[id], header[id]');
  const offset = navbar ? navbar.offsetHeight + 24 : 80;

  sections.forEach((section) => {
    const top = section.offsetTop - offset;
    const bottom = top + section.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);

    if (window.scrollY >= top && window.scrollY < bottom) {
      document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
      if (link) {
        link.classList.add('active');
      }
    }
  });
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.slider-dot');
const heroPrevButton = document.querySelector('.slider-prev');
const heroNextButton = document.querySelector('.slider-next');
const heroSlideTitle = document.getElementById('heroSlideTitle');
const heroSlideDescription = document.getElementById('heroSlideDescription');
let heroActiveIndex = 0;

const renderHeroSlide = () => {
  heroSlides.forEach((slide, index) => {
    slide.classList.toggle('active', index === heroActiveIndex);
  });

  heroDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === heroActiveIndex);
  });

  if (heroSlideTitle && heroSlideDescription) {
    const currentSlide = heroSlides[heroActiveIndex];
    heroSlideTitle.textContent = currentSlide?.getAttribute('data-name') || 'Tradicional';
    heroSlideDescription.textContent = currentSlide?.getAttribute('data-description') || '';
  }
};

const changeHeroSlide = (direction) => {
  if (!heroSlides.length) return;
  heroActiveIndex = (heroActiveIndex + direction + heroSlides.length) % heroSlides.length;
  renderHeroSlide();
};

if (heroPrevButton && heroNextButton) {
  heroPrevButton.addEventListener('click', () => changeHeroSlide(-1));
  heroNextButton.addEventListener('click', () => changeHeroSlide(1));
}

heroDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    heroActiveIndex = Number(dot.getAttribute('data-index') || 0);
    renderHeroSlide();
  });
});

if (heroSlides.length) {
  renderHeroSlide();
  setInterval(() => changeHeroSlide(1), 5000);
}

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');
  if (!button) return;

  button.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    faqItems.forEach((faq) => {
      faq.classList.remove('open');
      const question = faq.querySelector('.faq-question');
      if (question) {
        question.setAttribute('aria-expanded', 'false');
      }
    });

    if (!isOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

const modal = document.getElementById('modalPedido');
const btnFechar = document.getElementById('fecharModal');
const botoesAbrir = document.querySelectorAll('.btn-abrir-modal');
const modalImg = document.getElementById('modalImg');
const modalTitulo = document.getElementById('modalTitulo');
const modalPreco = document.getElementById('modalPreco');
const btnMenos = document.getElementById('btnMenos');
const btnMais = document.getElementById('btnMais');
const displayQtd = document.getElementById('quantidadeDisplay');
const inputObs = document.getElementById('observacao');
const displayTotal = document.getElementById('modalTotal');
const btnConfirmar = document.getElementById('btnConfirmarPedido');
const calendario = document.getElementById('diasCalendario');
const mesCalendario = document.getElementById('mesCalendario');
const btnMesAnterior = document.getElementById('btnMesAnterior');
const btnMesSeguinte = document.getElementById('btnMesSeguinte');
const erroData = document.getElementById('erroData');
const horarioEntrega = document.getElementById('horarioEntrega');

let pedidoAtual = {
  sabor: '',
  precoUnitario: 0,
  quantidade: 1,
};

let dataSelecionada = '';
let viewDate = new Date();
let horarioSelecionado = '09:00';

const formatarMoeda = (valor) => `R$ ${valor.toFixed(2).replace('.', ',')}`;

const formatarData = (data) => {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

const atualizarTotal = () => {
  if (!displayTotal) return;
  const total = pedidoAtual.precoUnitario * pedidoAtual.quantidade;
  displayTotal.textContent = formatarMoeda(total);
};

const gerarOpcoesHorario = () => {
  if (!horarioEntrega) return;

  const horarios = [];
  for (let hora = 9; hora <= 19; hora += 1) {
    horarios.push(`${String(hora).padStart(2, '0')}:00`);
    if (hora < 19) {
      horarios.push(`${String(hora).padStart(2, '0')}:30`);
    }
  }

  horarioEntrega.innerHTML = horarios.map((hora) => `<option value="${hora}">${hora}</option>`).join('');
  horarioEntrega.value = '09:00';
  horarioSelecionado = '09:00';
};

const isDataDisponivel = (data) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataBase = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  return dataBase.getDay() === 6 && dataBase >= hoje;
};

const renderCalendario = () => {
  if (!calendario || !mesCalendario) return;

  const nomeMes = viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  mesCalendario.textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

  const primeiroDia = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const ultimoDia = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  let html = '';

  for (let index = 0; index < primeiroDia.getDay(); index += 1) {
    html += '<span class="calendario-vazio"></span>';
  }

  for (let dia = 1; dia <= ultimoDia.getDate(); dia += 1) {
    const data = new Date(viewDate.getFullYear(), viewDate.getMonth(), dia);
    const disponivel = isDataDisponivel(data);
    const selecionado = dataSelecionada && data.toDateString() === dataSelecionada.toDateString();
    const classes = ['calendario-dia'];

    if (!disponivel) classes.push('desabilitado');
    if (selecionado) classes.push('selecionado');

    html += `<button class="${classes.join(' ')}" type="button" data-dia="${dia}" ${disponivel ? '' : 'disabled'}>${dia}</button>`;
  }

  calendario.innerHTML = html;

  calendario.querySelectorAll('.calendario-dia').forEach((botao) => {
    botao.addEventListener('click', () => {
      if (botao.classList.contains('desabilitado')) return;

      const dia = Number(botao.getAttribute('data-dia'));
      dataSelecionada = new Date(viewDate.getFullYear(), viewDate.getMonth(), dia);
      renderCalendario();
      if (erroData) {
        erroData.textContent = '';
      }
    });
  });
};

const abrirModal = (card) => {
  if (!modal || !modalImg || !modalTitulo || !modalPreco || !displayQtd || !inputObs) return;

  pedidoAtual.sabor = card.getAttribute('data-sabor') || '';
  pedidoAtual.precoUnitario = parseFloat(card.getAttribute('data-preco') || '0');
  pedidoAtual.quantidade = 1;
  dataSelecionada = '';
  viewDate = new Date();
  horarioSelecionado = '09:00';

  if (horarioEntrega) {
    horarioEntrega.value = horarioSelecionado;
  }

  if (erroData) {
    erroData.textContent = '';
  }

  modalImg.src = card.getAttribute('data-img') || '';
  modalImg.alt = `Cookie ${pedidoAtual.sabor}`;
  modalTitulo.textContent = pedidoAtual.sabor;
  modalPreco.textContent = formatarMoeda(pedidoAtual.precoUnitario);
  displayQtd.textContent = pedidoAtual.quantidade;
  inputObs.value = '';
  atualizarTotal();
  renderCalendario();
  modal.classList.add('ativo');
  modal.setAttribute('aria-hidden', 'false');
};

const fecharModal = () => {
  if (!modal) return;
  modal.classList.remove('ativo');
  modal.setAttribute('aria-hidden', 'true');
  if (erroData) {
    erroData.textContent = '';
  }
};

botoesAbrir.forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    if (card) {
      abrirModal(card);
    }
  });
});

if (btnFechar) {
  btnFechar.addEventListener('click', fecharModal);
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      fecharModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('ativo')) {
    fecharModal();
  }
});

if (btnMais) {
  btnMais.addEventListener('click', () => {
    pedidoAtual.quantidade += 1;
    displayQtd.textContent = pedidoAtual.quantidade;
    atualizarTotal();
  });
}

if (btnMenos) {
  btnMenos.addEventListener('click', () => {
    if (pedidoAtual.quantidade > 1) {
      pedidoAtual.quantidade -= 1;
      displayQtd.textContent = pedidoAtual.quantidade;
      atualizarTotal();
    }
  });
}

if (btnMesAnterior) {
  btnMesAnterior.addEventListener('click', () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderCalendario();
  });
}

if (btnMesSeguinte) {
  btnMesSeguinte.addEventListener('click', () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendario();
  });
}

if (horarioEntrega) {
  horarioEntrega.addEventListener('change', () => {
    horarioSelecionado = horarioEntrega.value;
  });
}

gerarOpcoesHorario();
renderCalendario();

if (btnConfirmar) {
  btnConfirmar.addEventListener('click', () => {
    if (!dataSelecionada) {
      if (erroData) {
        erroData.textContent = 'A data da entrega é obrigatória.';
      }
      return;
    }

    const total = pedidoAtual.precoUnitario * pedidoAtual.quantidade;
    const obs = inputObs.value.trim();
    const horario = horarioEntrega?.value || horarioSelecionado;

    let mensagem = 'Olá! Gostaria de fazer um pedido na B&M Cookies.\n\n';
    mensagem += '🍪 Pedido:\n';
    mensagem += `• ${pedidoAtual.sabor} (x${pedidoAtual.quantidade})\n`;
    mensagem += `*Total:* ${formatarMoeda(total)}\n`;

    if (obs) {
      mensagem += `\n📝 Observações:\n${obs}\n`;
    }

    mensagem += `\n📅 Data da entrega:\n${formatarData(dataSelecionada)}\n`;
    mensagem += `\n⏰ Horário preferencial:\n${horario}\n\nGostaria de confirmar a disponibilidade.`;

    const numeroWhatsApp = '5561981570523';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    fecharModal();
  });
}
