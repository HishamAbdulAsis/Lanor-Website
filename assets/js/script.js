const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

const track = document.getElementById("carousel-track");
const items = document.querySelectorAll(".carousel-item");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let index = 1; // Start at first real slide (after lastClone)
let itemWidth = items[0].offsetWidth + 20; // Adjust as needed

// Clone first and last items for infinite effect
const firstClone = items[0].cloneNode(true);
const lastClone = items[items.length - 1].cloneNode(true);

firstClone.id = "first-clone";
lastClone.id = "last-clone";

track.appendChild(firstClone);
track.prepend(lastClone);

const allItems = document.querySelectorAll(".carousel-item");
const totalItems = allItems.length;

// Set initial position
track.style.transform = `translateX(-${itemWidth * index}px)`;

function updateCarousel() {
  track.style.transition = "transform 0.5s ease-in-out";
  track.style.transform = `translateX(-${itemWidth * index}px)`;
}

function nextSlide() {
  index++;
  updateCarousel();
}

function prevSlide() {
  index--;
  updateCarousel();
}

// Auto-slide every 2 seconds
let autoSlide = setInterval(nextSlide, 2000);

// Pause auto-slide on hover
track.addEventListener("mouseenter", () => clearInterval(autoSlide));
track.addEventListener("mouseleave", () => {
  autoSlide = setInterval(nextSlide, 2000);
});

// Looping fix on transition end
track.addEventListener("transitionend", () => {
  if (allItems[index].id === "first-clone") {
    track.style.transition = "none";
    index = 1;
    track.style.transform = `translateX(-${itemWidth * index}px)`;
  }
  if (allItems[index].id === "last-clone") {
    track.style.transition = "none";
    index = totalItems - 2;
    track.style.transform = `translateX(-${itemWidth * index}px)`;
  }
});

// Button event listeners
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Resize handler to recalc item width and adjust position
window.addEventListener("resize", () => {
  itemWidth = allItems[0].offsetWidth + 20;
  track.style.transition = "none";
  track.style.transform = `translateX(-${itemWidth * index}px)`;
});

function initMap() {
  const lanoraLocation = { lat: 25.2705, lng: 55.3075 }; // Replace with exact lat/lng of your shop
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: lanoraLocation,
  });

  new google.maps.Marker({
    position: lanoraLocation,
    map: map,
    title: "Lanora Gold LLC"
  });
}
