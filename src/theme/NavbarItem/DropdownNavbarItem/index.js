import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import {
  isRegexpStringMatch,
  useCollapsible,
  Collapsible,
} from "@docusaurus/theme-common";
import {
  isSamePath,
  useLocalPathname,
} from "@docusaurus/theme-common/internal";
import NavbarNavLink from "@theme/NavbarItem/NavbarNavLink";
import NavbarItem from "@theme/NavbarItem";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import { useLocation } from "@docusaurus/router";

// Paths owned by OTHER navbar items. The Docs dropdown highlights
// on every path that does NOT start with one of these.
const EXCLUDED_PATHS = [];

function isDocsDropdown(className) {
  return className?.includes("docs-dropdown");
}

function shouldDropdownBeActive(pathname) {
  return !EXCLUDED_PATHS.some((path) => pathname.startsWith(path));
}

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
function containsActiveItems(items, localPathname) {
  return items.some((item) => isItemActive(item, localPathname));
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
  const [currentDocTitle, setCurrentDocTitle] = useState("");
  const location = useLocation();

  // Determine if this dropdown should show as active
  const isActive =
    isDocsDropdown(className) && shouldDropdownBeActive(location.pathname);

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
  }, [dropdownRef]);

  useEffect(() => {
    function getDocTitle(listOfItems, index) {
      if (listOfItems.length === index) {
        return null;
      }

      if (listOfItems[index]?.dropdown) {
        return getDocTitle(listOfItems[index]?.dropdown, 0);
      } else if (listOfItems[index]?.to === location.pathname) {
        return listOfItems[index]?.label;
      } else {
        index++;
        return getDocTitle(listOfItems, index);
      }
    }

    setCurrentDocTitle(getDocTitle(items, 0));
  }, [location.pathname]);
  return (
    <div
      ref={dropdownRef}
      className={clsx("navbar__item", "dropdown", "dropdown--hoverable", {
        "dropdown--right": position === "right",
        "dropdown--show": showDropdown,
        "dropdown--active": isActive,
      })}>
      <NavbarNavLink
        aria-haspopup="true"
        aria-expanded={showDropdown}
        role="button"
        href={props.to ? undefined : "#"}
        className={clsx("navbar__link", className)}
        {...props}
        label={currentDocTitle || props?.label}
        onClick={props.to ? undefined : (e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            setShowDropdown(!showDropdown);
          }
        }}></NavbarNavLink>
      <DropdownItems items={items} />
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

  const containsActive = containsActiveItems(items, localPathname);
  const { collapsed, toggleCollapsed, setCollapsed } = useCollapsible({
    initialState: () => !containsActive,
  });
  useEffect(() => {
    if (containsActive) {
      setCollapsed(!containsActive);
    }
  }, [localPathname, containsActive, setCollapsed]);
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
        )}
        {...props}
        onClick={(e) => {
          e.preventDefault();
          toggleCollapsed();
        }}>
        {props.children ?? props.label}
      </NavbarNavLink>
      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        {items.map((childItemProps, i) =>
          childItemProps.hasOwnProperty("dropdown") ? (
            <DropdownItemsMobile
              items={childItemProps.dropdown}
              key={i}
              onClick={onClick}
              {...props}
            />
          ) : (
            <NavbarItem
              mobile
              isDropdownItem
              onClick={onClick}
              activeClassName="menu__link--active"
              {...childItemProps}
              key={i}
            />
          ),
        )}
      </Collapsible>
    </li>
  );
}

function DropdownItemsMobile({ items, onClick, className, ...props }) {
  const location = useLocation();
  function getDocTitle(listOfItems, index) {
    if (listOfItems.length === index) {
      return false;
    }

    if (listOfItems[index]?.dropdown) {
      return getDocTitle(listOfItems[index]?.dropdown, 0);
    } else if (listOfItems[index]?.to === location.pathname) {
      return true;
    } else {
      index++;
      return getDocTitle(listOfItems, index);
    }
  }
  const containsActive = getDocTitle(items, 0);
  const { collapsed, toggleCollapsed, setCollapsed } = useCollapsible({
    initialState: () => !containsActive,
  });
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

function DropdownItems({ items }) {
  return (
    <ul className="dropdown__menu">
      {items.map((childItemProps, i) => {
        const [dropdownStatus, setDropdownStatus] = useState(false);

        return childItemProps.hasOwnProperty("dropdown") ? (
          <li>
            <div
              onClick={() => setDropdownStatus(!dropdownStatus)}
              className="has-dropdown">
              <Link className="dropdown__link">{childItemProps.label}</Link>

              {dropdownStatus ? (
                <IoMdArrowDropdown className="arrow" />
              ) : (
                <IoMdArrowDropright
                  className="arrow"
                  style={{ rotate: "180" }}
                />
              )}
            </div>

            <ul className={`${dropdownStatus && "active-nested-dropdown"}`}>
              {childItemProps.dropdown.map((data) => {
                return (
                  <li>
                    <Link
                      to={data?.to}
                      className="dropdown__menu_nested_items dropdown__link">
                      {data.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ) : (
          <NavbarItem
            isDropdownItem
            activeClassName="dropdown__link--active"
            {...childItemProps}
            key={i}
          />
        );
      })}
    </ul>
  );
}

export default function DropdownNavbarItem({ mobile = false, ...props }) {
  const Comp = mobile ? DropdownNavbarItemMobile : DropdownNavbarItemDesktop;
  return <Comp {...props} />;
}
