// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import {
  Cards,
  Card,
  CardSmall,
  ResponsiveCards,
  ResponsiveCard,
} from "./Cards/index";
import Table from "./Table/index";

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Cards,
  Card,
  CardSmall,
  ResponsiveCards,
  ResponsiveCard,
  table: Table,
};
