import m from "mithril";
import { selectNextTab, selectNextInput } from "../utils"
import { Tab, Models } from "./TabView"

function about() {
  return {
    view: function() {
      return m(".flex.flex-col.space-y-6.text-sm", [
        m(".flex.flex-col", [
          m("h1.font-bold", "About"),
          m("span", "Made by Adam with ❤️")
        ]),
        m(".flex.flex-col", [
          m("h1.font-bold", "Shortcuts"),
          m("span", "Tab: cycle tabs"),
          m("span", "Up/Down Arrows: cycle inputs"),
        ])
      ])
    }
  }
}


function header() {
  return {
    view: function() {
      return m("header.flex.justify-between.items-center.px-4", [
        m("h1.text-3xl.font-bold", m("span.text-blue-600", "!"),
          m("span", "BrainYac")
        ),
        m("a.text-sm", { href: "https://github.com/Niceadam/brainyac" },
          m("img", { "src": "./github.svg" })
        )
      ])
    }
  }
}

function main() {
  const tabs = ["numbers"]
  const tab = (name: string) => m("li", m("a", { href: "#" }, m("span.capitalize", name)))

  return {
    view: function() {
      return m("main.uk-card.bg-white.grow.flex.flex-col.space-y-4.justify-between.py-6.px-10",
        m("div.grow.flex.flex-col", [
          m("ul.uk-tab", { "uk-tab": true }, [
            ...tabs.map(event => tab(event)),
            tab("about"),
          ]),
          m("ul.uk-switcher.pt-6.grow.flex", [
            ...tabs.map(event => m(Tab, { event })),
            m(about)
          ]),
        ])
      )
    }
  }
}

function init() {
  document.onkeydown = (e) => {
    switch (e.key) {
      case "Enter":
        const event = document.querySelector("ul.uk-tab > li.uk-active > a > span")!.textContent!
        Models[event].start()
        break;
      case "Tab":
        e.preventDefault()
        selectNextTab()
        break;
      case "ArrowDown":
        e.preventDefault()
        selectNextInput(false)
        break;
      case "ArrowUp":
        e.preventDefault()
        selectNextInput(true)
        break;
      default:
        break;
    }
  };
}

function onremove() {
  document.onkeydown = null
}

function view() {
  return m("main.w-11/12.md:w-4/5.xl:w-2/3.flex.flex-col.py-6.space-y-4", [
    m(header),
    m(main),
  ]);
}

export const Page = {
  oninit: init,
  onremove: onremove,
  view: view
};
