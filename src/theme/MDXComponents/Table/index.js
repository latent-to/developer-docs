import React, { useEffect, useRef, useState } from "react";

export default function Table(props) {
  const scrollRef = useRef(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return undefined;
    }

    let frame = null;
    const measure = () => {
      frame = window.requestAnimationFrame(() =>
        setScrollable(el.scrollWidth > el.clientWidth + 1),
      );
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", measure);
      };
    }

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const table = el.querySelector("table");
    if (table) {
      observer.observe(table);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className="lb-table-scroll"
      tabIndex={scrollable ? 0 : undefined}
      role={scrollable ? "region" : undefined}
      aria-label={scrollable ? "Table, scrollable horizontally" : undefined}>
      <table {...props} />
    </div>
  );
}
