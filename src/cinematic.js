import './cinematic.css'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

let renderId = null

function create(parent,  className, type = 'div') {
    const node = document.createElement(type)
    node.className = className
    if (parent){
        parent.appendChild(node)
    }
    return node
}

function getRowsAndCols(parent) {
 
    const node = document.createElement('span')
    node.innerHTML = 'A'
    parent.appendChild(node)
    
    const parentW = parent.offsetWidth
    const parentH = parent.offsetHeight
    const charW = node.offsetWidth
    const charH = node.offsetHeight
    const rows = Math.floor(parentH / charH)
    const cols = Math.floor(parentW / charW)

    parent.innerHTML = ''
    return [rows, cols]
}

function getTokens(text, rows) {
    let tokens = text.split(' ')
    if (tokens.length > rows - 2) {
    
        let newTokens = []
        let tokensPerRow = Math.ceil(tokens.length / (rows - 2))
        console.debug('Merge', tokensPerRow, rows)

        let merged = []
        tokens.forEach((token,i) => {
            merged.push(token)
            if (merged.length === tokensPerRow) {
                newTokens.push(merged.join('').toUpperCase())
                merged = []
            }
        })
        tokens = newTokens
    }
    while (tokens.length < rows - 2) {
        let pos = Math.round(tokens.length * Math.random())
        tokens.splice(pos,0,'')
    }
    return tokens
}

function createText(parent, text, spaceChars = 10) {
    const randomNodes = []
    const [rows, cols] = getRowsAndCols(parent)

    const tokens = getTokens(text, rows)
    console.debug('tokens', tokens)


   
    const content = document.createElement('div')
    const width = (cols - spaceChars)
    for (let r = 0; r < rows; r++) {
        let row = document.createElement('div')
        row.className = 'cinematic-content-row'
        let tokenOffset = 10000
        let token = ''
        if (r > 0 && tokens.length > 0) {
            token = tokens.shift()
            tokenOffset = (cols - spaceChars) - token.length
            tokenOffset = Math.max(1, Math.round(tokenOffset * Math.random()))   
        }

        for (let c = 0; c < width; c++) {
            const node = document.createElement('span')
            node.style.color = `rgba(0,0,0,${0.8 + 0.2 * Math.random()})`

            if (token !== '' && c >= tokenOffset && (tokenOffset + token.length) > c ) {
                const char = token[c - tokenOffset]
                node.innerHTML = char
                node.className = 'cinematic-content-correct'
            } else {
                const char = Math.floor(Math.random() * chars.length)
                node.innerHTML = chars[char]
                randomNodes.push(node)
            }
            row.appendChild(node)
        }
        content.appendChild(row)
    }
    parent.appendChild(content)

    return randomNodes
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

    const randomNodes = createText(content, text)
    const h = scroll.offsetHeight

    cntr.addEventListener("scroll", (event) => {
        const p = cntr.scrollTop / h
        renderP(p, randomNodes)
    });
}

function renderP(p, randomNodes) {
    if (renderId) {
        cancelAnimationFrame(renderId)
    }
    renderId = requestAnimationFrame(() => {
        let end = Math.ceil(p * randomNodes.length)
        randomNodes.forEach((node, i) => {
            if (i < end) {
                node.className = 'cinematic-content-strike'
            } else {
                node.className = ''
            }
        })
    })
}