import React from "react";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import clsx from "clsx";

export function Cards({ children }) {
  return <div className={styles.cards}>{children}</div>;
}

export function ResponsiveCards({ children }) {
  return (
    <div className={clsx(styles.cards, styles.responsiveCards)}>
      {children}
    </div>
  );
}

function CardContent({
  icon: Icon,
  title,
  body,
  iconSize,
  titleClassName,
  bodyClassName,
  withReadMore,
}) {
  return (
    <>
      {Icon ? <Icon size={iconSize} aria-hidden="true" /> : null}
      {title ? <h3 className={titleClassName}>{title}</h3> : null}
      {body ? <div className={bodyClassName}>{body}</div> : null}
      {withReadMore ? <span className={styles.readMore}>Read more</span> : null}
    </>
  );
}

export function Card({ icon, title, body, link }) {
  return (
    <Link to={link} className={clsx(styles.cardLink, styles.card)}>
      <CardContent
        icon={icon}
        title={title}
        body={body}
        iconSize="2rem"
        titleClassName={styles.title}
        bodyClassName={styles.body}
        withReadMore
      />
    </Link>
  );
}

export function ResponsiveCard({ icon, title, body, link }) {
  return (
    <Link
      to={link}
      className={clsx(styles.cardLink, styles.card, styles.responsiveCard)}>
      <CardContent
        icon={icon}
        title={title}
        body={body}
        iconSize="2rem"
        titleClassName={styles.title}
        bodyClassName={styles.body}
        withReadMore
      />
    </Link>
  );
}

export function CardSmall({ icon, title, body, link }) {
  return (
    <Link
      to={link}
      className={clsx(styles.cardLink, styles.cardSmallLink, styles.cardSmall)}>
      <CardContent
        icon={icon}
        title={title}
        body={body}
        iconSize="2rem"
        titleClassName={styles.titleSmall}
        bodyClassName={styles.bodySmall}
      />
    </Link>
  );
}
