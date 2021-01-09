// Page Elements
const homeElem = document.getElementById('home')
const aboutElem = document.getElementById('about')
const downloadsElem = document.getElementById('downloads')
const faqElem = document.getElementById('faq')
const controllersElem = document.getElementById('controllers')
const noteskinsElem = document.getElementById('noteskins')
const toolsElem = document.getElementById('tools')
const historicalChangelogElem = document.getElementById('historical-changelog')
const communityPoliciesElem = document.getElementById('community-policies')
const jumbatronPlaceElem = document.getElementById('jumbatronPlaceholder')
const contentDivElem = document.getElementById('contentPlaceholder')
const translationUpdate = document.getElementById('requestTranslationUpdate')
const toggleStringsView = document.getElementById('toggleStringsView')
const highlightElements = document.getElementById('highlightElements')
const generateFiles = document.getElementById('generateFiles')
const toTranslate = {
    'default': ['footer-license'],
    'home': ['hero-intro', 'front-what-is-outfox', 'front-what-is-stepmania', 'front-welcome', 'front-community'],
    'about': ['static-pages-about'],
    'downloads': ['alpha-notice'],
    'faq': ['static-pages-faq'],
    'controllers': ['static-pages-help-support'],
    'noteskins': ['static-pages-add-ons.noteskins'],
    'tools': ['static-pages-addons'],
    'historicalChangelog': ['static-pages-historical-changelog'],
    'communityPolicies': ['static-pages-community-policies']
}
window.tinyWebGlobal = {
    actualPage: 'default',
    files: [],
    keyViewMode: false,
    translation: null,
    highlight: false,
    template: null,
    pathToGeneratedFiles: ''
}
// Page Elements End

let jumbatron

// Actual files
window.api.receive('fromMain', (data) => {

    if (data.length === 2) {

        switch (data[0]) {
            case 'translation':
                window.tinyWebGlobal.translation = data[1]
                translationReady(data[1])
                break
            case 'jumbatron':
                jumbatron = data[1]
                break
            case 'translationUpdate':
                translationReload(data[1], window.tinyWebGlobal.actualPage)
                break
            case 'template':
                window.tinyWebGlobal.template = data[1]
                break
            case 'pathGeneratedFiles':
                window.tinyWebGlobal.pathToGenerateFiles = data[1]
                break
            default:
                break
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            // const docu = new DOMParser().parseFromString(data[i], 'text/xml')
            window.tinyWebGlobal.files[i] = data[i]
        }
    }
})
console.log('sending start to main')
window.api.send('toMain', 'start')
//
/**
 * @constant
 * @type {HTMLElement[]}
 */

const pages = [homeElem, aboutElem, downloadsElem, faqElem, controllersElem, noteskinsElem, toolsElem, historicalChangelogElem, communityPoliciesElem]
const pagesStr = ['home', 'about', 'downloads', 'faq', 'controllers', 'noteskins', 'tools', 'historicalChangelog', 'communityPolicies']
/**
 * 
 * @param {string} page 
 * @param {object} translation
 * @param {string} reason
 */
const translate = (page, translation) => {
    const sections = toTranslate[page]
    for (let i = 0; i < sections.length; i++) {
        const sec = sections[i]
        const translatedSection = translation[sec]
        const keys = Object.keys(translatedSection)

        for (let i = 0; i < keys.length; i++) {
            const elem = document.querySelector(`[data-translation='${keys[i]}']`)
            if (elem) {
                const content = window.tinyWebGlobal.keyViewMode ? keys[i] : translatedSection[keys[i]]
                elem.innerHTML = window.tinyWebGlobal.highlight ? `<mark>${content}</mark>` : content
            }
        }
    }
}

toggleStringsView.onclick = (() => {
    window.tinyWebGlobal.keyViewMode = !window.tinyWebGlobal.keyViewMode
    window.api.send('toMain', 'translationUpdate')
    // translate(window.tinyWebGlobal.actualPage, window.tinyWebGlobal.translation)
})

highlightElements.onclick = (() => {
    window.tinyWebGlobal.highlight = !window.tinyWebGlobal.highlight
    window.api.send('toMain', 'translationUpdate')
    // translate(window.tinyWebGlobal.actualPage, window.tinyWebGlobal.translation)
})

