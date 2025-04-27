const navbar = document.getElementById('nav-locations')

function openSidebar() {
  navbar.classList.add('show')
}

function closeSidebar() {
  navbar.classList.remove('show')
}

const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};


const routes = {
  404: "/pages/404.html",
  "/": "/pages/home.html",
  "/about": "/pages/about.html",
  "/contact": "/pages/contact.html",
  "/classes": "/pages/classes.html",
  "/info": "/pages/info.html",
}

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("main-content").innerHTML = html;

  if (path === "/") {
    // initSlideshowButtons();
    initButton();
  }
};

function initButton() {
  const slideShow = document.getElementById("coaches-slideshoww");
  const nextBtn = document.querySelector("[data-slideshow-next]");
  const prevBtn = document.querySelector("[data-slideshow-prev]");

  let stopScroll = false;


  function handleInfiniteScroll() {



    if (slideShow.scrollLeft === slideShow.scrollWidth - slideShow.clientWidth) {
      stopScroll = true;
      slideShow.scrollTo({
        left: -slideShow.scrollWidth,
        behavior: "smooth"
      });
    }
    else if (slideShow.scrollLeft === 0) {
      stopScroll = true;
      slideShow.scrollTo({
        left: slideShow.scrollWidth,
        behavior: "smooth"
      });
    }

    if (stopScroll) return;
  }

  nextBtn.addEventListener("click", () => {
    console.log("next button clicked");
    if (slideShow.scrollLeft === slideShow.scrollWidth - slideShow.clientWidth) {
      slideShow.scrollTo({
        left: -slideShow.scrollWidth,
        behavior: "smooth"
      })
    }
    else {
      slideShow.scrollBy({
        left: window.innerWidth,
        behavior: "smooth"
      })
    }
    scrollNext();
  });

  prevBtn.addEventListener("click", () => {
    console.log("prev button clicked");
    if (slideShow.scrollLeft === 0) {
      slideShow.scrollTo({
        left: slideShow.scrollWidth,
        behavior: "smooth"
      })
    }
    else {
      slideShow.scrollBy({
        left: -window.innerWidth,
        behavior: "smooth"
      })
    }
  });

  slideShow.addEventListener('scroll', () => {
    // if (slideShow.scrollLeft !== 0 && slideShow.scrollLeft !== slideShow.scrollWidth - slideShow.clientWidth) {
    //   stopScroll = false;
    // }
    handleInfiniteScroll();
    stopScroll = false;
  });
}

function initSlideshowButtons() {
  const buttons = document.querySelectorAll("[data-slideshow-button]");
  console.log(document.querySelector("[data-slideshow-button]")); // null? too early


  buttons.forEach(button => {
    button.addEventListener("click", () => {
      console.log('button clicked');
      const offset = button.dataset.slideshowButton === "next" ? 1 : -1;
      const slides = button.closest("[data-slideshow]").querySelector("[data-slides]");

      const activeSlide = slides.querySelector("[data-active]");
      console.log(slides.querySelector("[data-active]"));
      let newIndex = [...slides.children].indexOf(activeSlide) + offset;
      console.log(newIndex);

      if (newIndex < 0) newIndex = slides.children.length - 1;
      if (newIndex >= slides.children.length) newIndex = 0;

      slides.children[newIndex].dataset.active = true;
      delete activeSlide.dataset.active;
    });
  });
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
