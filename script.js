const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function initYear(){
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

function initMobileNav(){
  const nav = $(".nav");
  const toggle = $("[data-nav-toggle]");
  const links = $("[data-nav-links]");
  if (!nav || !toggle || !links) return;

  const mq = window.matchMedia("(max-width: 768px)");

  const setOpen = (open) => {
    nav.setAttribute("data-open", open ? "true" : "false");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  const isOpen = () => nav.getAttribute("data-open") === "true";
  const isMobile = () => mq.matches;

  toggle.addEventListener("click", () => {
    if (!isMobile()) return;
    setOpen(!isOpen());
  });

  $$("a", links).forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", (e) => {
    if (!isMobile()) return;
    if (!isOpen()) return;
    if (!nav.contains(e.target)) setOpen(false);
  });

  mq.addEventListener?.("change", () => {
    setOpen(false);
  });

  setOpen(false);
}

function initForm(){
  const form = $("#contact-form");
  const status = $("[data-form-status]");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "Thanks you!";
    form.reset();
  });
}

// ---------- CHATBOT LOGIC ----------

function addMsg(container, text, who){
  const div = document.createElement("div");
  div.className = `msg msg--${who}`;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;

//   // Play sound on bot message
  if(who === "bot"){
    // Sound disabled - autoplay policy
    // const sound = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
    // sound.play();
  }
}

function botReply(userText){
  const t = userText.toLowerCase();

  if (t.includes("price") || t.includes("cost")) {
    return "💰 Website pricing starts from ₹5000. Tell me your requirement for exact quote.";
  }

  if (t.includes("service") || t.includes("services")) {
    return "🛠️ I offer:\n• Business Website\n• Ecommerce Website\n• Landing Page";
  }

  if (t.includes("time")) {
    return "⏱️ Usually 2–5 days for landing page and 1–2 weeks for full website.";
  }

  if (t.includes("contact") || t.includes("whatsapp") || t.includes("email")) {
    return "📞 WhatsApp: https://wa.me/7260081528\n📧 Email: yadavarvind7646@gmail.com";
  }

  return "👋 Hello! Ask me about pricing, services, or how to start your project.";
}

// Quick buttons for chatbot
function quickAsk(text){
  const msgs = document.querySelector("[data-chatbot-messages]");
  addMsg(msgs, text, "user");

  setTimeout(() => {
    addMsg(msgs, botReply(text), "bot");
  }, 500);
}

function initChatbot(){
  const root = $("[data-chatbot]");
  const toggle = $("[data-chatbot-toggle]");
  const close = $("[data-chatbot-close]");
  const panel = $("[data-chatbot-panel]");
  const form = $("[data-chatbot-form]");
  const msgs = $("[data-chatbot-messages]");

  if (!root || !toggle || !close || !panel || !form || !msgs) return;

  const setOpen = (open) => {
    root.setAttribute("data-open", open ? "true" : "false");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close AI chatbot" : "Open AI chatbot");
    if (open){
      const input = $("input[name='message']", form);
      if (input) input.focus();
    }
  };

  toggle.addEventListener("click", () => {
    const open = root.getAttribute("data-open") === "true";
    setOpen(!open);
  });

  close.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  root.addEventListener("click", (e) => {
    const open = root.getAttribute("data-open") === "true";
    if (!open) return;
    if (panel.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });

  // Auto greet with quick buttons
  function greetOnce(){
    if (msgs.childElementCount > 0) return;
    addMsg(msgs, "👋 Hello! How can I help you?", "bot");

    const quick = document.createElement("div");
    quick.className = "chatbot__quick";
    quick.innerHTML = `
      <button onclick="quickAsk('price')">💰 Price</button>
      <button onclick="quickAsk('services')">🛠️ Services</button>
      <button onclick="quickAsk('contact')">📞 Contact</button>
    `;
    msgs.appendChild(quick);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("input[name='message']", form);
    const val = (input && input.value) ? input.value.trim() : "";
    if (!val) return;

    addMsg(msgs, val, "user");
    if (input) input.value = "";

    // Typing animation
    addMsg(msgs, "Typing...", "bot");
    setTimeout(() => {
      msgs.lastChild.remove(); // remove typing
      addMsg(msgs, botReply(val), "bot");
    }, 800);
  });

  setOpen(false);
  greetOnce();

  // Auto greet tip
  setTimeout(() => {
    addMsg(msgs, "💡 Tip: Ask me about pricing or services!", "bot");
  }, 2000);
}

function initScrollToForm(){
  const btn = $("[data-scroll-to-form]");
  const form = $("#contact-form");
  if (!btn || !form) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    const first = $("input[name='name']", form);
    if (first) window.setTimeout(() => first.focus(), 350);
  });
}

function initStatsCountUp(){
  const section = $("#stats");
  const nums = $$(".stat__num[data-count]", section || document);
  if (!section || nums.length === 0) return;

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const animate = (el) => {
    const target = Number(el.getAttribute("data-count") || "0");
    if (!Number.isFinite(target) || target <= 0) return;

    const start = 0;
    const duration = 900;
    const t0 = performance.now();

    const format = (n) => n.toLocaleString("en-IN");

    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(start + (target - start) * eased);
      el.textContent = format(value);
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  let ran = false;
  const run = () => {
    if (ran) return;
    ran = true;
    nums.forEach(animate);
  };

  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)){
          run();
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(section);
  } else {
    run();
  }
}

function initTestimonialAnimation(){
  const section = document.querySelector(".testimonials-section");
  const cards = $$(".testimonials-grid > *", section || document);
  
  if (!section || cards.length === 0) return;
  
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    cards.forEach(card => card.classList.add("animate"));
    return;
  }
  
  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting){
            e.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.2 }
    );
    
    cards.forEach((card) => io.observe(card));
  } else {
    cards.forEach(card => card.classList.add("animate"));
  }
}

// ---------- INITIALIZE ----------
initYear();
initMobileNav();
initForm();
initChatbot();
initScrollToForm();
initStatsCountUp();
initTestimonialAnimation();

 
