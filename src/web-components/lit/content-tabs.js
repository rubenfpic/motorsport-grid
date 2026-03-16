import { LitElement, html, css } from 'lit'

export class ContentTabs extends LitElement {
  constructor() {
    super()
    this.activeTab = 'overview'
    this.tabList = [
      { id: 'overview', label: 'Details' },
      { id: 'members', label: 'Drivers' },
    ]
    this.activeIndex = 0
  }

  static get properties() {
    return {
      activeTab: { type: String },
    }
  }

  static styles = [
    css`
      :host {
        display: block;
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

    this.activeIndex = targetIndex
    this.activeTab = this.tabList[targetIndex].id

    const nextTab = this.renderRoot.getElementById(`${this.activeTab}Tab`)
    nextTab?.focus()
  }

  render() {
    return html`
      <nav role="tablist" aria-label="Content sections">
        ${this.tabList.map((item) => {
          return html`
            <button
              type="button"
              id=${item.id + 'Tab'}
              role="tab"
              data-tab=${item.id}
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
