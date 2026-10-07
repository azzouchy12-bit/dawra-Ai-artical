const registrationDeadline = new Date("2026-11-16T23:59:59+01:00");

function updateCountdown() {
  const now = new Date();
  const diff = registrationDeadline - now;

  const ids = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  if (diff <= 0) {
    Object.values(ids).forEach((el) => el && (el.textContent = "00"));
    const label = document.querySelector(".countdown-label");
    if (label) label.textContent = "انتهت فترة التسجيل";
    const registerButton = document.querySelector(".countdown-card .btn");
    if (registerButton) {
      registerButton.textContent = "التسجيل مغلق";
      registerButton.classList.add("is-disabled");
      registerButton.setAttribute("aria-disabled", "true");
    }
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  ids.days.textContent = String(days).padStart(2, "0");
  ids.hours.textContent = String(hours).padStart(2, "0");
  ids.minutes.textContent = String(minutes).padStart(2, "0");
  ids.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const registrationForm = document.getElementById("registrationForm");
const formMessage = document.getElementById("formMessage");

registrationForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (new Date() > registrationDeadline) {
    formMessage.textContent = "انتهت فترة التسجيل لهذه الدورة.";
    formMessage.className = "form-message show";
    return;
  }

  formMessage.textContent = "تم التحقق من الاستمارة بنجاح. هذه نسخة الواجهة فقط؛ سنربط زر الإرسال بقاعدة التسجيل بعد اعتماد التصميم.";
  formMessage.className = "form-message show success";
});
