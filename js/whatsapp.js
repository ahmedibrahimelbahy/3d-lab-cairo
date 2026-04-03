// ======================================
// WHATSAPP CONFIGURATION
// Replace PHONE_NUMBER with your actual Egyptian WhatsApp number
// Format: country code + number, no + sign (e.g., 201234567890)
// ======================================
const WA_CONFIG = {
  phone: '201234567890', // <-- REPLACE THIS
  messages: {
    nav:    "Hello 3D Lab! I'd like to start an order.",
    hero:   "Hello 3D Lab! I found you on your website and want to start a 3D printing order.",
    hiw:    "Hello 3D Lab! I just read about your process — I'm ready to get started!",
    cta:    "Hello 3D Lab! I'm ready to print — what do I need to send you?",
    footer: "Hello 3D Lab! Reaching out from your website.",
    float:  "Hello 3D Lab! I have a quick question about 3D printing.",
  }
};

function buildWAUrl(context) {
  const msg = WA_CONFIG.messages[context] || WA_CONFIG.messages.nav;
  return `https://wa.me/${WA_CONFIG.phone}?text=${encodeURIComponent(msg)}`;
}

function initWhatsApp() {
  // Standard context-based buttons
  document.querySelectorAll('[data-wa]').forEach(el => {
    const ctx = el.dataset.wa;
    el.href = buildWAUrl(ctx);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  // Custom message buttons (service card micro-CTAs, FAQ, etc.)
  document.querySelectorAll('[data-wa-msg]').forEach(el => {
    const msg = el.dataset.waMsg;
    el.href = `https://wa.me/${WA_CONFIG.phone}?text=${encodeURIComponent(msg)}`;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });
}

document.addEventListener('DOMContentLoaded', initWhatsApp);
