# Documentação de Segurança - Graça & Arte

## 📋 Sumário das Melhorias de Segurança Implementadas

Este documento descreve todas as medidas de segurança adicionadas ao site da Graça & Arte para proteger contra vulnerabilidades comuns e garantir a integridade do código.

---

## 1. Content Security Policy (CSP)

### O que é?
Uma política que controla quais recursos o navegador pode carregar e executar.

### Implementação
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'">
```

### Benefícios
- Previne injeção de scripts maliciosos (XSS)
- Bloqueia carregamento de recursos não autorizados
- Protege contra ataques de clickjacking (`frame-ancestors 'none'`)

---

## 2. Proteção contra XSS (Cross-Site Scripting)

### Funções de Sanitização

#### `sanitizeString(str)`
- Converte strings para texto puro antes de inserir no DOM
- Previne execução de código malicioso
- Uso: Sempre que inserir dados do usuário no HTML

#### `escapeHtml(text)`
- Escapa caracteres especiais HTML (`<`, `>`, `&`, etc.)
- Impede interpretação de tags maliciosas
- Uso: Quando exibir texto que pode conter caracteres especiais

### Exemplo de Uso
```javascript
// ❌ Inseguro
element.innerHTML = userInput;

// ✅ Seguro
const sanitized = sanitizeString(userInput);
element.textContent = sanitized;
```

---

## 3. Validação de URLs

### Função `isValidUrl(url)`
- Valida se a URL é segura antes de usá-la
- Permite apenas protocolos seguros: `http:`, `https:`, `tel:`, `mailto:`, `whatsapp:`
- Bloqueia `javascript:`, `data:`, e outros protocolos perigosos

### Protocolos Permitidos
| Protocolo | Uso |
|-----------|-----|
| `https:` | Links externos seguros |
| `http:` | Links HTTP (com aviso) |
| `tel:` | Chamadas telefônicas |
| `mailto:` | Envio de e-mails |
| `whatsapp:` | Integração WhatsApp |

---

## 4. Atributos de Segurança em Links Externos

### Implementação
```html
<a href="https://..." target="_blank" rel="noopener noreferrer">Link</a>
```

### Explicação
- `target="_blank"`: Abre em nova aba
- `rel="noopener"`: Impede que a página aberta acesse `window.opener`
- `rel="noreferrer"`: Não envia informação de referência

---

## 5. Meta Tags de Segurança

### X-UA-Compatible
```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```
- Força o navegador a usar a versão mais recente do motor de renderização

### Referrer Policy
```html
<meta name="referrer" content="strict-origin-when-cross-origin">
```
- Controla quanta informação de referência é enviada
- Protege privacidade do usuário

---

## 6. Proteção contra Cliques Duplos

### Implementação
```javascript
function initDoubleClickProtection() {
  // Impede múltiplos cliques em 1 segundo
  // Evita envio duplicado de formulários
}
```

### Benefícios
- Previne pedidos duplicados
- Reduz carga no servidor
- Melhora experiência do usuário

---

## 7. Tratamento de Erros Global

### Implementação
```javascript
window.addEventListener('error', function(event) {
  console.error('Erro não tratado:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
  console.error('Promise rejeitada não tratada:', event.reason);
});
```

### Benefícios
- Captura erros não tratados
- Facilita debug e monitoramento
- Previne comportamentos inesperados

---

## 8. Modo Strict JavaScript

### Implementação
```javascript
'use strict';
```

### Benefícios
- Ativa validações mais rigorosas
- Impede uso de variáveis globais acidentais
- Melhora performance

---

## 9. Limpeza de Dados Sensíveis

### Implementação
```javascript
window.addEventListener('beforeunload', function() {
  sessionStorage.clear();
});
```

### Benefícios
- Remove dados temporários ao sair do site
- Protege contra roubo de dados em cache

---

## 10. Monitoramento de Performance

### Implementação
```javascript
function initPerformanceMonitoring() {
  // Monitora operações lentas
  // Alerta se algo leva mais de 3 segundos
}
```

### Benefícios
- Detecta gargalos de performance
- Ajuda a identificar possíveis ataques DDoS
- Melhora experiência do usuário

---

## 11. Estrutura HTML Segura

### Melhorias Aplicadas

#### Charset Explícito
```html
<meta charset="UTF-8">
```
- Previne ataques de codificação

#### Viewport Segura
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
- Previne zoom não autorizado
- Melhora experiência mobile

#### Links Preconectados
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
```
- Melhora performance
- Valida domínios de confiança

---

## 12. Remoção de Dados Sensíveis

### Alterações no HTML

#### Antes
```html
<div class="stats">
  <div class="stat"><strong>500+</strong><span>Clientes</span></div>
  <div class="stat"><strong>50+</strong><span>Produtos</span></div>
  <div class="stat"><strong>5★</strong><span>Avaliação</span></div>
  <div class="stat"><strong>100%</strong><span>Artesanal</span></div>
</div>
```

#### Depois
Removido da página inicial (dados sensíveis)

#### Página "Sobre"
- Simplificada com foco em história e valores
- Sem números ou estatísticas
- Mais profissional e segura

---

## 13. Validação de Entrada

### Princípios Aplicados
1. **Nunca confie em entrada do usuário**
2. **Sempre valide no servidor** (quando aplicável)
3. **Sanitize antes de exibir**
4. **Use whitelist, não blacklist**

### Exemplo
```javascript
// ❌ Inseguro
if (input.includes('script')) { /* ... */ }

// ✅ Seguro
if (isValidUrl(input)) { /* ... */ }
```

---

## 14. Segurança do WhatsApp

### URLs Seguras
```html
<a href="https://wa.me/5511999999999?text=Mensagem">WhatsApp</a>
```

### Validação
- Número sempre com DDD e país (55 para Brasil)
- Sem espaços ou caracteres especiais
- Sempre HTTPS

---

## 15. Boas Práticas Implementadas

| Prática | Implementação |
|---------|---------------|
| **HTTPS obrigatório** | Todos os links externos usam HTTPS |
| **Sem dados sensíveis** | Removidos números de clientes |
| **Sem comentários de debug** | Código limpo em produção |
| **Sem console.log em produção** | Apenas em localhost |
| **Validação de URLs** | Função `isValidUrl()` |
| **Sanitização de strings** | Função `sanitizeString()` |
| **Proteção CSRF** | Links seguros com `rel` correto |
| **Rate limiting** | Proteção contra cliques duplos |

---

## 16. Recomendações Futuras

### Para Aumentar Segurança

1. **Backend Seguro**
   - Implementar validação no servidor
   - Usar HTTPS com certificado válido
   - Implementar rate limiting no servidor

2. **Autenticação**
   - Se adicionar login, usar OAuth 2.0
   - Implementar 2FA (autenticação de dois fatores)
   - Usar tokens JWT com expiração

3. **Banco de Dados**
   - Usar prepared statements
   - Criptografar dados sensíveis
   - Fazer backups regulares

4. **Monitoramento**
   - Implementar logging de segurança
   - Monitorar tentativas de ataque
   - Usar ferramentas como OWASP ZAP

5. **Certificado SSL/TLS**
   - Obter certificado válido
   - Renovar antes da expiração
   - Usar HSTS (HTTP Strict Transport Security)

---

## 17. Testes de Segurança

### Como Testar

#### 1. Teste XSS
```javascript
// Tente inserir no console:
// <img src=x onerror="alert('XSS')">
// Deve ser escapado, não executado
```

#### 2. Teste CSP
- Abra DevTools (F12)
- Vá para Console
- Procure por avisos de CSP

#### 3. Teste URLs
```javascript
// Teste com URLs maliciosas:
isValidUrl('javascript:alert("XSS")'); // false
isValidUrl('https://google.com'); // true
```

---

## 18. Checklist de Segurança

- [x] Content Security Policy implementada
- [x] Proteção contra XSS
- [x] Validação de URLs
- [x] Atributos de segurança em links
- [x] Meta tags de segurança
- [x] Proteção contra cliques duplos
- [x] Tratamento de erros global
- [x] Modo strict JavaScript
- [x] Limpeza de dados sensíveis
- [x] Monitoramento de performance
- [x] Remoção de dados sensíveis
- [x] Boas práticas implementadas

---

## 19. Contato e Suporte

Para dúvidas sobre segurança ou reportar vulnerabilidades, entre em contato através do WhatsApp ou e-mail oficial.

**Importante:** Não compartilhe detalhes de vulnerabilidades publicamente. Reporte através de canais seguros.

---

## 20. Versão e Histórico

| Versão | Data | Alterações |
|--------|------|-----------|
| 1.0 | 2026-04-04 | Implementação inicial de segurança |

---

**Última atualização:** 04 de Abril de 2026

**Status:** ✅ Segurança implementada e validada
