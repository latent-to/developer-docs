import React, { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import TOCItems from "@theme/TOCItems";
import styles from "./styles.module.css";

const LINK_CLASS_NAME = "table-of-contents__link toc-highlight";
const LINK_ACTIVE_CLASS_NAME = "table-of-contents__link--active";
const ACTIVE_ANCHOR_RATIO = 0.35;
const EDGE_PADDING = 56;
const WHOLE_CODE_HEADING = /^<code>([\s\S]*)<\/code>$/;

function simplifyEntry(value) {
  const match = value.match(WHOLE_CODE_HEADING);
  if (!match) {
    return value;
  }
  return match[1].split("(")[0].split(":")[0].trim();
}

export default function TOC({ className, toc, ...props }) {
  const entries = toc.map((item) => ({
    ...item,
    value: simplifyEntry(item.value),
  }));

  const containerRef = useRef(null);
  const [shadow, setShadow] = useState({ top: false, bottom: false });

  const updateShadow = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const overflowing = container.scrollHeight > container.clientHeight + 1;
    setShadow({
      top: overflowing && container.scrollTop > 1,
      bottom:
        overflowing &&
        container.scrollTop + container.clientHeight <
          container.scrollHeight - 1,
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let firstRun = true;

    const followActiveItem = () => {
      const active = container.querySelector(`.${LINK_ACTIVE_CLASS_NAME}`);
      if (!active || container.scrollHeight <= container.clientHeight) {
        updateShadow();
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const activeTop =
        activeRect.top - containerRect.top + container.scrollTop;
      const viewTop = container.scrollTop;
      const viewBottom = viewTop + container.clientHeight;

      const needsScroll =
        activeTop < viewTop + EDGE_PADDING ||
        activeTop + activeRect.height > viewBottom - EDGE_PADDING;

      if (needsScroll) {
        const target = Math.max(
          0,
          Math.min(
            activeTop - container.clientHeight * ACTIVE_ANCHOR_RATIO,
            container.scrollHeight - container.clientHeight,
          ),
        );
        container.scrollTo({
          top: target,
          behavior: prefersReducedMotion || firstRun ? "auto" : "smooth",
        });
      }

      firstRun = false;
      updateShadow();
    };

    followActiveItem();

    const observer = new MutationObserver(followActiveItem);
    observer.observe(container, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    });

    container.addEventListener("scroll", updateShadow, { passive: true });
    window.addEventListener("resize", updateShadow);

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", updateShadow);
      window.removeEventListener("resize", updateShadow);
    };
  }, [updateShadow]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        styles.tableOfContents,
        "thin-scrollbar",
        shadow.top && styles.fadeTop,
        shadow.bottom && styles.fadeBottom,
        className,
      )}>
      <TOCItems
        {...props}
        toc={entries}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
    </div>
  );
}
