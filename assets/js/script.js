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

let currentIndex = 0;
const itemsPerView = 3;
let autoScrollInterval;

// Clone items for infinite loop
function setupInfiniteLoop() {
  // Clone all items
  const allItems = Array.from(items);
  allItems.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });
}

setupInfiniteLoop();

function updateCarousel(direction = 'next') {
  const itemWidth = 100 / itemsPerView;
  
  if (direction === 'next') {
    currentIndex++;
    if (currentIndex >= items.length) {
      // When we reach the end of cloned items, seamlessly jump back
      setTimeout(() => {
        track.style.transition = 'none';
        currentIndex = 0;
        track.style.transform = `translateX(0)`;
        // Force reflow
        track.offsetHeight;
        track.style.transition = 'transform 0.5s ease-in-out';
      }, 500);
    }
  } else {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = items.length - 1;
      track.style.transform = `translateX(-${itemWidth * items.length}%)`;
    }
  }

  const translateValue = itemWidth * currentIndex;
  track.style.transform = `translateX(-${translateValue}%)`;
}

function startAutoScroll() {
  stopAutoScroll();
  autoScrollInterval = setInterval(() => {
    updateCarousel('next');
  }, 2000);
}

function stopAutoScroll() {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }
}

// Event Listeners
nextBtn.addEventListener("click", () => {
  stopAutoScroll();
  updateCarousel('next');
  startAutoScroll();
});

prevBtn.addEventListener("click", () => {
  stopAutoScroll();
  updateCarousel('prev');
  startAutoScroll();
});

// Pause auto-scroll on hover
track.addEventListener('mouseenter', stopAutoScroll);
track.addEventListener('mouseleave', startAutoScroll);

// Start auto-scrolling
startAutoScroll();

// Handle resize
window.addEventListener("resize", () => {
  const itemWidth = 100 / itemsPerView;
  const translateValue = itemWidth * currentIndex;
  track.style.transform = `translateX(-${translateValue}%)`;
});

// Hero Section Slideshow
document.addEventListener('DOMContentLoaded', function() {
  const heroImages = [
    'assets/images/hero.jpg',
    'assets/images/pamp-gold-bar-collection.jpg',
    'assets/images/pamp-platinum-bar-collection.jpg'
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

    // Start the slideshow loop
    setInterval(nextImage, 8000); // Change image every 8 seconds
  }

  function nextImage() {
    if (isTransitioning) return;
    isTransitioning = true;

    // Start zoom effect
    heroImg.style.transform = 'scale(1.08)';
    
    setTimeout(() => {
      // Fade out
      heroImg.style.opacity = '0';
      
      setTimeout(() => {
        // Change image and reset transform
        currentIndex = (currentIndex + 1) % heroImages.length;
        heroImg.src = heroImages[currentIndex];
        heroImg.style.transform = 'scale(1)';
        
        // Fade in new image
        setTimeout(() => {
          heroImg.style.opacity = '1';
          isTransitioning = false;
        }, 100);
      }, 1500); // Fade out duration
    }, 3000); // Zoom duration
  }
});

// Taglines Animation
function initTaglinesAnimation() {
  const taglines = document.querySelectorAll('.tagline');
  let currentIndex = 0;

  // Show first tagline
  taglines[0].classList.add('active');

  function nextTagline() {
    // Remove active class from current tagline
    taglines[currentIndex].classList.remove('active');
    taglines[currentIndex].classList.add('exit');

    // Update index
    currentIndex = (currentIndex + 1) % taglines.length;

    // Add active class to next tagline
    setTimeout(() => {
      taglines.forEach(tagline => tagline.classList.remove('exit'));
      taglines[currentIndex].classList.add('active');
    }, 600);
  }

  // Change tagline every 4 seconds
  setInterval(nextTagline, 4000);
}

// Initialize taglines animation when DOM is loaded
document.addEventListener('DOMContentLoaded', initTaglinesAnimation);

// Parallax effect
document.addEventListener('DOMContentLoaded', function() {
  const parallaxBg = document.querySelector('.parallax-bg');
  const whyUsSection = document.querySelector('.why-us-section');
  
  if (!parallaxBg || !whyUsSection) return;

  function updateParallax() {
    if (window.innerWidth <= 768) {
      parallaxBg.style.transform = 'none';
      return;
    }

    const rect = whyUsSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionTop = rect.top;
    
    // Only update when section is visible
    if (sectionTop < viewportHeight && sectionTop > -rect.height) {
      // Calculate how far the section is from the viewport center
      const distanceFromCenter = (viewportHeight / 2) - (sectionTop + rect.height / 2);
      // Apply parallax effect
      const movement = (distanceFromCenter * 0.3);
      parallaxBg.style.transform = `translateY(${movement}px)`;
    }
  }

  // Throttle scroll events
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateParallax, { passive: true });
  
  // Initial position
  updateParallax();
});
