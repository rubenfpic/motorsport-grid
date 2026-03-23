import { LitElement, html, css } from 'lit'

export class ContentTabs extends LitElement {
  constructor() {
    super()
    this.tabList = []
    this.activeTab = ''
  }

  static get properties() {
    return {
      activeTab: { type: String },
      tabList: { type: Array },
    }
  }

  static styles = [
    css`
      :host {
        nav {
          position: relative;
          display: flex;
          gap: 0;
          border-bottom: 0.0625rem solid var(--ct-primary, grey);
          margin: 1rem 0 0;

          &::after {
            content: '';
            display: block;
            position: absolute;
            bottom: 0;
            left: 0;
            width: var(--ct-tab-width);
            height: 0.2225rem;
            transform: translateX(calc(var(--ct-active-index) * 100%));
            transition: transform 500ms ease;
            background: var(--ct-primary, white);
          }
        }

        button {
          position: relative;
          display: block;
          padding: 0.75rem 1.25rem;
          font-family: var(--ct-tab-font-family, 'Arial');
          font-size: 1.125rem;
          width: var(--ct-tab-width);
          height: 100%;
          margin: 0;
          border: none;
          cursor: pointer;
          background: var(--ct-tab-color);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;

          &[role='tab'][aria-selected='true'] {
          }

          &[role='tab'][aria-selected='false'] {
          }

          &[role='tab']:focus-visible {
            outline: none;
            box-shadow: inset 0 0.125rem 0 var(--ct-primary);
          }
        }

        @media (forced-colors: active) {
          button[role='tab']:focus-visible {
            outline: 0.125rem solid CanvasText;
            box-shadow: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          nav::after {
            transition: none;
          }
        }

        section {
          font-family: var(--ct-content-font-family, 'Arial');

          ::slotted(*) {
            padding-top: 2rem;
          }
        }
      }
    `,
  ]

  handleActiveTab(event) {
    const tabName = event.currentTarget.dataset.tab

    this.activeTab = tabName
  }

  handleTabKeydown(event) {
    const currentId = event.currentTarget.dataset.tab
    const currentIndex = this.tabList.findIndex((t) => t.id === currentId)

    if (currentIndex < 0) return

    let targetIndex = currentIndex

    if (event.key === 'ArrowRight') {
      targetIndex = (currentIndex + 1) % this.tabList.length
    } else if (event.key === 'ArrowLeft') {
      targetIndex = (currentIndex - 1 + this.tabList.length) % this.tabList.length
    } else if (event.key === 'Home') {
      targetIndex = 0
    } else if (event.key === 'End') {
      targetIndex = this.tabList.length - 1
    } else {
      return
    }

    event.preventDefault()

    this.activeTab = this.tabList[targetIndex].id

    const nextTab = this.renderRoot.getElementById(`${this.activeTab}Tab`)
    nextTab?.focus()
  }

  willUpdate(changedProperties) {
    if (!changedProperties.has('tabList')) return
    if (this.tabList.length === 0) {
      this.activeTab = ''
      return
    }
    if (!this.activeTab || !this.tabList.some((tab) => tab.id === this.activeTab)) {
      this.activeTab = this.tabList[0].id
    }
  }

  render() {
    const activeIndex = this.tabList.findIndex((t) => t.id === this.activeTab)
    const safeIndex = activeIndex >= 0 ? activeIndex : 0

    return html`
      <nav
        style=${`--ct-tab-count:${this.tabList.length}; --ct-active-index:${safeIndex};`}
        role="tablist"
        aria-orientation="horizontal"
        aria-label="Content sections"
      >
        ${this.tabList.map((item) => {
          return html`
            <button
              type="button"
              id=${item.id + 'Tab'}
              role="tab"
              data-tab=${item.id}
              data-label=${item.label}
              aria-selected=${this.activeTab === item.id}
              aria-controls=${item.id + 'Panel'}
              tabindex=${this.activeTab === item.id ? '0' : '-1'}
              @click=${this.handleActiveTab}
              @keydown=${this.handleTabKeydown}
            >
              ${item.label}
            </button>
          `
        })}
      </nav>
      ${this.tabList.map((item) => {
        return html`
          <section
            id="${item.id}Panel"
            role="tabpanel"
            aria-labelledby="${item.id}Tab"
            ?hidden=${this.activeTab !== item.id}
          >
            <slot name="${item.id}"></slot>
          </section>
        `
      })}
    `
  }
}

if (!customElements.get('content-tabs')) {
  customElements.define('content-tabs', ContentTabs)
}
