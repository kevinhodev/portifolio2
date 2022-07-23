import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);
import "./three";

const timeline = gsap.timeline({ defaults: { duration: 1 } });

timeline.from(".header__logo", {
  duration: 1,
  opacity: 0,
  x: -100,
});
timeline.to("section", { opacity: 1 }, "-=1");
timeline.from(
  ".header__menu ul li",
  {
    opacity: 0,
    y: -100,
    stagger: 0.1,
  },
  "-=1"
);
timeline.from(
  ".header__icon",
  {
    opacity: 0,
    x: -100,
    stagger: 0.1,
  },
  "-=1"
);

const introTimeline = gsap.timeline({
  repeat: -1,
  repeatDelay: 2,
  defaults: { ease: "linear", delay: 1.5 },
});
introTimeline
  .to(".text-animated", {
    text: { value: "Frontend", speed: 0.5 },
    delay: 0,
  })
  .to(".text-animated", {
    text: { value: "Backend", speed: 0.5 },
  })
  .to(".text-animated", {
    text: { value: "+ Designer", speed: 0.5 },
  });

const arrowTimeline = gsap.timeline({
  repeat: -1,
  defaults: { duration: 0.5 },
});
arrowTimeline.to(".scroll__arrow:nth-child(1)", {
  opacity: 0.9,
});
arrowTimeline
  .to(".scroll__arrow:nth-child(1)", {
    opacity: 0,
  })
  .to(
    ".scroll__arrow:nth-child(2)",
    {
      opacity: 0.9,
    },
    "-=0.4"
  )
  .to(".scroll__arrow:nth-child(2)", {
    opacity: 0,
  })
  .to(
    ".scroll__arrow:nth-child(3)",
    {
      opacity: 0.9,
    },
    "-=0.4"
  )
  .to(".scroll__arrow:nth-child(3)", {
    opacity: 0,
    duration: 0.25,
  });

let currentSection;

let options = {
  root: document.querySelector(".wrapper"),
  rootMargin: "0px 68px 0px 60px",
  threshold: 1,
};
let callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      currentSection = entry.target.classList[0];
    } else {
      currentSection = null;
    }
  });
};

let firstSectionObserver = new IntersectionObserver(callback, options);
let lastSectionObserver = new IntersectionObserver(callback, options);

const sectionWidth = gsap.getProperty("section", "width");

const sections = [...document.querySelectorAll("section")];
sections.forEach((section, index) => {
  if (index === 0) firstSectionObserver.observe(section);
  if (index === sections.length - 1) lastSectionObserver.observe(section);

  gsap.set(section, {
    x: `${index * sectionWidth}`,
  });
});

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

window.addEventListener(
  "wheel",
  (event) => {
    sections.forEach((section) => {
      const currentX = gsap.getProperty(section, "x");

      if (currentSection === "intro") {
        gsap.to(section, {
          x: currentX - clamp(-event.deltaY, 0, sectionWidth),
        });
      } else if (currentSection === "contact") {
        gsap.to(section, {
          x: currentX + clamp(event.deltaY, 0, sectionWidth),
        });
      } else {
        gsap.to(section, {
          x: currentX + event.deltaY,
        });
      }
    });
  },
  {
    passive: true,
  }
);
