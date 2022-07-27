import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);
import "./three";

const timeline = gsap.timeline({ defaults: { duration: 1 } });

/*timeline.from(".header__logo", {
  duration: 1,
  opacity: 0,
  x: -100,
});

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
);*/

timeline.to("section", { opacity: 1 });

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

/* Intersection Observer API */
const createObserver = (callback, granularity) => {
  let observer;

  const buildThresholdArray = (granularity) => {
    let thresholds = [];

    for (i = 1; i < granularity; i++) {
      const ratio = i / granularity;
      thresholds.push(ratio);
    }

    thresholds.unshift(0);

    return thresholds;
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: buildThresholdArray(granularity),
  };

  return (observer = new IntersectionObserver(callback, options));
};
/* --------------------------------------------- */

/* -- Sections Stuff -- */
const sections = [...document.querySelectorAll("section")];
const firstSection = sections[0].classList[0];
const lastSection = sections[sections.length - 1].classList[0];

const currentSectionInfo = {
  name: "intro",
  intersecting: true,
  ratio: 1,
};

const handleSectionIntersection = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
      currentSectionInfo.name = entry.target.classList[0];
      currentSectionInfo.intersecting = true;
      currentSectionInfo.ratio = entry.intersectionRatio;
    }
  });
};

const sectionsObserver = createObserver(handleSectionIntersection, 100);

sections.forEach((section, index) => {
  gsap.set(section, {
    transform: `translateX(${index * 100}%)`,
  });
  sectionsObserver.observe(section);
});

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const handleWheelMove = (event) => {
  sections.forEach((section) => {
    const currentX = gsap.getProperty(section, "x");

    if (
      currentSectionInfo.name == firstSection &&
      currentSectionInfo.ratio >= 0.95
    ) {
      gsap.to(section, {
        x: currentX - clamp(-event.deltaY, 0, window.innerWidth),
      });
    } else if (
      currentSectionInfo.name == lastSection &&
      currentSectionInfo.ratio >= 0.95
    ) {
      gsap.to(section, {
        x: currentX + clamp(event.deltaY, 0, window.innerWidth),
      });
    } else {
      gsap.to(section, {
        x: currentX + event.deltaY,
      });
    }
  });
};

window.addEventListener("wheel", handleWheelMove, {
  passive: true,
});

window.addEventListener("resize", () => {
  sections.forEach((section, index) => {
    gsap.set(section, {
      transform: `translateX(${index * 100}%)`,
    });
  });
});
