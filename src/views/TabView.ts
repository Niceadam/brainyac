import m from "mithril";
import { Model as NumbersModel } from "../models/NumbersModel";

export const Models = {
  numbers: NumbersModel,
}

function runs() {
  return {
    view: function({ attrs }) {
      const runs = Models[attrs.event].runs
      return m(".uk-card.p-4", [
        m("table.uk-table.uk-table-divider.uk-table-striped",
          m("thead", [
            m("tr", [
              m("th", "Points"),
              m("th", "Time"),
              m("th", "Result"),
            ])
          ]),
          m("tbody", runs.value.map((run, i) => {
            return m("tr", [
              m("td", run.points),
              m("td", run.time),
              m("td", `${run.result[0]}/${run.result[1]}`),
              m("td",
                m("button.uk-icon-button.uk-icon-button-outline.size-6",
                  { onclick: () => runs.delete(i) },
                  m("uk-icon", { "icon": "trash" })
                )
              )
            ])
          })),
        )
      ])
    }
  }
}

function input() {
  return {
    view: function({ attrs }) {
      const value = attrs.value
      return [
        m("label.uk-form-label", value.title),
        m(".uk-form-controls",
          m("input[type=text][inputmode=numeric].uk-input", {
            placeholder: value.placeholder(),
            value: value.value(),
            class: value.valid ? "" : "uk-form-danger",
            oninput: (e) => {
              value.value(e.target.value)
              value.validate()
            }
          })
        )
      ]
    }
  }
}

export function Tab() {
  return {
    view: function({ attrs }) {
      const values = Models[attrs.event].values
      const inputs = values.list.map(value =>
        m(input, { value: values[value] })
      )

      return m(".grow.grid.grid-cols-2.gap-x-6", [
        m(runs, { event: attrs.event }),
        m("div.flex.flex-col.justify-between", [
          m(".grid.grid-cols-2.gap-y-4.h-fit", [
            ...inputs,
            m("span"),
          ]),
          m("span.text-sm.text-right", "Press Enter to Start")
        ]),
      ])
    }
  }
}
