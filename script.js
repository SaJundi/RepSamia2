/* ==========================================================================
   DRA. SAMIA INSAURRIAGA JUNDI - SCRIPTS INTERATIVOS
   Parallax Scroll, Sistema de Rodagem (Carrossel), Menu Mobile & FAQ
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('mainHeader');
  const navToggle = document.getElementById('navToggle');
  const navWrapper = document.getElementById('navWrapper');
  const navLinks = document.querySelectorAll('.nav-item');
  const treeBgLayer = document.getElementById('treeBgLayer');
  const treeOverlayLayer = document.getElementById('treeOverlayLayer');

  /* -------------------------------------------------------------------------
     1. SISTEMA DE ROLAGEM / PARALLAX ("IMAGEM PRINCIPAL QUE FICA EM 2º PLANO")
     ------------------------------------------------------------------------- */
  let isTicking = false;

  const onScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowH = window.innerHeight;

    // Header fixo elegante
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Parallax da Árvore da Vida (deslocamento suave para profundidade)
    if (treeBgLayer) {
      const translateY = scrollY * 0.15; // Velocidade suave
      const scale = 1 + Math.min(scrollY / (windowH * 5), 0.06);
      treeBgLayer.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    }

    // Transição da imagem para segundo plano:
    // Conforme o usuário rola, a camada translúcida se intensifica suavemente
    if (treeOverlayLayer) {
      const scrollFactor = Math.min(scrollY / (windowH * 0.9), 1);
      // No topo (hero), overlay é suave; ao rolar para o conteúdo, ganha tom marfim aveludado
      treeOverlayLayer.style.opacity = (0.35 + (scrollFactor * 0.60)).toFixed(2);
    }

    isTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(onScroll);
      isTicking = true;
    }
  }, { passive: true });

  onScroll(); // Execução inicial

  /* -------------------------------------------------------------------------
     2. SISTEMA DE RODAGEM DE DEPOIMENTOS (CARROSSEL AUTOMÁTICO)
     ------------------------------------------------------------------------- */
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoPlayInterval = null;

  const updateCarousel = (index) => {
    if (!track) return;
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Atualiza dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    // Atualiza classes ativas
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
      updateCarousel(currentSlide + 1);
    }, 6000); // Roda a cada 6 segundos
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  };

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      updateCarousel(currentSlide - 1);
      startAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
      updateCarousel(currentSlide + 1);
      startAutoPlay();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateCarousel(idx);
        startAutoPlay();
      });
    });

    // Pausa o carrossel se o usuário passar o mouse por cima
    const carouselEl = document.getElementById('testimonialsCarousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', stopAutoPlay);
      carouselEl.addEventListener('mouseleave', startAutoPlay);
    }

    startAutoPlay();
  }

  /* -------------------------------------------------------------------------
     3. MENU MOBILE RESPONSIVO
     ------------------------------------------------------------------------- */
  if (navToggle && navWrapper) {
    navToggle.addEventListener('click', () => {
      const isOpen = navWrapper.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);

      const bars = navToggle.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(7.5px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-7.5px) rotate(-45deg)';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navWrapper.classList.contains('open')) {
          navWrapper.classList.remove('open');
          const bars = navToggle.querySelectorAll('span');
          bars[0].style.transform = 'none';
          bars[1].style.opacity = '1';
          bars[2].style.transform = 'none';
        }
      });
    });
  }

  /* -------------------------------------------------------------------------
     4. DESTAQUE DO MENU CONFORME A SEÇÃO ATIVA
     ------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));

  /* -------------------------------------------------------------------------
     5. FAQ SANFONA COM FECHAMENTO AUTOMÁTICO
     ------------------------------------------------------------------------- */
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    card.addEventListener('toggle', () => {
      if (card.open) {
        faqCards.forEach(other => {
          if (other !== card && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

});
