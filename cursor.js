const cursorTag = document.querySelector(".cursors"); //Selects the main cursor container
const balls = cursorTag.querySelectorAll("div"); // Gets all the individual cursor circles
const ballMessage = cursorTag.querySelector("div span") //This span was used to show the “Learn More” text
const images = document.querySelectorAll("img[data-hover]") // And this selects any images that have a data hover attribute

let aimX = 0; //Stores where the mouse is aiming
let aimY = 0;

balls.forEach((ball, index) => { //Loops through each cursor ball to create the trailing effect
  let currentX = 0;
  let currentY = 0;

  const speed = 0.3 - index * 0.015; //Here I adjusted the speed for each ball to create the trail

  function animate() { // This function runs every frame
    currentX += (aimX - currentX) * speed; // Moves them towards the mouse position
    currentY += (aimY - currentY) * speed;

    ball.style.left = currentX + "px"; // Updates the ball position
    ball.style.top = currentY + "px";

    requestAnimationFrame(animate);
  }

  animate(); //Starts the animation for the ball
})

document.addEventListener("mousemove", (event) => { // Tracks the mouse position on the screen
  aimX = event.clientX;
  aimY = event.clientY;
})

images.forEach(image => {  // When hovering over an image it show the message learn more
    image.addEventListener("mouseover", function () {
      ballMessage.classList.add("visible")
      ballMessage.innerHTML = image.getAttribute("data-hover")
    })

    image.addEventListener("mouseout", function (){ //Then hides the message when the mouse leaves the image
      ballMessage.classList.remove("visible")
    })

})
