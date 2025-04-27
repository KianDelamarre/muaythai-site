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
  const numberOfSlides = document.querySelectorAll('.slide-container').length;
  const secondLastIndex = numberOfSlides - 2;

  let isScrolling;

  slideShow.scrollTo({
    left: 1 * slideShow.clientWidth,
    behavior: "instant"
  });

  function handleInfiniteScroll() {

    console.log(slideShow.scrollWidth);
    console.log(slideShow.clientWidth);
    console.log(slideShow.scrollLeft);

    if (slideShow.scrollLeft === slideShow.scrollWidth - slideShow.clientWidth) {

      console.log("infite scroll");
      slideShow.scrollTo({
        left: 1 * slideShow.clientWidth,
        behavior: "instant"
      });
    }
    else if (slideShow.scrollLeft === 0) {

      console.log("infite scroll");
      slideShow.scrollTo({
        left: secondLastIndex * slideShow.clientWidth,
        behavior: "instant"
      });
    }


  }


  //next button
  nextBtn.addEventListener("click", () => {
    console.log("next button clicked");
    slideShow.scrollBy({
      left: window.innerWidth,
      behavior: "smooth"
    })
  });

  ///
  prevBtn.addEventListener("click", () => {
    console.log("prev button clicked");
    slideShow.scrollBy({
      left: -window.innerWidth,
      behavior: "smooth"
    })
  });



  slideShow.addEventListener('scroll', () => {
    //Cancel any previous "waiting to check" timer
    window.clearTimeout(isScrolling)

    isScrolling = setTimeout(() => {
      handleInfiniteScroll();
    }, 10);
  });

  function autoScroll() {
    slideShow.scrollBy({
      left: window.innerWidth,
      behavior: "smooth"
    });
  }

  setInterval(autoScroll, 20000);
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
