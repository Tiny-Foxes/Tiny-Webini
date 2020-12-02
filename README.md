# Webini

Translate [Project Moondance](https://projectmoon.dance/) with the same style StepMania uses for its translations.

## Usage

Open ``translated.ini`` and change ``LanguageCode`` to the language code used for your language, then translate everything else, if you want to check how your translation is going, open webini the app and it'll generate all the html files.

## Important notes

While the files to get overwritten, please remove all the html before creating new ones so the chances of something going wrong are reduced.

While you will still need to write _some_ html inside the translated ini, 97% of the work is reduced.

### In case you want to debug

You'll need to create a fs variable with the fs library inside the ``ini-parser`` package, for some reason it's not included by default.

### What is template.json

It's reason is to easily translate what each line inside the translated.ini means in HTML, it includes the type that the line will be converted to, what string it'll search for inside the translated.ini, what childrens are needed and formating stuff, as a translator you won't need to touch this, only as a debugger.