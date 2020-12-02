const fs = require('fs')
const parser = require('ini-parser')
const path = require('path')
const translation = parser.parseFileSync(path.join(__dirname, '../translated.ini'))
const template = require('../template.json')
const htmlFiles = Object.keys(template)
let allReady = false

for (let i = 0; i < htmlFiles.length; i++) {
    const currentFile = template[htmlFiles[i]]
    let content = ''
    const translationSection = translation[htmlFiles[i]]
    const bornLine = (currentFile) => {
        for (let l = 0; l < currentFile.length; l++) {
            const line = currentFile[l]
            if (!translationSection) continue
            if (line.jumpLine) content += '\n'
            content += line.properties ? `<${line.type} ${line.properties}>` : `<${line.type}>`
            content += `${line.content === "" ? "" : translationSection[line.content]}`
            if (line.childrens) {
                bornLine(line.childrens)
            }

            content += line.noCloseTag ? `<${line.type}>` : `</${line.type}>`

        }
    }
    bornLine(currentFile)

    if (!htmlFiles[i].includes('static-pages-')) {
        fs.writeFileSync(`${htmlFiles[i]}-${translation.Common.LanguageCode}.htm`, content)
    } else {
        fs.writeFileSync(htmlFiles[i] + '.htm', content)
    }

    if ((i + 1)=== htmlFiles.length) {
        allReady = true
    }
}

fs.mkdir('static-pages', { recursive: true }, err => {
    if (err) {
        console.log(err)
    }
})

const files = ['static-pages-about.htm', 'static-pages-addons.htm', 'static-pages-add-ons.noteskins.htm', 'static-pages-faq.htm', 'static-pages-help-support.htm']

for (let i = 0; i < files.length; i++) {

    if (!allReady) {
        i = i - 1
        continue // Don't cringe me
    }
    fs.rename(files[i], `static-pages/${files[i].replace('static-pages-', '')}`, (err) => {
        if (err) console.log(err)
    })
}