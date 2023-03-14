import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

const theme = createTheme({
  theme: "dark",
  settings: {
    background: "#252628",
    foreground: "#a89984",
    caret: "#fff",
    selection: "#c7ac8026",
    selectionMatch: "#c7ac8026",
    lineHighlight: "#a1927d1a",
    gutterBackground: "#252628",
    gutterForeground: "#8a919966",
  },
  styles: [
    {
      tag: [t.function(t.variableName), t.function(t.propertyName), t.url, t.processingInstruction],
      color: "#7daea3",
    },
    { tag: [t.tagName, t.heading], color: "#c7ac80" },
    { tag: t.comment, color: "#54636D" },
    { tag: [t.propertyName], color: "hsl(220, 14%, 71%)" },
    { tag: [t.attributeName, t.number], color: "hsl( 29, 54%, 61%)" },
    { tag: t.className, color: "#7daea3" },
    { tag: t.keyword, color: "#ea6962" },
    { tag: [t.string, t.regexp, t.special(t.propertyName)], color: "#d8a657" },
    // Inline stlying:
    { tag: [t.heading], color: "#c7ac80", fontWeight: "bold" },
    { tag: [t.heading1], color: "#c7ac80", fontSize: "1.6em", fontWeight: "bold" },
    { tag: [t.heading2], color: "#c7ac80", fontSize: "1.4em", fontWeight: "bold" },
    { tag: [t.heading3], color: "#c7ac80", fontSize: "1.2em", fontWeight: "bold" },
    { tag: [t.strikethrough], textDecoration: "line-through" },
    { tag: [t.strong], fontWeight: "bold" },
    { tag: [t.emphasis], fontStyle: "italic" },
    { tag: [t.quote], fontStyle: "italic" },
  ],
});

export default theme;