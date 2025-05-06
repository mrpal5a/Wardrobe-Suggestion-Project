// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  console.log("Bootstrap validation script loaded!");

  // type / this to search
  document.addEventListener("keydown",function(event){
    const searchBar = document.getElementById('search');
  
    if(event.key === "/" && !event.ctrlKey && !event.metaKey){
      event.preventDefault();
      searchBar.focus();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault(); // prevent default browser search
      searchBar.focus();
    }
  } )

 // Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Wait for the full page to load before running animations
window.addEventListener("load", () => {
  // Get all card elements
  const cards = gsap.utils.toArray(".gsap");

  cards.forEach((card, index) => {
    let animationProps = {
      scrollTrigger: {
        trigger: card,
        start: "top 80%", // when card top reaches 80% of viewport
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      duration: 1,
    };

    // Animate based on card position (left, center, right)
    if (index % 3 === 0) {
      animationProps.x = -100; // Left
    } else if (index % 3 === 1) {
      animationProps.y = 100; // Bottom
    } else {
      animationProps.x = 100; // Right
    }

    // Apply the animation to the card
    gsap.from(card, animationProps);
  });
});

