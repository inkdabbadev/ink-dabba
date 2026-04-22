"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "./header";
import { clients, homeSectionDots, superpowers } from "./site-data";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.5 8.5h2V5.2c-.4-.1-1.7-.2-3.1-.2-3.1 0-5.2 1.8-5.2 5.3V13H5v3.7h3.2V24h3.9v-7.3h3.1l.5-3.7h-3.6v-2.3c0-1.1.3-2.2 2.4-2.2Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19.1 4.5 12 4.5 12 4.5s-7.1 0-8.9.6A3 3 0 0 0 1 7.2a31.1 31.1 0 0 0 0 9.6 3 3 0 0 0 2.1 2.1c1.8.6 8.9.6 8.9.6s7.1 0 8.9-.6a3 3 0 0 0 2.1-2.1 31.1 31.1 0 0 0 0-9.6ZM9.7 15.5V8.5L15.8 12l-6.1 3.5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 1.9A3.9 3.9 0 0 0 3.9 7.8v8.4a3.9 3.9 0 0 0 3.9 3.9h8.4a3.9 3.9 0 0 0 3.9-3.9V7.8a3.9 3.9 0 0 0-3.9-3.9H7.8Zm8.9 1.4a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z" />
    </svg>
  );
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home");
  const [feedback, setFeedback] = useState("");

  const observerIds = useMemo(() => ["home", "about", "superpowers", "contact"], []);

  useEffect(() => {
    const nodes = observerIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0.2,
      }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [observerIds]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const mailto = new URL("mailto:hello@inkdabba.com");

    mailto.searchParams.set("subject", subject);
    mailto.searchParams.set("body", `Name: ${name}\nEmail: ${email}\n\n${message}`);

    window.location.href = mailto.toString();
    setFeedback("Opening your email app so you can send the message directly.");
  };

  return (
    <>
      <nav className="section-dots" aria-label="Section navigation">
        {homeSectionDots.map((dot) => (
          <a
            key={dot.target}
            className={`section-dot ${activeSection === dot.target ? "is-active" : ""}`}
            href={dot.href}
            aria-label={dot.label}
          ></a>
        ))}
      </nav>

      <Header current="home" />

      <main>
        <section id="home" className="panel hero-panel">
          <img className="shape shape-top-left" src="/Site%20Files/Asset%203.png" alt="" aria-hidden="true" />
          <img className="shape shape-bottom-right" src="/Site%20Files/Asset%202.png" alt="" aria-hidden="true" />
          <img className="hero-glow" src="/Site%20Files/Asset%204.png" alt="" aria-hidden="true" />

          <div className="hero-inner">
            <div className="hero-media">
              <video
                className="hero-video"
                autoPlay
                muted
                loop
                playsInline
                poster="/Site%20Files/Asset%201.png"
              >
                <source src="/video/01%20-%20Inkdabba%20Animation-1.m4v" type="video/mp4" />
              </video>
            </div>

            <div className="hero-copy">
              <h1>If Superman runs a firm, it'd be like Ink Dabba. All in one!</h1>
              <a className="hero-scroll" href="#about">
                <span>get to know us!</span>
                <span className="hero-scroll-arrow" aria-hidden="true"></span>
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="panel about-panel">
          <img className="shape about-shape-left" src="/Site%20Files/Asset%202.png" alt="" aria-hidden="true" />
          <div className="about-card">
            <p className="eyebrow">ABOUT US</p>
            <span className="eyebrow-line" aria-hidden="true"></span>

            <div className="about-copy">
              <p>
                It's been 2 years since Ink Dabba (AWESOMENESS) was brought into the marketing
                space by us. Social Media Marketing, Branding, Website Development, or Graphic
                Designing, you name it, we offer it all. Ink Dabba provides all that there is to
                offer from an advertising firm, and more!
              </p>
              <p>
                How did Ink Dabba begin, you ask? We're like the X-men. Started with just 2 gifted
                individuals, we've now developed into a group of passionate superheroes, ready to
                give our best for the ones who seek our help. The only difference between us and
                actual superheroes is the tight jumpsuits (and we're working on that too).
              </p>
              <p>
                The best part about being superheroes? Seeing the happy faces of our clients after
                we've successfully accomplished our missions. Our team is always ready to face the
                tasks you've planned for us. So, why wait? Grab your chance to be Nick Fury, and let
                us do the hard work. We're here to take your commands and show you what we got!
              </p>
            </div>

            <Link className="ghost-button" href="/superpowers">
              Know More
            </Link>
          </div>
        </section>

        <section id="superpowers" className="panel superpowers-panel">
          <div className="superpowers-topline"></div>
          <div className="section-heading">
            <p>OUR SUPERPOWERS</p>
          </div>

          <div className="powers-grid">
            {superpowers.map((item) => (
              <Link key={item.id} className="power-card-link" href={`/superpowers#${item.id}`}>
                <article className="power-card">
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section id="clients" className="panel clients-panel">
          <img className="shape clients-shape-left" src="/Site%20Files/Asset%203.png" alt="" aria-hidden="true" />

          <div className="section-heading clients-heading">
            <p>OUR CLIENTS</p>
          </div>

          <div className="clients-scroll" aria-label="Client logos">
            <div className="clients-grid">
              {clients.map((client) => (
                <div key={client.alt} className="client-logo">
                  <img src={client.src} alt={client.alt} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="panel contact-panel">
          <div className="contact-wrap">
            <div className="contact-heading">
              <h2>Contact Us</h2>
              <div className="contact-dots" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>
                <strong>InkDabba</strong> - 297-295, Kathiravan Colony, Anna Nagar, Chennai, Tamil
                Nadu 600040
              </p>
              <p>Email: hello@inkdabba.com | Tel: +91 9940183984, +91 9176783984</p>
            </div>

            <div className="contact-grid">
              <form className="contact-form" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="name">Name</label>
                <input id="name" name="name" type="text" placeholder="Name" required />
                <label className="sr-only" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="Email" required />
                <label className="sr-only" htmlFor="subject">Subject</label>
                <input id="subject" name="subject" type="text" placeholder="Subject" required />
                <label className="sr-only" htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Message" rows="7" required></textarea>
                <button type="submit">Submit</button>
                <p className="form-feedback" aria-live="polite">{feedback}</p>
              </form>

              <div className="map-card">
                <iframe
                  title="Ink Dabba location"
                  src="https://www.google.com/maps?q=297-295%20Kathiravan%20Colony%20Anna%20Nagar%20Chennai%20Tamil%20Nadu%20600040&z=15&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <a className="back-to-top" href="#home" aria-label="Back to top"></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Copyrights &copy; 2021 INK DABBA - All Rights Reserved</p>

        <div className="social-links">
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
            <YoutubeIcon />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
        </div>
      </footer>
    </>
  );
}
