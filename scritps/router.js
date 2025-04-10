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
}

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-content").innerHTML = html;
    
      if (path === "/") {
        initSlideshowButtons();
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



window.onpopstate = handleLocation;
window.route = route;

handleLocation();
