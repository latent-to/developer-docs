import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

const SHOW_AFTER = 600;

export default function BackToTopButton() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");

    const onScroll = () => {
      const pastThreshold = window.scrollY > SHOW_AFTER;
      const footerVisible = footer
        ? footer.getBoundingClientRect().top < window.innerHeight - 24
        : false;
      setShown(pastThreshold && !footerVisible);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={translate({
        id: "theme.BackToTopButton.buttonAriaLabel",
        message: "Scroll back to top",
        description: "The ARIA label for the back to top button",
      })}
      className={clsx(styles.backToTopButton, shown && styles.backToTopShown)}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        })
      }>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true">
        <path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" />
      </svg>
    </button>
  );
}