generateFiles.onclick = (() => {
    const languageCode = window.tinyWebGlobal.translation.Common.LanguageCode === "en" ? "" : `-${window.tinyWebGlobal.translation.Common.LanguageCode}`
    const htmlFiles = Object.keys(window.tinyWebGlobal.template)
    let allReady = false
    for (let i = 0; i < htmlFiles.length; i++) {
        const currentFile = window.tinyWebGlobal.template[htmlFiles[i]]
        let content = ''
        const translationSection = window.tinyWebGlobal.translation[htmlFiles[i]]
        const bornLine = (currentFile) => {
            for (let l = 0; l < currentFile.length; l++) {
                const line = currentFile[l]
                if (!translationSection) {
                    continue
                }
                if (line.jumpLine) content += '\n'
                content += line.properties ? `<${line.type} ${line.properties}>` : `<${line.type}>`
                content += `${line.content === "" || !line.content ? "" : translationSection[line.content]}`
                if (line.childrens) {
                    bornLine(line.childrens)
                }

                content += line.noCloseTag ? `>` : `</${line.type}>`

            }
        }
        // console.log(currentFile)
        bornLine(currentFile)

        if (!htmlFiles[i].includes('static-pages-')) {
            window.api.send('toMain', ['writeFile', [`${window.tinyWebGlobal.pathToGenerateFiles}/${htmlFiles[i]}${languageCode}.htm`, content]])
            // fs.writeFileSync(`${window.tinyWebGlobal.pathToGenerateFiles}/${htmlFiles[i]}${languageCode}.htm`, content)
        } else {
            window.api.send('toMain', ['writeFile', [window.tinyWebGlobal.pathToGenerateFiles + '/' + htmlFiles[i] + '.htm', content]])
            // fs.writeFileSync(window.tinyWebGlobal.pathToGenerateFiles + '/' + htmlFiles[i] + '.htm', content)
        }

        if ((i + 1) === htmlFiles.length) {
            allReady = true
        }
    }

    window.api.send('toMain', ['mkdir', window.tinyWebGlobal.pathToGenerateFiles + '/' + 'static-pages' + languageCode])
    /*
    fs.mkdir(window.tinyWebGlobal.pathToGenerateFiles + '/' + 'static-pages' + languageCode, { recursive: true }, err => {
        if (err) {
            console.log(err)
        }
    })
    */

    const files = ['static-pages-historical-changelog.htm', 'static-pages-about.htm', 'static-pages-addons.htm', 'static-pages-add-ons.noteskins.htm', 'static-pages-faq.htm', 'static-pages-help-support.htm', 'static-pages-community-policies.htm']

    for (let i = 0; i < files.length; i++) {

        if (!allReady) {
            i = i - 1
            continue // Don't cringe me
        }
        window.api.send('toMain', ['rename', [window.tinyWebGlobal.pathToGenerateFiles + '/' + files[i], `${window.tinyWebGlobal.pathToGenerateFiles}/static-pages${languageCode}/${files[i].replace('static-pages-', '')}`]])
        /*
        fs.rename(window.tinyWebGlobal.pathToGenerateFiles + '/' + files[i], `${window.tinyWebGlobal.pathToGenerateFiles}/static-pages${languageCode}/${files[i].replace('static-pages-', '')}`, (err) => {
            if (err) console.log(err)
        })
        */
    }
})
/**
 * 
 * @param {object} translation 
 */
const translationReady = (translation) => {
    translate('default', translation)

    for (let i = 0; i < pages.length; i++) {
        // Special case for home page with jumbatron
        if (i === 0) {
            pages[0].onclick = (_) => {
                jumbatronPlaceElem.innerHTML = jumbatron
                contentDivElem.innerHTML = window.tinyWebGlobal.files[0]
                translate(pagesStr[0], translation)
                window.tinyWebGlobal.actualPage = 'home'
            }
            continue
        }
        pages[i].onclick = (_) => {
            if (window.tinyWebGlobal.actualPage === 'home') {
                jumbatronPlaceElem.innerHTML = ''
            }
            window.tinyWebGlobal.actualPage = pagesStr[i]
            contentDivElem.innerHTML = 'hi' //`${window.tinyWebGlobal.files[i]}`
            translate(pagesStr[i], translation)
        }
    }

    translationUpdate.onclick = (() => {
        window.api.send('toMain', 'translationUpdate')
    })
}

/**
 * 
 * @param {object} translation 
 * @param {string} [actualPage] 
 */
const translationReload = (translation, actualPage) => {
    // The default page is always available in every page, so always update it.
    translate('default', translation)
    // console.log(actualPage)
    translate(actualPage, translation)
}