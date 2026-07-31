const WRAPPER_CLASS = "lb-table-scroll";

function wrapTables() {
  if (typeof document === "undefined") {
    return;
  }

  document.querySelectorAll(".markdown table").forEach((table) => {
    let wrapper = table.parentElement;

    if (!wrapper || !wrapper.classList.contains(WRAPPER_CLASS)) {
      wrapper = document.createElement("div");
      wrapper.className = WRAPPER_CLASS;
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }

    const overflows = wrapper.scrollWidth > wrapper.clientWidth + 1;

    if (overflows) {
      wrapper.setAttribute("tabindex", "0");
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-label", "Table, scrollable horizontally");
    } else {
      wrapper.removeAttribute("tabindex");
      wrapper.removeAttribute("role");
      wrapper.removeAttribute("aria-label");
    }
  });
}

function schedule() {
  if (typeof window === "undefined") {
    return;
  }
  window.requestAnimationFrame(wrapTables);
}

if (typeof window !== "undefined") {
  window.addEventListener("resize", schedule, { passive: true });
}

export function onRouteDidUpdate() {
  schedule();
}
