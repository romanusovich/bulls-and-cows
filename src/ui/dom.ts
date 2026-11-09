export const el = <K extends keyof HTMLElementTagNameMap>(
    tag: K,
    text = '',
    ...children: Node[]
): HTMLElementTagNameMap[K] => {
    const node = document.createElement(tag)
    node.textContent = text
    node.append(...children)
    return node
}
