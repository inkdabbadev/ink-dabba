const sections = [...document.querySelectorAll("main > section[id]")];
const dots = [...document.querySelectorAll(".section-dot")];
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const contactForm = document.getElementById("contact-form");
const feedback = document.getElementById("form-feedback");
const testimonialText = document.getElementById("testimonial-text");
const testimonialAuthor = document.getElementById("testimonial-author");
const testimonialButtons = [...document.querySelectorAll("[data-testimonial-step]")];

const activateDot = (id) => {
  dots.forEach((dot) => {
    dot.classList.toggle("is-active", dot.dataset.target === id);
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const current = entry.target.id === "clients" ? "superpowers" : entry.target.id;
        activateDot(current);
      }
    });
  },
  {
    rootMargin: "-35% 0px -35% 0px",
    threshold: 0.2,
  }
);

sections.forEach((section) => observer.observe(section));

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (contactForm && feedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const mailto = new URL("mailto:hello@inkdabba.com");
    mailto.searchParams.set("subject", subject);
    mailto.searchParams.set(
      "body",
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href = mailto.toString();
    feedback.textContent = "Opening your email app so you can send the message directly.";
  });
}

if (testimonialText && testimonialAuthor && testimonialButtons.length) {
  const testimonials = [
    {
      text: "I'm a testimonial. Click to edit me and add text that says something nice about you and your services. Let your customers review you and tell their friends how great you are.",
      author: "Elinor Simon",
    },
    {
      text: "Ink Dabba helped us sharpen our brand voice and present ourselves with far more clarity. The team was quick, creative, and very easy to work with.",
      author: "Client Review",
    },
    {
      text: "From strategy to execution, the work felt thoughtful and polished. Their team brought fresh ideas while still understanding exactly what our brand needed.",
      author: "Brand Partner",
    },
  ];

  let activeTestimonial = 0;

  const renderTestimonial = () => {
    testimonialText.textContent = testimonials[activeTestimonial].text;
    testimonialAuthor.textContent = testimonials[activeTestimonial].author;
  };

  testimonialButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.testimonialStep || 0);
      activeTestimonial =
        (activeTestimonial + step + testimonials.length) % testimonials.length;
      renderTestimonial();
    });
  });
}
