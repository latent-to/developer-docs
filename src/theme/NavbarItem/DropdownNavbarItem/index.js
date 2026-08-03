import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import {
  isRegexpStringMatch,
  useCollapsible,
  useThemeConfig,
  Collapsible,
} from "@docusaurus/theme-common";
import {
  isSamePath,
  useLocalPathname,
} from "@docusaurus/theme-common/internal";
import NavbarNavLink from "@theme/NavbarItem/NavbarNavLink";
import NavbarItem from "@theme/NavbarItem";
import styles from "./styles.module.css";

function isItemActive(item, localPathname) {
  if (isSamePath(item.to, localPathname)) {
    return true;
  }
  if (isRegexpStringMatch(item.activeBaseRegex, localPathname)) {
    return true;
  }
  if (item.activeBasePath && localPathname.startsWith(item.activeBasePath)) {
    return true;
  }
  return false;
}

function containsActiveItem(items, localPathname) {
  return items.some((item) => isItemActive(item, localPathname));
}

function useDropdownActive(items, props) {
  const localPathname = useLocalPathname();
  const { navbar } = useThemeConfig();
  if (containsActiveItem(items, localPathname)) {
    return true;
  }
  const claimedByAnotherDropdown = navbar.items.some((item) =>
    containsActiveItem(item.items ?? [], localPathname),
  );
  return (
    !claimedByAnotherDropdown &&
    isRegexpStringMatch(props.activeBaseRegex, localPathname)
  );
}

function DropdownNavbarItemDesktop({
  items,
  position,
  className,
  onClick,
  ...props
}) {
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const sectionActive = useDropdownActive(items, props);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target)) {
        return;
      }
      setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("focusin", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("focusin", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      onKeyDown={(e) => {
        if (e.key === "Escape" && showDropdown) {
          e.preventDefault();
          setShowDropdown(false);
          dropdownRef.current?.querySelector(".navbar__link")?.focus();
        }
      }}
      className={clsx("navbar__item", "dropdown", "dropdown--hoverable", {
        "dropdown--right": position === "right",
        "dropdown--show": showDropdown,
      })}>
      <NavbarNavLink
        aria-haspopup="true"
        aria-expanded={showDropdown}
        role="button"
        href={props.to ? undefined : "#"}
        className={clsx("navbar__link", className, {
          "navbar__link--active": sectionActive,
        })}
        {...props}
        onClick={
          props.to
            ? undefined
            : (e) => {
                e.preventDefault();
                setShowDropdown((shown) => !shown);
              }
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
            if (e.repeat) {
              return;
            }
            e.preventDefault();
            setShowDropdown((shown) => !shown);
          }
        }}
      />
      <ul className="dropdown__menu">
        {items.map((childItemProps, i) => (
          <NavbarItem
            isDropdownItem
            activeClassName="dropdown__link--active"
            {...childItemProps}
            key={i}
          />
        ))}
      </ul>
    </div>
  );
}

function DropdownNavbarItemMobile({
  items,
  className,
  position,
  onClick,
  ...props
}) {
  const localPathname = useLocalPathname();
  const sectionActive = useDropdownActive(items, props);
  const { collapsed, toggleCollapsed, setCollapsed } = useCollapsible({
    initialState: () => !sectionActive,
  });

  useEffect(() => {
    if (sectionActive) {
      setCollapsed(!sectionActive);
    }
  }, [localPathname, sectionActive, setCollapsed]);

  return (
    <li
      className={clsx("menu__list-item", {
        "menu__list-item--collapsed": collapsed,
      })}>
      <NavbarNavLink
        role="button"
        className={clsx(
          styles.dropdownNavbarItemMobile,
          "menu__link menu__link--sublist menu__link--sublist-caret",
          className,
          { "menu__link--active": sectionActive },
        )}
        {...props}
        onClick={(e) => {
          e.preventDefault();
          toggleCollapsed();
        }}>
        {props.children ?? props.label}
      </NavbarNavLink>
      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        {items.map((childItemProps, i) => (
          <NavbarItem
            mobile
            isDropdownItem
            onClick={onClick}
            activeClassName="menu__link--active"
            {...childItemProps}
            key={i}
          />
        ))}
      </Collapsible>
    </li>
  );
}

export default function DropdownNavbarItem({ mobile = false, ...props }) {
  const Comp = mobile ? DropdownNavbarItemMobile : DropdownNavbarItemDesktop;
  return <Comp {...props} />;
}
