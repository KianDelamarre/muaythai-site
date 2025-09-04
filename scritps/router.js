const navbar = document.getElementById('nav-locations')
const topSectn = document.getElementById('top')
const mainPage = document.getElementById('main-content')
const mainPagePos = topSectn.offsetHeight
mainPage.style.top = mainPagePos
const footer = document.querySelector('footer');
function openSidebar() {
  document.body.classList.add('no-scroll')
  navbar.classList.add('show-nav')
}

function closeSidebar() {
  document.body.classList.remove('no-scroll')
  navbar.classList.remove('show-nav')
}

/////////   router //////////////////////
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
  "/blog": "/pages/blog.html"
}

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("main-content").innerHTML = html;

  closeSidebar();


  if (path === "/") {
    initHomePageClasses()
    initButton();    // initalise slideshow buttons only when on home page
    console.log("slideshow");
  }
  if (path === "/info") {
    // initInfoPage()
  }
  else if (path === "/blog") {
    initBlogSection();
  }
};

/////////   router //////////////////////

//////////// home page classes section ////////////////////
function initHomePageClasses() {
  const adultsMixed = document.getElementById('adults-mixed-card')
  const adultMixedInfo = document.getElementById('adults-mixed-more-info')

  const womensOnly = document.getElementById('womens-only-card')
  const womensOnlyInfo = document.getElementById('womens-only-more-info')

  const youths = document.getElementById('youths-card')
  const youthsInfo = document.getElementById('youths-more-info')


  const tinyThais = document.getElementById('tiny-thais-card')
  const tinyThaisInfo = document.getElementById('tiny-thais-more-info')


  initShowHideCards(adultsMixed, adultMixedInfo)
  initShowHideCards(womensOnly, womensOnlyInfo)
  initShowHideCards(youths, youthsInfo)
  initShowHideCards(tinyThais, tinyThaisInfo)

  let delay = 800
  let isVisible = false

  function initShowHideCards(triggerElement, infoElement) {
    let hoverTimeout = null;

    triggerElement.addEventListener('mouseenter', () => {
      if (!isVisible && !hoverTimeout) {
        hoverTimeout = setTimeout(() => {
          showMoreInfo(infoElement)
          isVisible = true;
        }, delay)
      }
    })

    triggerElement.addEventListener('mouseleave', () => {
      if (hoverTimeout != null) {
        clearTimeout(hoverTimeout)
        hoverTimeout = null
      }
      if (isVisible) {
        hideMoreInfo(infoElement)
        isVisible = false;
      }
    })
  }

  function showMoreInfo(info) {
    info.classList.remove('hide-class-more-info')
    info.classList.add('show-class-more-info')
    console.log(`showing`)
  }

  function hideMoreInfo(info) {
    info.classList.add('hide-class-more-info')

    info.addEventListener('animationend', () => {
      info.classList.remove('show-class-more-info')
      // info.classList.remove('hide-class-more-info')
    }, { once: true })


    console.log(`hiding`)

    // setTimeout(() => hide(info), 2000)
    // function hide(info) {
    //   info.style.display = 'none'
    // }
  }
}
//////////// home page classes section ////////////////////

