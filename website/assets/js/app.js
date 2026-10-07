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
const emailInput = registrationForm?.elements.namedItem("email");
const emailConfirmation = registrationForm?.elements.namedItem("emailConfirmation");
const universityInput = document.getElementById("university");
const facultyInput = document.getElementById("faculty");
const departmentInput = document.getElementById("department");
const academicStatus = document.getElementById("academicStatus");
const directoryRetry = document.getElementById("directoryRetry");
let universities = [];

function resetSelect(select, label, values = []) {
  select.replaceChildren(new Option(label, ""), ...values.map(value => new Option(value, value)));
  select.disabled = values.length === 0;
  select.setCustomValidity("");
}

function selectedUniversity() {
  return universities.find(university => university.name === universityInput.value);
}

function selectedFaculty() {
  return selectedUniversity()?.faculties.find(faculty => faculty.name === facultyInput.value);
}

function updateFaculties() {
  const university = selectedUniversity();
  resetSelect(facultyInput, "اختر الكلية / المعهد", university?.faculties.map(f => f.name) || []);
  resetSelect(departmentInput, "اختر الكلية أولًا");
  academicStatus.textContent = university
    ? (university.faculties.length ? "اختر الكلية ثم القسم التابع لها." : "لم تتوفر بعد قائمة موثقة للكليات والأقسام لهذه الجامعة. يرجى التواصل مع منظم الدورة.")
    : "اختر جامعة بسكرة ثم الكلية والقسم التابع لها.";
}

universityInput?.addEventListener("change", updateFaculties);
facultyInput?.addEventListener("change", () => {
  resetSelect(departmentInput, "اختر القسم / التخصص", selectedFaculty()?.departments || []);
});

async function loadUniversities() {
  resetSelect(universityInput, "جارٍ تحميل الجامعات...");
  resetSelect(facultyInput, "اختر الجامعة أولًا");
  resetSelect(departmentInput, "اختر الكلية أولًا");
  directoryRetry.hidden = true;
  try {
    const response = await fetch("assets/data/algerian-universities.json");
    if (!response.ok) throw new Error("Directory unavailable");
    const data = await response.json();
    if (!Array.isArray(data.universities) || !data.universities.length) throw new Error("Invalid directory");
    const biskra = data.universities.find(university => university.name === "جامعة بسكرة – محمد خيضر");
    const registrationFaculties = [
      ["كلية العلوم الدقيقة", "كلية العلوم الدقيقة"],
      ["كلية علوم الطبيعة و الحياة و علوم الأرض و الكون", "كلية علوم الطبيعة والحياة"],
      ["كلية العلوم والتكنولوجيا", "كلية العلوم والتكنولوجيا"]
    ];
    if (!biskra) throw new Error("Biskra directory unavailable");
    const faculties = registrationFaculties.map(([sourceName, name]) => {
      const faculty = biskra.faculties.find(item => item.name === sourceName);
      if (!faculty) throw new Error("Biskra faculty unavailable");
      return { ...faculty, name };
    });
    universities = [{ ...biskra, faculties }];
    resetSelect(universityInput, "اختر الجامعة", universities.map(u => u.name));
    academicStatus.textContent = "اختر جامعة بسكرة ثم الكلية والقسم التابع لها.";
  } catch (error) {
    resetSelect(universityInput, "تعذر تحميل الجامعات");
    academicStatus.textContent = "تعذر تحميل قوائم الجامعات. أعد المحاولة قبل إرسال طلب التسجيل.";
    directoryRetry.hidden = false;
  }
}

directoryRetry?.addEventListener("click", loadUniversities);
if (universityInput) loadUniversities();

function validateEmail() {
  const email = emailInput.value.trim();
  // Practical address syntax validation. Ownership requires a server-side verification message.
  const valid = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(email)
    && email.split("@")[0].length <= 64
    && email.split("@")[1]?.split(".").every(label => label.length <= 63)
    && !email.split("@")[0].startsWith(".")
    && !email.split("@")[0].endsWith(".")
    && !email.includes("..");
  emailInput.setCustomValidity(!email || valid ? "" : "أدخل بريدًا إلكترونيًا صحيحًا مثل name@example.com.");
  emailConfirmation.setCustomValidity(emailConfirmation.value.trim().toLowerCase() === email.toLowerCase()
    ? "" : "البريدان غير متطابقين. أعد كتابة البريد الإلكتروني نفسه.");
  return valid && emailConfirmation.validity.valid;
}

emailInput?.addEventListener("input", validateEmail);
emailConfirmation?.addEventListener("input", validateEmail);
emailInput?.addEventListener("blur", () => { emailInput.value = emailInput.value.trim(); validateEmail(); });
emailConfirmation?.addEventListener("blur", () => { emailConfirmation.value = emailConfirmation.value.trim(); validateEmail(); });

function resetRegistration() {
  registrationForm.reset();
  emailInput.setCustomValidity("");
  emailConfirmation.setCustomValidity("");
  updateFaculties();
}

registrationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  validateEmail();
  if (!registrationForm.reportValidity()) return;
  const university = selectedUniversity();
  const faculty = selectedFaculty();
  if (!university || !faculty || !faculty.departments.includes(departmentInput.value)) {
    formMessage.textContent = "اختر الجامعة والكلية والقسم من القوائم المتاحة قبل التسجيل.";
    formMessage.className = "form-message show";
    return;
  }

  if (new Date() > registrationDeadline) {
    formMessage.textContent = "انتهت فترة التسجيل لهذه الدورة.";
    formMessage.className = "form-message show";
    return;
  }

  const formData = new FormData(registrationForm);

  if (formData.get("_honey")) {
    formMessage.textContent = "تم إرسال طلب التسجيل بنجاح.";
    formMessage.className = "form-message show success";
    resetRegistration();
    return;
  }

  const payload = {
    "الاسم واللقب": formData.get("fullName"),
    "البريد الإلكتروني": formData.get("email").trim(),
    "رقم الهاتف": formData.get("phone"),
    "المؤسسة / الجامعة": formData.get("institution"),
    "الكلية / المعهد": formData.get("faculty"),
    "القسم / التخصص": formData.get("department"),
    "الصفة": formData.get("profile"),
    "_replyto": formData.get("email").trim(),
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

    if (!response.ok || (data.success !== true && data.success !== "true")) {
      throw new Error(data.message || "تعذر إرسال الطلب");
    }

    formMessage.textContent = "تم إرسال طلب التسجيل بنجاح. شكرًا لك، سنستخدم بياناتك فقط للتواصل المتعلق بالدورة.";
    formMessage.className = "form-message show success";
    resetRegistration();
  } catch (error) {
    console.error("Registration submission failed:", error);
    formMessage.textContent = "تعذر إرسال طلب التسجيل الآن. يرجى المحاولة مرة أخرى بعد قليل.";
    formMessage.className = "form-message show";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "إرسال طلب التسجيل";
  }
});
