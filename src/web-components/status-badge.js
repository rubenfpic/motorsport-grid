import { defineCustomElement, h } from 'vue'

const StatusBadge = defineCustomElement({
  props: {
    label: { type: String, default: '' },
    part: { type: String, default: '' },
  },
  render() {
    return h('span', { class: this.class, part: this.part }, this.label)
  },
  styles: [
    `
    span { 
      padding: .25rem .5rem; 
      border-radius: .25rem; 
      background-color: #555;
      color: #ddd; 
    }
  `,
  ],
})

if (!customElements.get('status-badge')) {
  customElements.define('status-badge', StatusBadge)
}

export { StatusBadge }
