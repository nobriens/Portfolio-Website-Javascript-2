document.addEventListener("DOMContentLoaded", () => { // Waits until the page has fully loaded before running the script
  const toggle = document.getElementById("theme-toggle");  // Select the light and dark mode toggle checkbox
  if (!toggle) return; // If there is no toggle on the page it will stop the script

  // Loads devices saved preference if visited before and applys it
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => { // Listens for when the user changes the toggle
    const isLight = toggle.checked;

    document.body.classList.toggle("light", isLight); // Adds or removes the light class on the body
    localStorage.setItem("theme", isLight ? "light" : "dark"); // Saves the user’s preference so it stays across all pages
  });

});
