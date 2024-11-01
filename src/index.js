import m from "mithril";

import "@fontsource/roboto-mono"
import "./app.css";

import { Page as Home } from "./views/HomePage";
import { Page as Numbers } from "./views/NumbersPage";

m.route(document.body, "/", {
  "/": Home,
  "/numbers": Numbers,
})
