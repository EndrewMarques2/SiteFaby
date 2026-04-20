/**
 * Graça & Arte - Script Principal
 * Segurança: Proteção contra XSS, validação de entrada e sanitização
 */

'use strict';

// ============================================================================
// CONFIGURAÇÃO DE SEGURANÇA
// ============================================================================

/**
 * Sanitiza strings para prevenir XSS
 * @param {string} str - String a ser sanitizada
 * @returns {string} String sanitizada
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Valida URLs para garantir que são seguras
 * @param {string} url - URL a ser validada
 * @returns {boolean} True se a URL é segura
 */
function isValidUrl(url) {
  if (typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    // Apenas permite protocolos seguros
    return ['http:', 'https:', 'tel:', 'mailto:', 'whatsapp:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Escapa caracteres especiais HTML
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, char => map[char]);
}

// ============================================================================
// MENU MOBILE
// ============================================================================

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuToggle || !navLinks) return;
  
  menuToggle.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
  });
  
  // Fecha menu ao clicar em um link
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
    });
  });
  
  // Fecha menu ao clicar fora
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.nav') && navLinks.classList.contains('active')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
    }
  });
}

// ============================================================================
// FILTRO DE PRODUTOS
// ============================================================================

function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const products = document.querySelectorAll('.product');
  const emptyState = document.querySelector('.empty-state');
  
  if (filterBtns.length === 0) return;
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Atualiza botão ativo
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filtra produtos
      let visibleCount = 0;
      products.forEach(product => {
        const tipo = product.getAttribute('data-tipo');
        const shouldShow = filter === 'todos' || tipo === filter;
        
        if (shouldShow) {
          product.style.display = '';
          visibleCount++;
        } else {
          product.style.display = 'none';
        }
      });
      
      // Mostra mensagem se nenhum produto encontrado
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  });
}

// ============================================================================
// SCROLL REVEAL (ANIMAÇÃO AO SCROLL)
// ============================================================================

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (reveals.length === 0 || !('IntersectionObserver' in window)) {
    // Fallback: mostra todos os elementos se IntersectionObserver não for suportado
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );
  
  reveals.forEach(el => observer.observe(el));
}

// ============================================================================
// VALIDAÇÃO DE LINKS EXTERNOS
// ============================================================================

function initExternalLinks() {
  const links = document.querySelectorAll('a[target="_blank"]');
  
  links.forEach(link => {
    // Valida URL
    const href = link.getAttribute('href');
    if (!isValidUrl(href)) {
      link.setAttribute('href', '#');
      link.style.cursor = 'not-allowed';
      link.setAttribute('title', 'Link inválido');
    }
    
    // Adiciona atributos de segurança
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

// ============================================================================
// PROTEÇÃO CONTRA CLIQUES DUPLOS
// ============================================================================

function initDoubleClickProtection() {
  const buttons = document.querySelectorAll('.btn');
  const clickTimeout = {};
  
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const btnId = this.getAttribute('data-btn-id') || Math.random().toString();
      
      if (clickTimeout[btnId]) {
        e.preventDefault();
        return;
      }
      
      clickTimeout[btnId] = true;
      setTimeout(() => {
        delete clickTimeout[btnId];
      }, 1000);
    });
  });
}

// ============================================================================
// MONITORAMENTO DE PERFORMANCE
// ============================================================================

function initPerformanceMonitoring() {
  if (!('PerformanceObserver' in window)) return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log apenas para desenvolvimento
        if (entry.duration > 3000) {
          console.warn(`Performance: ${entry.name} levou ${entry.duration.toFixed(2)}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  } catch (error) {
    console.error('Erro ao inicializar monitoramento de performance:', error);
  }
}

// ============================================================================
// INICIALIZAÇÃO PRINCIPAL
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
  try {
    // Inicializa funcionalidades
    initMobileMenu();
    initProductFilter();
    initScrollReveal();
    initExternalLinks();
    initDoubleClickProtection();
    initPerformanceMonitoring();
    
    // Log de inicialização (apenas em desenvolvimento)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('✓ Graça & Arte - Inicialização completa');
    }
  } catch (error) {
    console.error('Erro durante inicialização:', error);
  }
});

// ============================================================================
// TRATAMENTO DE ERROS GLOBAL
// ============================================================================

window.addEventListener('error', function(event) {
  console.error('Erro não tratado:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
  console.error('Promise rejeitada não tratada:', event.reason);
});

// ============================================================================
// LIMPEZA AO DESCARREGAR
// ============================================================================

window.addEventListener('beforeunload', function() {
  // Limpa dados sensíveis se necessário
  sessionStorage.clear();
});
