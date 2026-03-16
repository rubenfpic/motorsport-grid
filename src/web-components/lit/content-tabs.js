import { LitElement, html, css } from 'lit'

export class ContentTabs extends LitElement {
  constructor() {
    super()
    this.activeTab = 'overview'
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

  render() {
    return html`
      <nav role="tablist" aria-label="Content sections">
        <button
          type="button"
          id="overviewTab"
          role="tab"
          data-tab="overview"
          aria-selected=${this.activeTab === 'overview'}
          aria-controls="overviewPanel"
          @click="${this.handleActiveTab}"
        >
          Details
        </button>
        <button
          type="button"
          id="membersTab"
          role="tab"
          data-tab="members"
          aria-selected=${this.activeTab === 'members'}
          aria-controls="membersPanel"
          @click="${this.handleActiveTab}"
        >
          Drivers
        </button>
      </nav>
      <section
        id="overviewPanel"
        role="tabpanel"
        aria-labelledby="overviewTab"
        ?hidden=${this.activeTab !== 'overview'}
      >
        <slot name="overview"></slot>
      </section>
      <section
        id="membersPanel"
        role="tabpanel"
        aria-labelledby="membersTab"
        ?hidden=${this.activeTab !== 'members'}
      >
        <slot name="members"></slot>
      </section>
    `
  }
}

if (!customElements.get('content-tabs')) {
  customElements.define('content-tabs', ContentTabs)
}
