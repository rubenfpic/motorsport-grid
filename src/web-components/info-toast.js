import { LitElement, html, css } from 'lit'

class InfoToast extends LitElement {
  constructor() {
    super()
    this.open = false
    this.message = ''
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
        background-color: beige;
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

  show() {
    this.open = true
  }

  hide() {
    this.open = false
    this.dispatchEvent(new Event('close'))
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
