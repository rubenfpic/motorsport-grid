import { LitElement, html, css } from 'lit'

class InfoToast extends LitElement {
  constructor() {
    super()
    this.open = false
    this.message = ''
    this.timer = null
    this.delay = 3000
    this.variant = ''
    this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this)
  }

  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      message: { type: String },
      delay: { type: Number },
      variant: { type: String, reflect: true },
    }
  }

  static get styles() {
    return css`
      div {
        background: var(--info-toast-background, gainsboro);
        border-bottom: 0.25rem solid var(--info-toast-highlight-color, grey);
        border-radius: var(--info-toast-border-radius, 0.25rem);
        color: var(--info-toast-color, black);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        position: fixed;
        top: 0;
        left: 50%;
        width: 80%;
        max-width: 24rem;
        box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.2);
        transition:
          transform 180ms ease,
          opacity 180ms ease;
        opacity: 0;
      }
      @media (prefers-reduced-motion: reduce) {
        div {
          transition: none;
        }
      }
      button {
        border: none;
        padding: 0;
        height: 1.5rem;
        width: 1.5rem;
        font-size: 1.5rem;
        line-height: 1.5rem;
        background: transparent;
        color: currentColor;
        cursor: pointer;
      }
      button:focus-visible {
        outline: 0.125rem solid var(--info-toast-highlight-color, grey);
        outline-offset: 0.125rem;
      }
      :host([open]) div {
        transform: translateX(-50%) translateY(50%);
        opacity: 1;
      }
      :host(:not([open])) div {
        transform: translateX(-50%) translateY(-150%);
      }
      :host([variant='success']) {
        div {
          background: lightgreen;
          border-color: green;
        }
        button {
          outline-color: green;
        }
      }
      :host([variant='error']) {
        div {
          background: mistyrose;
          border-color: red;
        }
        button {
          outline-color: red;
        }
      }
      :host([variant='info']) {
        div {
          background: lemonchiffon;
          border-color: goldenrod;
        }
        button {
          outline-color: goldenrod;
        }
      }
      :host([variant='warning']) {
        div {
          background: moccasin;
          border-color: darkorange;
        }
        button {
          outline-color: darkorange;
        }
      }
    `
  }

  show(message) {
    this.clearTimer()
    this.message = message
    this.open = true
    this.timer = setTimeout(() => {
      this.hide()
    }, this.delay)
    document.addEventListener('keydown', this.handleDocumentKeydown)
  }

  hide() {
    this.open = false
    this.message = ''
    this.clearTimer()
    this.dispatchEvent(new CustomEvent('toast-close'))
    document.removeEventListener('keydown', this.handleDocumentKeydown)
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  handleDocumentKeydown(event) {
    if (event.key === 'Escape' && this.open) {
      event.preventDefault()
      this.hide()
    }
  }

  handleCloseClick() {
    this.hide()
  }

  disconnectedCallback() {
    this.clearTimer()
    document.removeEventListener('keydown', this.handleDocumentKeydown)
    super.disconnectedCallback()
  }

  render() {
    return html`
      <div role="status" aria-atomic="true" ?hidden=${!this.open}>
        <p>${this.message}</p>
        <button @click=${this.handleCloseClick} aria-label="Close notification">🅇</button>
      </div>
    `
  }
}

if (!customElements.get('info-toast')) {
  customElements.define('info-toast', InfoToast)
}
export { InfoToast }