////////   coaches slideshow section /////////////////
function initButton() {
  const slideShow = document.getElementById("coaches-slideshoww");
  const nextBtn = document.querySelector("[data-slideshow-next]");
  const prevBtn = document.querySelector("[data-slideshow-prev]");
  const numberOfSlides = document.querySelectorAll('.slide-container').length;
  const secondLastIndex = numberOfSlides - 2;

  let autoScrollTimer = setInterval(autoScroll, 20000);
  let isScrolling;

  //sets slideshow back to first slide 
  slideShow.scrollTo({
    left: 1 * slideShow.clientWidth,
    behavior: "instant"
  });

  function handleInfiniteScroll() {

    console.log(slideShow.scrollWidth);
    console.log(slideShow.clientWidth);
    console.log(slideShow.scrollLeft);
    //if scrolled to end of slide show - duplicate buffer slide
    if (Math.round(slideShow.scrollLeft) === slideShow.scrollWidth - slideShow.clientWidth) {

      console.log("reached end, resetting to 1st slide");
      slideShow.scrollTo({
        left: slideShow.clientWidth,
        behavior: "instant"
      });
    }
    else if (slideShow.scrollLeft === 0) {

      console.log("scrolled back to end");
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
    resetAutoScroll()

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

  function resetAutoScroll() {
    clearInterval(autoScrollTimer);
    autoScrollTimer = setInterval(autoScroll, 20000);
  }


  ///////////   coaches slideshow section /////////////////


}
////////   coaches slideshow section /////////////////

function initBlogSection() {
  const blogPostsSection = document.getElementById('blog-posts-section');
  let skip = 0;
  const load = 10;  // load 10 posts at a time
  const loadMoreBtn = document.getElementById('load-more');
  const addPostBtn = document.getElementById('post');
  const createPostButton = document.getElementById('createPostButton');
  const createPostForm = document.getElementById('createPostForm');
  const activateBtn = document.getElementById('activate');
  let loading = false;


  /////////////////////// blog page /////////////////////////////////////
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !loading) {
        // When last post comes into view, load more posts
        loadPosts();
      }
    });
  }, {
    rootMargin: '100px',  // start loading a bit before the element fully appears
  });



  function loadPosts() {
    if (loading) return;
    loading = true;

    fetch(`http://127.0.0.1:3000/blog?load=${load}&skip=${skip}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          // No more posts

          observer.disconnect();

          if (loadMoreBtn) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = "No more posts";
          }
          loading = false;
          return;
        }

        data.forEach(post => {
          console.log(post);
          const div = document.createElement('div');
          div.className = "post";
          div.id = `post-${post.id}`

          const title = document.createElement('h2');
          title.textContent = post.title;

          // const imgContainer = document.createElement('img-container');
          const imgContainer = document.createElement('div');
          const img = document.createElement('img');


          img.src = post.img_url;
          img.alt = post.title;
          img.className = "post-img";
          imgContainer.className = "img-container";
          imgContainer.appendChild(img);

          const text = document.createElement('p');
          text.textContent = post.text;

          const deletePostButton = document.createElement('button');
          deletePostButton.textContent = "X";

          // div.appendChild(title);


          div.appendChild(imgContainer);
          // div.appendChild(img);
          // console.log("tried to load image");

          div.appendChild(text);

          // // // // //div.appendChild(deletePostButton);

          blogPostsSection.appendChild(div);
          deletePostButton.addEventListener('click', () => {
            // console.log(div.id);
            deletePost(post.id);

          })
        });

        skip += load;

        observer.disconnect();
        // Observe the new last post
        const posts = document.querySelectorAll('.post');
        const lastPost = posts[posts.length - 1];
        if (lastPost) {
          observer.observe(lastPost);
        }

        loading = false;
      })
      .catch(err => {
        console.error('Failed to fetch blog data:', err);
      });


  };

  async function addRandomPost() {
    const title = "new post";
    const text = "new post";
    const randomInt = Math.floor(Math.random() * (210 - 190 + 1)) + 190;
    let img_url = `https://picsum.photos/${randomInt}`;

    try {
      const response = await fetch("http://localhost:3000/postrandom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          text,
          img_url
        })
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  async function addPost() {
    const title = document.getElementById('createPostTitleInput').value;
    const text = document.getElementById('createPostTextInput').value;
    // const randomInt = Math.floor(Math.random() * (210 - 190 + 1)) + 190;
    // let img_url = `https://picsum.photos/${randomInt}`;


    const fileInput = document.getElementById('uploadImg');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("text", text);


    try {
      const response = await fetch("http://localhost:3000/post", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Load initial posts
  loadPosts();

  // Button to load more posts
  loadMoreBtn.addEventListener('click', () => {
    loadPosts();
  })



  addPostBtn.addEventListener('click', () => {
    addRandomPost();
  })


  createPostForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let title = document.getElementById('createPostTitleInput').value;
    let text = document.getElementById('createPostTextInput').value;
    console.log(title, text);
    addPost();
  })

  function deletePost(id) {
    console.log('post-' + id);
    const confirmed = confirm("Are you sure you want to do this?");
    if (!confirmed) {
      return;
    }

    fetch(`http://localhost:3000/delete?id=${id}`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('network response not ok');
        }
        return response.json;
      })
      .then(data => {
        console.log('delete successful:', data);
      })
      .catch(error => {
        console.error('delete failed:', error);
      })
  }

};

//////////// info page /////////////////
function initInfoPage() {

  const eqpSectn = document.getElementById('equipment-section')
  const faqSectn = document.getElementById('FAQ-section')

  const spacer = document.getElementById('spacer')

  const faqSectnPos = eqpSectn.offsetHeight;
  const spacerPos = faqSectn.offsetHeight + eqpSectn.offsetHeight
  const footerPos = faqSectn.offsetHeight + navbar + mainPagePos;

  eqpSectn.style.top = (-2 * mainPagePos) + 'px'
  faqSectn.style.top = faqSectnPos + 'px'

  // spacer.style.paddingTop = footer.offsetHeight / 2 + 'px'
  // spacer.style.top = spacerPos + 'px'
  // spacer.style.height = footer.offsetHeight + 'px'

  // mainPage.style.height = 'fit-content'

  // footer.style.top = footerPos + 'px'
  console.log(eqpSectn.getBoundingClientRect().top, faqSectn.getBoundingClientRect().top, faqSectn.offsetHeight, footer.getBoundingClientRect().top)
}
//////////// info page /////////////////


/////////////////////// blog page /////////////////////////////////////

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
