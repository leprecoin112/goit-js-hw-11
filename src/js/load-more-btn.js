export default class LoadMoreBtn {
  constructor({ selector, hidden = false }) {
    this.btnEl = document.querySelector(selector);

    hidden && this.hide();
  }
  enable() {
    this.btnEl.disable = false;
    this.btnEl.classList.remove('load');
  }

  disable() {
    this.btnEl.disable = true;
    this.btnEl.classList.add('load');
  }

  show() {
    this.btnEl.classList.remove('is-hidden');
  }

  hide() {
    this.btnEl.classList.add('is-hidden');
  }
}
