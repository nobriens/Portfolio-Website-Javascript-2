const form = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const errorElement = document.getElementById("form-error");
const statusElement = document.getElementById("form-status");
const countElement = document.getElementById("message-count");
let messageCount = Number(localStorage.getItem("messageCount")) || 0;

if (countElement) {
  countElement.textContent = messageCount;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let messages = [];

  if (nameInput.value.trim() === "") {
    messages.push("Name is required");
  }

  const email = emailInput.value.trim();
  if (email === "" || !email.includes("@") || !email.includes(".")) {
    messages.push("Please enter a valid email address");
  }

  if (messageInput.value.trim().length < 10) {
    messages.push("Message must be at least 10 characters");
  }

  if (messages.length > 0) {
    errorElement.innerText = messages.join(", ");
    errorElement.classList.add("show");
    statusElement.textContent = "";
    return;
  }

  errorElement.innerText = "";
  errorElement.classList.remove("show");
  statusElement.textContent = "Sending…";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Form submission failed");

    statusElement.textContent = "Your message was sent, I look forward to hearing from you ";
    form.reset();

    messageCount++;
    localStorage.setItem("messageCount", messageCount);
    countElement.textContent = messageCount;
  } catch (err) {
    console.error(err);
    statusElement.textContent =
      "Something went wrong. Please try again";
  }
});
