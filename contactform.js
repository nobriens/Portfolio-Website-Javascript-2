const form = document.getElementById("contact-form"); // This grabbed the form and all the inputs I needed to work with
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const errorElement = document.getElementById("form-error"); // These elements are used to show feedback to the user
const statusElement = document.getElementById("form-status");
const countElement = document.getElementById("message-count");
let messageCount = Number(localStorage.getItem("messageCount")) || 0; // It stored how many messages have been sent on the visitors device using localstorage

if (countElement) {
  countElement.textContent = messageCount;
}

form.addEventListener("submit", async (e) => { // This listens for when the user submits the form and stops it from refreshing
  e.preventDefault();

  let messages = [];

  if (nameInput.value.trim() === "") { //To check that the name field isn’t empty
    messages.push("Name is required");
  }

  const email = emailInput.value.trim(); // This validated the email by making sure it looks like an email
  if (email === "" || !email.includes("@") || !email.includes(".")) {
    messages.push("Please enter a valid email address");
  }

  if (messageInput.value.trim().length < 10) { //Makes sure the message isn’t too short
    messages.push("Message must be at least 10 characters");
  }

  if (messages.length > 0) { // If there are any validation errors, this shows them and stops the form from submitting
    errorElement.innerText = messages.join(", ");
    errorElement.classList.add("show");
    statusElement.textContent = "";
    return;
  }

  errorElement.innerText = "";
  errorElement.classList.remove("show");
  statusElement.textContent = "Sending…";

  try { 
    const response = await fetch(form.action, { // sends the form data to Formspree using fetch
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error("Form submission failed");

    statusElement.textContent = "Your message was sent, I look forward to hearing from you "; // shows a success message and then resets the form
    form.reset();

    messageCount++;  // Here it updates the message counter
    localStorage.setItem("messageCount", messageCount);
    countElement.textContent = messageCount;
  } catch (err) {  // Then if anything fails it will shows a fallback message
    console.error(err);
    statusElement.textContent =
      "Something went wrong. Please try again";
  }
});

