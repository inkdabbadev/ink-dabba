"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { contactDetails } from "@/data/site-content";

const CMYK = ["#00AEEF", "#EC008C", "#FFF200", "#F2E8D8"];

export default function ContactSection() {
  const whatsappHref = `https://wa.me/${contactDetails.primaryPhone.replace(/\D/g, "")}`;
  const reduceMotion = useReducedMotion();
  const [colorIdx, setColorIdx] = useState(1);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setColorIdx(i => (i + 1) % 4), 1500);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <section id="contact" className="relative w-full py-24 md:py-32 bg-ink-black overflow-hidden border-t border-white/5">
      <div className="max-w-[92%] mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Headline and Info */}
          <div className="flex flex-col gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-display text-6xl md:text-7xl lg:text-[6rem] uppercase text-warm-white leading-[0.9] tracking-tighter drop-shadow-lg">
                LET&apos;S BUILD <br />
                <motion.span
                  animate={{ color: CMYK[colorIdx] }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >SOMETHING</motion.span> <br />
                PEOPLE CAN&apos;T <br />
                <span
                  className="group/ignore relative inline-block text-transparent"
                  style={{ WebkitTextStroke: "2px #F2E8D8" }}
                >
                  <span className="relative z-10">IGNORE.</span>
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_18%_45%,#00AEEF_0%,transparent_34%),radial-gradient(circle_at_52%_48%,#EC0080_0%,transparent_36%),radial-gradient(circle_at_82%_52%,#FFF200_0%,transparent_34%),linear-gradient(90deg,#00AEEF_0%,#6A5CFF_28%,#EC0080_52%,#FF7A00_74%,#FFF200_100%)] bg-[length:180%_180%,180%_180%,180%_180%,220%_100%] bg-clip-text text-transparent opacity-0 transition-[opacity,background-position] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/ignore:bg-[position:18%_42%,52%_48%,82%_52%,100%_50%] group-hover/ignore:opacity-100"
                    style={{ WebkitTextStroke: "0px transparent", WebkitBackgroundClip: "text" }}
                  >
                    IGNORE.
                  </span>
                </span>
              </h2>
            </motion.div>

            <StaggeredParagraph text="We don't do templates. We don't do quiet. If you're ready to break the frame, tell us what we're building." />
            
            <div className="flex flex-col gap-4 mt-2">
              <span className="font-body text-[0.65rem] font-bold tracking-[0.3em] uppercase text-warm-white/40">Direct Line</span>
              <a href="mailto:hello@inkdabba.com" className="group relative font-display text-3xl md:text-4xl text-warm-white w-fit overflow-hidden">
                <span className="relative z-10 transition-colors duration-500 group-hover:text-ink-black">hello@inkdabba.com</span>
                <div className="absolute inset-0 bg-cmyk-cyan translate-y-[100%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="group relative font-display text-3xl md:text-4xl text-warm-white w-fit overflow-hidden mt-2">
                <span className="relative z-10 transition-colors duration-500 group-hover:text-ink-black">WhatsApp Us</span>
                <div className="absolute inset-0 bg-cmyk-yellow translate-y-[100%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
              </a>
            </div>
          </div>

          {/* Right Column: Conversational Form */}
          <div className="pt-8 lg:pt-0">
            <form className="flex flex-col gap-10 font-display text-xl md:text-2xl text-warm-white leading-loose">
              
              <FormRow>
                <div className="leading-[2.2] md:leading-[2.5]">
                  <span className="align-middle">Hi inkdabba, I am </span>
                  <input type="text" placeholder="YOUR NAME" className="bg-transparent border-b-[2px] border-warm-white/20 text-cmyk-cyan placeholder:text-warm-white/20 focus:outline-none focus:border-cmyk-cyan transition-all duration-300 w-32 md:w-48 mx-2 md:mx-3 text-center rounded-none shadow-none inline-block align-middle" required />
                  <span className="align-middle">, and I represent </span>
                  <input type="text" placeholder="COMPANY" className="bg-transparent border-b-[2px] border-warm-white/20 text-cmyk-magenta placeholder:text-warm-white/20 focus:outline-none focus:border-cmyk-magenta transition-all duration-300 w-32 md:w-48 mx-2 md:mx-3 text-center rounded-none shadow-none inline-block align-middle" required />
                  <span className="align-middle">.</span>
                </div>
              </FormRow>

              <FormRow>
                <div className="leading-[2.2] md:leading-[2.5]">
                  <span className="align-middle">We are looking to build a </span>
                  <input type="text" placeholder="PROJECT TYPE" className="bg-transparent border-b-[2px] border-warm-white/20 text-cmyk-yellow placeholder:text-warm-white/20 focus:outline-none focus:border-cmyk-yellow transition-all duration-300 w-40 md:w-56 mx-2 md:mx-3 text-center rounded-none shadow-none inline-block align-middle" required />
                  <span className="align-middle">that makes people feel </span>
                  <input type="text" placeholder="EMOTION" className="bg-transparent border-b-[2px] border-warm-white/20 text-cmyk-cyan placeholder:text-warm-white/20 focus:outline-none focus:border-cmyk-cyan transition-all duration-300 w-32 md:w-40 mx-2 md:mx-3 text-center rounded-none shadow-none inline-block align-middle" required />
                  <span className="align-middle">.</span>
                </div>
              </FormRow>

              <FormRow>
                <div className="leading-[2.2] md:leading-[2.5]">
                  <span className="align-middle">You can reach me at </span>
                  <input type="email" placeholder="EMAIL ADDRESS" className="bg-transparent border-b-[2px] border-warm-white/20 text-cmyk-magenta placeholder:text-warm-white/20 focus:outline-none focus:border-cmyk-magenta transition-all duration-300 w-56 md:w-72 mx-2 md:mx-3 text-center rounded-none shadow-none inline-block align-middle" required />
                  <span className="align-middle">to discuss this further.</span>
                </div>
              </FormRow>

              <div className="mt-8 flex justify-start">
                <button type="submit" className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-body text-xs font-bold tracking-[0.3em] text-ink-black bg-warm-white rounded-full group cursor-none transition-all duration-300">
                  <span className="relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[200%]">SEND IT</span>
                  <span className="absolute inset-0 flex items-center justify-center translate-y-[100%] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 text-cmyk-key bg-cmyk-yellow z-10">
                    SEND IT
                  </span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StaggeredParagraph({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p className="font-body text-xl md:text-2xl font-light text-warm-white/80 max-w-lg leading-relaxed flex flex-wrap gap-x-2">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
