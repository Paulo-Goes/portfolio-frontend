const API = "https://portfolio-backend-xed8.onrender.com";

function setupCounter(inputId, counterId, max) {
  const input = document.getElementById(inputId);
  const counter = document.getElementById(counterId);
  if (!input || !counter) return;

  const update = () => {
    const len = input.value.length;
    counter.textContent = `${len} / ${max}`;

    counter.classList.remove("near-limit", "at-limit");
    if (len >= max) {
      counter.classList.add("at-limit");
    } else if (len >= max * 0.85) {
      counter.classList.add("near-limit");
    }
  };

  input.addEventListener("input", update);
  update();
}

setupCounter("contact-name", "name-counter", 100);
setupCounter("contact-email", "email-counter", 100);
setupCounter("contact-message", "message-counter", 1000);

function validateEmail(email) {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(
    email.trim(),
  );
}

function setInvalid(input, isInvalid) {
  if (isInvalid) {
    input.classList.add("invalid");
  } else {
    input.classList.remove("invalid");
  }
}

function validate(name, email, message) {
  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const msgInput = document.getElementById("contact-message");

  let valid = true;

  if (!name.trim()) {
    setInvalid(nameInput, true);
    valid = false;
  } else {
    setInvalid(nameInput, false);
  }

  if (!email.trim() || !validateEmail(email)) {
    setInvalid(emailInput, true);
    valid = false;
  } else {
    setInvalid(emailInput, false);
  }

  if (!message.trim()) {
    setInvalid(msgInput, true);
    valid = false;
  } else {
    setInvalid(msgInput, false);
  }

  return valid;
}

function showFeedback(type, message) {
  const el = document.getElementById("form-feedback");
  if (!el) return;
  el.className = `form-feedback ${type}`;
  el.textContent = message;
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideFeedback() {
  const el = document.getElementById("form-feedback");
  if (el) el.className = "form-feedback";
}

const submitBtn = document.getElementById("submit-btn");

submitBtn.addEventListener("click", async () => {
  hideFeedback();

  const name = document.getElementById("contact-name").value;
  const email = document.getElementById("contact-email").value;
  const message = document.getElementById("contact-message").value;

  if (!validate(name, email, message)) {
    showFeedback(
      "error",
      "Please fill in all fields correctly before sending.",
    );
    return;
  }

  submitBtn.classList.add("loading");
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${API}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Server error (${response.status})`,
      );
    }

    document.getElementById("contact-name").value = "";
    document.getElementById("contact-email").value = "";
    document.getElementById("contact-message").value = "";
    setupCounter("contact-name", "name-counter", 100);
    setupCounter("contact-email", "email-counter", 100);
    setupCounter("contact-message", "message-counter", 1000);

    showFeedback("success", "Message sent! I'll get back to you soon.");
  } catch (err) {
    console.error("Contact form error:", err);
    showFeedback(
      "error",
      err.message || "Something went wrong. Please try again later.",
    );
  } finally {
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }
});

["contact-name", "contact-email", "contact-message"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", () => setInvalid(el, false));
});
