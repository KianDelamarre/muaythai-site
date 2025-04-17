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
        initSlideshowButtons();
        initSlideShowSwipe();
    }
};


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

function initSlideShowSwipe() {
  let touchArea = document.getElementById("coaches-slideshow");

  let mouseX,
    intialX = 0;
  let mouseY,
    initalY = 0;
  let isSwiped;

  let events = {
    mouse: {
      down: "mousedown",
      move: "mousemove",
      up: "mouseup",
    },
    touch: {
      down: "touchstart",
      move: "touchmove",
      up: "touchend",
    },
  };

  let deviceType = "";

  const isTouchDevice = () => {
    try {
      document.createEvent("TouchEvent");
      deviceType = "touch";
      return true;
    }
    catch (e) {
      deviveType = "mouse";
      return false;
    }
  };

  console.log("is touch device? " + isTouchDevice());

  let rectLeft = touchArea.getBoundingClientRect().left;
  let rectTop = touchArea.getBoundingClientRect().top; 

  const getXY = (e) => {
    mouseX = (!isTouchDevice() ? e.pageX : e.touches[0].pageX) - rectLeft;
    mouseY = (!isTouchDevice() ? e.pageY : e.touches[0].pageY) - rectTop;
  };

  // isTouchDevice();

  touchArea.addEventListener(events[deviveType].down,
    (event) => {
      isSwiped = true;

      getXY(event);
      console.log(mouseX, mouseY);
      intialX = mouseX;
      initalY = mouseY;
    });
  
  touchArea.addEventListener(events[deviceType].move,
    (event) => {
      if (!isTouchDevice()) {
        event.preventDefault();
      }
      if (isSwiped) {
        getXY(event);
        let diffX = mouseX - intialX;
        let diffY = mouseY - initalY;
        if (Math.abs(diffY) > Math.abs(diffX)) {
          console.log("swiped vert");
        }
        else {
          console.log("swiped hor");
        }
      }
    }
  );

  touchArea.addEventListener(events[deviveType].up, () => {
    isSwiped = false;
  });

  touchArea.addEventListener("mouseleave", () => {
    isSwiped = false;
  });

}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
