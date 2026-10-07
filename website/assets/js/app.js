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
const submitButton = registrationForm?.querySelector('button[type="submit"]');

registrationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (new Date() > registrationDeadline) {
    formMessage.textContent = "انتهت فترة التسجيل لهذه الدورة.";
    formMessage.className = "form-message show";
    return;
  }

  const formData = new FormData(registrationForm);

  if (formData.get("_honey")) {
    formMessage.textContent = "تم إرسال طلب التسجيل بنجاح.";
    formMessage.className = "form-message show success";
    registrationForm.reset();
    return;
  }

  const payload = {
    "الاسم واللقب": formData.get("fullName"),
    "البريد الإلكتروني": formData.get("email"),
    "رقم الهاتف": formData.get("phone"),
    "المؤسسة / الجامعة": formData.get("institution"),
    "الصفة": formData.get("profile"),
    "التخصص": formData.get("specialty"),
    "وقت التسجيل": new Intl.DateTimeFormat("ar-DZ", {
      dateStyle: "full",
      timeStyle: "medium",
      timeZone: "Africa/Algiers"
    }).format(new Date()),
    "_subject": "طلب تسجيل جديد - دورة الذكاء الاصطناعي 26 نوفمبر 2026",
    "_template": "table",
    "_url": window.location.href
  };

  submitButton.disabled = true;
  submitButton.textContent = "جارٍ إرسال الطلب...";
  formMessage.textContent = "يتم الآن إرسال بيانات التسجيل...";
  formMessage.className = "form-message show";

  try {
    const response = await fetch("https://formsubmit.co/ajax/phychy1001@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "تعذر إرسال الطلب");
    }

    formMessage.textContent = "تم إرسال طلب التسجيل بنجاح. شكرًا لك، سنستخدم بياناتك فقط للتواصل المتعلق بالدورة.";
    formMessage.className = "form-message show success";
    registrationForm.reset();
  } catch (error) {
    console.error("Registration submission failed:", error);
    formMessage.textContent = "تعذر إرسال طلب التسجيل الآن. يرجى المحاولة مرة أخرى بعد قليل.";
    formMessage.className = "form-message show";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "إرسال طلب التسجيل";
  }
});
