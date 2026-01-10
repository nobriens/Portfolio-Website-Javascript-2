const HOVER_DELAY_MS = 200;
const FADE_DURATION_MS = 500;
const SLIDE_INTERVAL_MS = 3000;

document.addEventListener("DOMContentLoaded", () => {
  const configs = [
    {
      id: "ridewise-img",
      images: [
        "images/ridewise1.png",
        "images/ridewisehero.png",
        "images/ridewise5.png",
        "images/ridewise6.png"
      ]
    },
    {
      id: "aib-img",
      images: [
        "images/Aib1.png",
        "images/aib3.png",
        "images/aib5.png",
        "images/aib6.png"
      ]
    },
    {
      id: "peer2pal-img",
      images: [
        "images/peer2pal1.png",
        "images/peer2pal2.png",
        "images/peer2pal6.png",
        "images/peer2pal5.png"
      ]
    }
  ];

  configs.forEach(setupHoverFadeSlideshow);
});

function setupHoverFadeSlideshow({ id, images }) {
  const img = document.getElementById(id);
  if (!img) return;

  // Preload images to reduce flicker
  images.forEach((src) => {
    const i = new Image();
    i.src = src;
  });

  let index = 0;
  let intervalId = null;
  let startTimeout = null;

  function fadeToNextImage() {
    img.style.opacity = 0;

    setTimeout(() => {
      index = (index + 1) % images.length;
      img.src = images[index];
      img.style.opacity = 1;
    }, FADE_DURATION_MS);
  }

  img.addEventListener("mouseenter", () => {
    // small delay before starting
    startTimeout = setTimeout(() => {
      intervalId = setInterval(fadeToNextImage, SLIDE_INTERVAL_MS);
    }, HOVER_DELAY_MS);
  });

  img.addEventListener("mouseleave", () => {
    clearInterval(intervalId);
    clearTimeout(startTimeout);

    intervalId = null;
    startTimeout = null;

    // Reset to first image
    index = 0;

    img.style.opacity = 0;
    setTimeout(() => {
      img.src = images[index];
      img.style.opacity = 1;
    }, FADE_DURATION_MS);
  });
}