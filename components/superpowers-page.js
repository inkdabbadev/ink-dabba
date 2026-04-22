"use client";

import { useState } from "react";
import Header from "./header";
import { superpowers, testimonials } from "./site-data";

export default function SuperpowersPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const current = testimonials[activeTestimonial];

  const stepTestimonial = (step) => {
    setActiveTestimonial((value) => (value + step + testimonials.length) % testimonials.length);
  };

  return (
    <>
      <Header current="superpowers" subpage />

      <main className="superpowers-page">
        <section className="subpage-hero">
          <div className="subpage-shell">
            <div className="offer-card">
              <h1>What We Offer</h1>

              <div className="offer-collage" aria-hidden="true">
                <div className="offer-photo offer-photo-large"></div>
                <div className="offer-photo offer-photo-small"></div>
              </div>
            </div>

            <p className="superpowers-intro">
              What makes our superheroes the best and most unique is that they love what they do,
              and they're just a call away!
            </p>
          </div>
        </section>

        <section className="services-story">
          <div className="subpage-shell services-shell">
            <aside className="services-label">
              <h2>Our Superpowers</h2>
            </aside>

            <div className="services-grid">
              {superpowers.map((item, index) => (
                <article
                  key={item.id}
                  className={`service-entry ${index === superpowers.length - 1 ? "service-entry-wide" : ""}`}
                  id={item.id}
                >
                  <span className="service-number">{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="testimonial-section">
          <div className="subpage-shell">
            <div className="testimonial-card">
              <button
                className="testimonial-arrow testimonial-arrow-left"
                type="button"
                aria-label="Previous testimonial"
                onClick={() => stepTestimonial(-1)}
              >
                &#8249;
              </button>

              <div className="testimonial-content">
                <span className="quote-mark quote-mark-top" aria-hidden="true">&#8220;</span>
                <p className="testimonial-text">{current.text}</p>
                <p className="testimonial-author">{current.author}</p>
                <span className="quote-mark quote-mark-bottom" aria-hidden="true">&#8221;</span>
              </div>

              <button
                className="testimonial-arrow testimonial-arrow-right"
                type="button"
                aria-label="Next testimonial"
                onClick={() => stepTestimonial(1)}
              >
                &#8250;
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
