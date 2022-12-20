import './cinematic.css'

function create(parent,  className, type = 'div') {
    const node = document.createElement(type)
    node.className = className
    parent.append(node)
    return node
}

function createText(node, text) {

    return []
}

export default function cinematic(parentId, text, speed = 10) {
    let parent = document.getElementById(parentId)
    if (!parent) {
        console.error('Could not find node with ID', parentId)
        return
    }
    
    const cntr = create(parent, 'cinematic-container')
    const scroll = create(cntr, 'cinematic-scroll')
    scroll.style.height = (speed * 100) + '%'
    const content = create(cntr, 'cinematic-content')

    const fillNodes = createText(content, text)
    const h = scroll.offsetHeight

    cntr.addEventListener("scroll", (event) => {

        console.debug('scroll', cntr.scrollTop / h )
    });
}