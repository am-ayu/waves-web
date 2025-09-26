const track = document.getElementById('track');
const slides = Array.from(track.querySelectorAll('.slide'));
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const carousel = document.getElementById('carousel');

let i = 0;
let timer = null;
const DURATION = 3500; // ms per slide
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// gap must match CSS --gap; change here if you adjust CSS
const GAP_PX = 20; // ~1.25rem on many systems; tweak if needed

function slideWidth() {
  const rect = slides[0].getBoundingClientRect();
  return rect.width + GAP_PX;
}

function update() {
  const containerWidth = carousel.getBoundingClientRect().width;
  const slideW = slideWidth();

  // how far the whole track needs to shift so the current slide is centered
  const offset = i * slideW;
  const centerOffset = (containerWidth - slideW) / 2;

  track.style.transform = `translateX(${centerOffset - offset}px)`;

  // set which slide is the "current" one (for zoom/hover styling)
  slides.forEach((s, idx) => {
    s.classList.toggle('current', idx === i);
  });
}

function next() {
  i = (i + 1) % slides.length;
  update();
}

function prev() {
  i = (i - 1 + slides.length) % slides.length;
  update();
}


function pause() {
  clearInterval(timer);
  timer = null;
}

function play() {
  if (timer) return;           // don't create multiple timers
  timer = setInterval(next, DURATION);
}


// controls
nextBtn.addEventListener('click', () => { pause(); next(); play(); });
prevBtn.addEventListener('click', () => { pause(); prev(); play(); });

// pause on hover, resume on leave
carousel.addEventListener('mouseenter', pause);
carousel.addEventListener('mouseleave', play);

// keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { pause(); next(); play(); }
  if (e.key === 'ArrowLeft') { pause(); prev(); play(); }
});

// handle resize so centering stays correct
window.addEventListener('resize', update);

// init
update();
if (!reduceMotion) play(); // autoplay unless user prefers reduced motion
