import m from 'mithril'
import stream from 'mithril/stream'
import { store } from '../utils'

export const Model = {
  start() {
    // Validate values
    for (const key of Model.values.list) {
      const value = Model.values[key]
      if (!value.valid) return
      if (value.value() == "") {
        value.value(value.default)
      } else {
        value.value(parseInt(value.value()))
      }
    }

    m.route.set("/numbers")
  },

  runs: {
    value: [],
    delete(i) {
      delete Model.runs.value[i]
      store("numbers.runs", Model.runs.value)
    }
  },

  values: {
    list: ["digits", "grouping"],
    digits: {
      title: "Digits",
      value: stream(60),
      default: 10,
      placeholder: () => `Default: ${Model.values.digits.default}`,
      valid: true,
      validate() {
        const value = Model.values.digits
        value.valid = (value.value() < 1000 && value.value() > 0) || value.value() == ""
      }
    },
    grouping: {
      title: "Grouping",
      value: stream(2),
      default: 2,
      placeholder: () => `Default: ${Model.values.grouping.default}`,
      valid: true,
      validate() {
        const value = Model.values.grouping
        value.valid = ["1", "2", "3", "4"].includes(value.value()) || value.value() == ""
      }
    },
  }
}


if (localStorage.getItem("numbers.runs")) {
  Model.runs.value = JSON.parse(localStorage.getItem("numbers.runs"))
} else {
  store("numbers.runs", Model.runs.value)
}
