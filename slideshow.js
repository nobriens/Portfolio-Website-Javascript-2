// So this is the fix for the duplicated JS files from my initial portfolio 
const HOVER_DELAY_MS = 200; // These are just settings
const FADE_DURATION_MS = 500;
const SLIDE_INTERVAL_MS = 3000;

document.addEventListener("DOMContentLoaded", () => { // Waits until the  HTML page has loaded before running anything
  const configs = [ // I made a simple config list so I can reuse the same slideshow code for multiple project images instead of writing it 3 times
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

  configs.forEach(setupHoverFadeSlideshow); // Sest up a slideshow for each config item
});

function setupHoverFadeSlideshow({ id, images }) { // This function sets up the hover slideshow for one image element
  const img = document.getElementById(id);
  if (!img) return;   // If this image doesn’t exist on the page it stops here so there arent any errors on other pages

  // Preload images to reduce flicker
  images.forEach((src) => {
    const i = new Image();
    i.src = src;
  });

  let index = 0; // Keeps track of which image is currently showing
  let intervalId = null; // These are used so I can stop the slideshow cleanly
  let startTimeout = null;

  function fadeToNextImage() { //This changes the image with a fade effect
    img.style.opacity = 0;

    setTimeout(() => { // After the fade duration it swaps the image and fades back in
      index = (index + 1) % images.length;
      img.src = images[index];
      img.style.opacity = 1;
    }, FADE_DURATION_MS);
  }

  img.addEventListener("mouseenter", () => { // small delay before starting
    startTimeout = setTimeout(() => {
      intervalId = setInterval(fadeToNextImage, SLIDE_INTERVAL_MS);
    }, HOVER_DELAY_MS);
  });

  img.addEventListener("mouseleave", () => { // When the user stops hovering it stops everything and resets back to the first image
    clearInterval(intervalId);
    clearTimeout(startTimeout);

    intervalId = null;
    startTimeout = null;

    index = 0; // Resets to first image

    img.style.opacity = 0;
    setTimeout(() => {
      img.src = images[index];
      img.style.opacity = 1;
    }, FADE_DURATION_MS);
  });

}


