// Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Section Arrow Navigation
const nextSectionArrow = document.getElementById('nextSection');
const footer = document.querySelector('footer');

function toggleNextSectionArrow() {
  if (!nextSectionArrow || !footer) return;
  
  const footerRect = footer.getBoundingClientRect();
  const isFooterVisible = footerRect.top <= window.innerHeight;

  const productSection = document.getElementById('products');
  const productRect = productSection ? productSection.getBoundingClientRect() : null;
  const isProductVisible = productRect ? (productRect.top <= window.innerHeight && productRect.bottom >= 0) : false;
  
  // Hide arrow if footer or product section is visible
  if (isFooterVisible || isProductVisible) {
    nextSectionArrow.style.opacity = '0';
    nextSectionArrow.style.pointerEvents = 'none';
  } else {
    nextSectionArrow.style.opacity = '1';
    nextSectionArrow.style.pointerEvents = 'auto';
  }
}

if (nextSectionArrow) {
  let isScrolling = false;

  // Handle click event
  nextSectionArrow.addEventListener('click', () => {
    if (isScrolling) return; // Prevent multiple clicks during scroll
    
    const sections = Array.from(document.querySelectorAll('section'));
    const viewportHeight = window.innerHeight;
    
    // Find the current section
    const currentSectionIndex = sections.findIndex(section => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      return sectionCenter > -50 && sectionCenter < viewportHeight;
    });
    
    // Scroll to next section
    if (currentSectionIndex < sections.length - 1) {
      isScrolling = true;
      const nextSection = sections[currentSectionIndex + 1];
      
      // Disable AOS animations temporarily
      nextSection.setAttribute('data-aos-delay', '0');
      nextSection.setAttribute('data-aos-duration', '0');
      
      // Scroll to next section
      const offset = nextSection.offsetTop;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });

      // Re-enable AOS animations after scroll
      setTimeout(() => {
        nextSection.removeAttribute('data-aos-delay');
        nextSection.removeAttribute('data-aos-duration');
        isScrolling = false;
      }, 1000);
    }
  });

  // Show/hide arrow on scroll
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      toggleNextSectionArrow();
      isScrolling = false;
    }, 150);
  });

  // Initial check
  toggleNextSectionArrow();
}

// Back to Top functionality
const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Google Maps
function initMap() {
  const location = { lat: 25.2697, lng: 55.2985 }; // Dubai coordinates
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: location,
    styles: [
      {
        elementType: 'geometry',
        stylers: [{ color: '#242f3e' }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#242f3e' }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{ color: '#746855' }]
      }
    ]
  });
  
  new google.maps.Marker({
    position: location,
    map: map,
    title: 'Lanora Gold LLC'
  });
}

// Product Carousel
const track = document.getElementById("carousel-track");
const items = document.querySelectorAll(".carousel-item");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let index = 0;  // Start at first slide
let itemWidth = items[0].offsetWidth + 20;  // Width + gap

// Set initial position
track.style.transform = `translateX(0)`;

function updateCarousel() {
  track.style.transition = "transform 0.5s ease-in-out";
  track.style.transform = `translateX(-${itemWidth * index}px)`;
}

function nextSlide() {
  if (index >= items.length - 1) {
    index = 0;
  } else {
    index++;
  }
  updateCarousel();
}

function prevSlide() {
  if (index <= 0) {
    index = items.length - 1;
  } else {
    index--;
  }
  updateCarousel();
}

// Button event listeners
nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

// Resize handler to recalc item width and adjust position
window.addEventListener("resize", () => {
  itemWidth = items[0].offsetWidth + 20;  // Width + gap
  updateCarousel();
});

// Hero Section Slideshow
document.addEventListener('DOMContentLoaded', function() {
  const heroImages = [
    'assets/images/hero.jpg',
    'assets/images/pamp.jpg',
    'assets/images/gold-coin.jpg'
  ];

  const heroImg = document.getElementById('hero-slideshow');
  if (!heroImg) {
    console.error('Hero slideshow element not found');
    return;
  }

  let currentIndex = 0;
  let isTransitioning = false;

  // Preload all images first
  Promise.all(heroImages.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  }))
  .then(() => {
    console.log('All hero images preloaded');
    startSlideshow();
  })
  .catch(error => {
    console.error('Error preloading hero images:', error);
  });

  function startSlideshow() {
    // Set initial state
    heroImg.style.opacity = '1';
    heroImg.style.transform = 'scale(1)';

    setInterval(nextImage, 8000); // Show each image for 8 seconds
  }

  function nextImage() {
    if (isTransitioning) return;
    isTransitioning = true;

    // Start zoom effect
    heroImg.style.transform = 'scale(1.08)';

    // After zoom, start fade out
    setTimeout(() => {
      heroImg.style.opacity = '0';

      // After fade out, change image
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % heroImages.length;
        heroImg.src = heroImages[currentIndex];
        heroImg.style.transform = 'scale(1)';

        // Fade in new image
        setTimeout(() => {
          heroImg.style.opacity = '1';
          isTransitioning = false;
        }, 100);
      }, 1500); // Increased fade out duration
    }, 3000); // Increased zoom duration
  }
});
