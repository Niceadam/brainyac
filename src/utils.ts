import UIkit from 'uikit';
import $ from 'jquery';

export enum State {
  MemoCountdown,
  RecallCountdown,
  Memo,
  Recall
}

export function leaveConfirmation() {
  window.onbeforeunload = () => {
    return "Are you sure you want to leave?";
  }
}

export function selectNextTab() {
  let tab = UIkit.tab(document.querySelector('ul[uk-tab]')!);
  let tabs = document.querySelectorAll('ul[uk-tab] li');
  let currentIndex = Array.from(tabs).findIndex(tab => tab.classList.contains('uk-active'));
  let nextIndex = (currentIndex + 1) % tabs.length;
  tab.show(nextIndex);
}

export function selectNextInput(reverse: boolean) {
  const inputs = $('input:visible');
  const currentIndex = inputs.index(document.activeElement!);
  const nextIndex = (currentIndex + (reverse ? -1 : 1) + inputs.length) % inputs.length;
  inputs.eq(nextIndex).focus();
}

export function store(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
