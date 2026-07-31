import React from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import Heading from "@theme/Heading";
import MDXContent from "@theme/MDXContent";
import DocItemMetaActions from "./MetaActions";
import styles from "./styles.module.css";

export default function DocItemContent({ children }) {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const topLevel = metadata?.slug?.split("/").length - 1 < 2;
  const title = frontMatter.hide_title
    ? null
    : contentTitle ?? metadata.title;

  return (
    <div
      className={clsx(
        ThemeClassNames.docs.docMarkdown,
        "markdown",
        topLevel && styles.topLevelDoc,
      )}>
      {title && (
        <header>
          <Heading as="h1">{title}</Heading>
        </header>
      )}
      <DocItemMetaActions />
      <div className={clsx(contentTitle && styles.hideContentTitle)}>
        <MDXContent>{children}</MDXContent>
      </div>
    </div>
  );
}
