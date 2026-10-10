// ---- Contact settings --------------------------------------------------
// Set FORM_ENDPOINT to a form backend (e.g. https://formspree.io/f/xxxx) to
// receive submissions. If left empty, the form opens the visitor's email app
// addressed to CONTACT_EMAIL instead.
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "hello@example.com";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Sticky nav border + mobile menu
const nav = document.querySelector(".nav");
const toggle = document.getElementById("navToggle");

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 10);
}, { passive: true });

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav__links a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Reveal on scroll + animated counters
const formatNumber = (n) => Math.round(n).toLocaleString("en-US");

function animateCount(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = formatNumber(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    const counter = entry.target.querySelector("[data-count]");
    if (counter) animateCount(counter);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ROI calculator
const AUTOMATABLE_SHARE = 0.7;
const WEEKS_PER_YEAR = 52;
const roiInputs = {
  people: document.getElementById("inPeople"),
  hours: document.getElementById("inHours"),
  rate: document.getElementById("inRate"),
};
const roiOutputs = {
  people: document.getElementById("outPeople"),
  hours: document.getElementById("outHours"),
  rate: document.getElementById("outRate"),
};

function updateRoi() {
  const people = Number(roiInputs.people.value);
  const hours = Number(roiInputs.hours.value);
  const rate = Number(roiInputs.rate.value);
  roiOutputs.people.textContent = people;
  roiOutputs.hours.textContent = hours;
  roiOutputs.rate.textContent = rate;

  const savedHours = people * hours * WEEKS_PER_YEAR * AUTOMATABLE_SHARE;
  document.getElementById("resHours").textContent = formatNumber(savedHours);
  document.getElementById("resMoney").textContent = "$" + formatNumber(savedHours * rate);
}
Object.values(roiInputs).forEach((input) => input.addEventListener("input", updateRoi));
updateRoi();

// Contact form
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

function setStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className = "form__status " + (type || "");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const ok = field.value.trim() !== "" && (field.type !== "email" || /^\S+@\S+\.\S+$/.test(field.value));
    field.classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    setStatus("Please fill in your name, a valid email, and what you'd like to automate.", "err");
    return;
  }

  const data = Object.fromEntries(new FormData(form));

  if (!FORM_ENDPOINT) {
    const subject = encodeURIComponent(`Free automation audit — ${data.company || data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\n\n${data.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("Opening your email app…", "ok");
    return;
  }

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  setStatus("Sending…");
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.statusText);
    form.reset();
    setStatus("Thanks! We'll be in touch within 24 hours.", "ok");
  } catch {
    setStatus(`Something went wrong. Please email us at ${CONTACT_EMAIL}.`, "err");
  } finally {
    button.disabled = false;
  }
});
