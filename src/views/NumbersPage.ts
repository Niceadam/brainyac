import m from 'mithril'
import Timer from "easytimer.js";
import classNames from 'classnames';

import { Model } from '../models/NumbersModel';
import { State } from "../utils";

const countdown = 1
const state = {
  state: State.MemoCountdown,
  timer: new Timer(),
  time: "00:00:00",
  selected: 0,
  rows: 0,
  cols: 48,
  numbers: [0]
}


function memoCell(i: number, j: number) {
  return {
    view: function() {
      const grouping = Model.values.grouping.value();
      const x = state.selected % state.cols;
      const y = Math.floor(state.selected / state.cols);
      const isSelected = y == i && x <= j && j < x + grouping;
      const num = state.numbers[i * state.cols + j];

      const classes = classNames({
        'bg-green-200': isSelected,
        'border-r': j % grouping == (grouping - 1)
      })
      return m("td.w-5.text-xl", { class: classes }, num)
    }
  }
}

function grid(selected: number) {
  const cell = (state.state == State.Memo) ? memoCell : recallCell
  const trows = rangei.map((i) => {
    const index = m("td.text-cyan-600.text-lg.border-r.pl-2.pr-4", `${i + 1}`)
    const tcols = rangej.map((j) => m(cell(i, j)))
    return m("tr", [index, ...tcols])
  })

  return {
    view: function() {
      return m("table.bg-zinc-100.table-fixed.border-spacing-6.border.font-bold.text-center",
        m("tbody", trows)
      )
    }
  }
}

function recallCell(i: number, j: number) {
  return {
    view: function() {
      const grouping = Model.values.grouping.value();
      const x = state.selected % state.cols;
      const y = Math.floor(state.selected / state.cols);
      const num = state.numbers[i * state.cols + j];

      const classes = classNames({
        'border-r': j % grouping == (grouping - 1)
      })
      return m("td.w-5.text-xl", { class: classes },
        m("input[type=text][inputmode=numeric].w-full",
          { oncreate: ({ dom }) => dom.focus() }
        )
      )
    }
  }
}

function setupKeybindings() {
  document.onkeydown = (e) => {
    let grouping = (state.state == State.Memo) ? Model.values.grouping.value() : 1;
    const digits = Model.values.digits.value();
    const { rows, cols, selected } = state

    switch (e.key) {
      case "ArrowLeft":
        state.selected = Math.max(0, selected - grouping);
        break;
      case "ArrowRight":
        state.selected = Math.min(digits - grouping, selected + grouping);
        break;
      case "ArrowUp":
        state.selected = Math.max(0, selected - cols);
        break;
      case "ArrowDown":
        state.selected = Math.min(digits - grouping, selected + cols);
        break;
      case "Escape":
        state.timer.stop()
        if (confirm("Are you sure you want to leave?")) {
          m.route.set("/")
        } else {
          state.timer.start()
        }
        break
      case "Enter":
        switch (state.state) {
          case State.Memo:
            state.timer.reset()
            state.state = State.RecallCountdown
            state.selected = 0
            break;
          case State.Recall:
            state.timer.stop()
            Model.runs.value.push({ points: 60, time: state.time, result: [0, 0] })
            m.route.set("/")
            break;
        }
    }
    m.redraw();
  }
}

var rangei: number[];
var rangej: number[];

function init() {
  // Generate random numbers
  const digits = Model.values.digits.value();
  const range = [...Array(digits).keys()]
  state.numbers = range.map(_ => Math.floor(Math.random() * 10));
  state.rows = Math.ceil(digits / state.cols);
  state.selected = 0

  rangei = [...Array(state.rows).keys()];
  rangej = [...Array(state.cols).keys()];

  // Timer
  state.timer = new Timer()
  state.timer.start();
  state.state = State.MemoCountdown

  state.timer.addEventListener("secondsUpdated", function() {
    switch (state.state) {
      case State.MemoCountdown:
        if (state.timer.getTimeValues().seconds == countdown) {
          state.timer.reset()
          state.state = State.Memo
          setupKeybindings()
        }
        break;
      case State.RecallCountdown:
        if (state.timer.getTimeValues().seconds == countdown) {
          state.timer.reset()
          state.state = State.Recall
          setupKeybindings()
        }
        break;
      case State.Recall:
      case State.Memo:
        state.time = state.timer.getTimeValues().toString();
        break;
    }
    m.redraw();
  });
}

function onremove() {
  document.onkeydown = null
}

function view() {
  const center = (child) => m("section.grow.flex.justify-center.items-center", child)
  const bottom = (text: string) => m("text-xl.text-center.bg-zinc-100.py-4.px-10", text)
  const main = (child) => m("main.w-2/3.flex.flex-col.items-center.py-6.space-y-4", child)

  switch (state.state) {
    case State.RecallCountdown:
    case State.MemoCountdown:
      const seconds = countdown - state.timer.getTimeValues().seconds
      const status = (state.state == State.MemoCountdown) ? "Memorization" : "Recall"
      return main([
        m("span"),
        center(m("span.text-8xl", seconds)),
        bottom(`Starting ${status}..`)
      ])

    case State.Recall:
    case State.Memo:
      return main([
        m("text-center.w-fit.text-2xl.bg-zinc-100.py-4.px-10", state.time),
        center(m(grid(state.selected))),
        bottom("Press Enter to End")
      ])
  }
}

export const Page = {
  oninit: init,
  onremove: onremove,
  view: view
}
