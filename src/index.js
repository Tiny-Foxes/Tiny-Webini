const fs = require('fs')
const ini = require('ini')
const path = require('path')
const translation = ini.parse(fs.readFileSync(path.join(__dirname, '../translated.ini'), 'utf-8'))
const template = require(path.resolve(__dirname, '../template.json'))
const htmlFiles = Object.keys(template)

for (let i = 0; i < htmlFiles.length; i++) {
    const currentFile = template[htmlFiles[i]]
    let content = ''
    const translationSection = translation[htmlFiles[i]]

    const bornLine = (currentFile) => {
        for (let l = 0; l < currentFile.length; l++) {
            const line = currentFile[l]
            if (line.jumpLine) content += '\n'
            content += line.properties ? `<${line.type} ${line.properties}>` : `<${line.type}>`
            content += `${translationSection[line.content === "" ? "" : line.content]}`

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
        fs.writeFileSync(htmlFiles[i].htm, content)
    }
}