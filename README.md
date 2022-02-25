# Webini (ARCHIVED)

## THE PROJECT IS NOW ARCHIVED AND WILL NOT LONGER BE UPDATED

The Project OutFox backend has been updated and no longer requires such hacky tools for translation development, if you wish to translate https://projectoutfox.com/, please contact us under our [Discord Server](https://discord.gg/cN4TjgQdcA)

** **


Translate [OutFox Website](https://projectmoon.dance/) with the same style StepMania uses for its translations.

## Usage

Grab the [latest release](https://github.com/Tiny-Foxes/Tiny-Webini/releases) and download the zip file that is not the source code, extract it and open Tiny-Webini.exe

To make changes go to `resources` and `app` folder, you can make changes to the page using the `translated.ini` file.

When making changes to `translated.ini` files, go to the end of the screen and click where it says to update the ini file.

There are tools you can utilize in the navbar after selecting the "Translator View Tools"

### Toggle Key String View

Will make so key strings are show instead of the translated string, this is good for finding which key you need to change so the string is affected.

### Highlight Translatable Elements

Will highlight elements that can be translated.
### Generate HTML Files

Will generate the HTML files needed to place in the OutFox Website Backend using the strings you translated from the `translated.ini`.

They'll be located inside the `generatedFiles` folder, please don't spam click this and I recommend to delete files before generating again.
## Debugging

You'll need to create a fs variable with the fs library inside the ``ini-parser`` package, for some reason it's not included by default.

You'll notice that most files from releases aren't there, releases uses [electron-binaries](https://github.com/electron/electron/releases) and places the source inside the resources folder.

### What is template.json

It's reason is to easily translate what each line inside the translated.ini means in HTML, it includes the type that the line will be converted to, what string it'll search for inside the translated.ini, what childrens are needed and formating stuff, as a translator you won't need to touch this, only as a debugger.
