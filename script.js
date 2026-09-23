// =========================
// Contact Form
// =========================

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    formStatus.textContent =
      "Please complete all required fields correctly.";
    return;
  }

  formStatus.textContent =
    "Your message has been submitted successfully.";

  contactForm.reset();
});


// =========================
// Accessible Modal Dialog
// =========================

const openDialog = document.getElementById("openDialog");
const closeDialog = document.getElementById("closeDialog");
const infoDialog = document.getElementById("infoDialog");

openDialog.addEventListener("click", function () {
  infoDialog.showModal();
});

closeDialog.addEventListener("click", function () {
  infoDialog.close();
});


// =========================
// Escape Key Support
// =========================

infoDialog.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    infoDialog.close();
  }
});