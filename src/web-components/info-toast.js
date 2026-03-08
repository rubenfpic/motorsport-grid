import { LitElement, html, css } from 'lit'

class InfoToast extends LitElement {
  constructor() {
    super()
    this.open = false
    this.message = ''
    this.timer = null
  }

  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      message: { type: String },
    }
  }

  static get styles() {
    return css`
      div {
        background-color: rgb(255, 243, 205);
        border-bottom: 0.25rem solid rgb(255, 230, 156);
        border-radius: 0.5rem;
        color: black;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        position: fixed;
        top: 0;
        left: 50%;
        width: 80%;
        max-width: 24rem;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.16);
        transition:
          transform 180ms ease,
          opacity 180ms ease;
        opacity: 0;
      }
      button {
        border: none;
        padding: 0;
        height: 1.5rem;
        width: 1.5rem;
        font-size: 1.5rem;
        line-height: 1.5rem;
        background: transparent;
        color: black;
        cursor: pointer;
      }
      :host([open]) div {
        transform: translateX(-50%) translateY(50%);
        opacity: 1;
      }
      :host(:not([open])) div {
        transform: translateX(-50%) translateY(-150%);
      }
    `
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  show(message) {
    this.clearTimer()
    this.message = message
    this.open = true
    this.timer = setTimeout(() => {
      this.hide()
    }, 3000)
  }

  hide() {
    this.open = false
    this.message = ''
    this.clearTimer()
  }

  disconnectedCallback() {
    this.clearTimer()
    super.disconnectedCallback()
  }

  render() {
    return html`
      <div>
        <p>${this.message}</p>
        <button @click=${() => this.hide()}>🅇</button>
      </div>
    `
  }
}

if (!customElements.get('info-toast')) {
  customElements.define('info-toast', InfoToast)
}
export { InfoToast }
