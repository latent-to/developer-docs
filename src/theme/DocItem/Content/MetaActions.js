import React from "react";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./styles.module.css";

export default function DocItemMetaActions() {
  const { metadata } = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const { enableEditUrlLinks, enableIssueLinks, issueBaseUrl } =
    siteConfig.customFields;

  const editUrl = metadata?.editUrl;
  const lastUpdatedAt = metadata?.lastUpdatedAt;
  const formattedLastUpdatedAt = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : null;

  const showEdit = editUrl && enableEditUrlLinks;
  const showIssue = enableIssueLinks && issueBaseUrl;

  if (!formattedLastUpdatedAt && !showEdit && !showIssue) {
    return null;
  }

  return (
    <div className={styles.metaRow}>
      {formattedLastUpdatedAt && (
        <span className={styles.lastEdit}>
          Last updated: {formattedLastUpdatedAt}
        </span>
      )}

      {(showEdit || showIssue) && (
        <div className={styles.metaActions}>
          {showEdit && (
            <a
              className={styles.metaLink}
              href={editUrl}
              target="_blank"
              rel="noopener noreferrer">
              Submit a PR
            </a>
          )}

          {showIssue && (
            <a
              className={styles.metaLink}
              href={issueBaseUrl}
              target="_blank"
              rel="noopener noreferrer">
              Submit an issue
            </a>
          )}
        </div>
      )}
    </div>
  );
}
