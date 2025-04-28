
// This file adds additional navigation items that will be appended to the navbar
// Import this file in your application where appropriate

import { FileText } from "lucide-react";

export const additionalNavItems = [
  {
    name: "API Docs",
    href: "/api-docs",
    icon: FileText,
    showFor: "all",
  }
];
