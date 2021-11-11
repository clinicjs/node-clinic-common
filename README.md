# Clinic.js Common

Common functionality shared throughout Clinic.js.

<details>
  <summary>Table of contents</summary>

<!-- MarkdownTOC autolink="true" levels="1,2,3,4" -->

- [node-clinic-common](#node-clinic-common)
  - [Utils](#utils)
    - [`getLoggingPaths(toolName, toolSpecificFiles=[])`](#getloggingpathstoolname-toolspecificfiles)
    - [`checkForTranspiledCode(fileName)`](#checkfortranspiledcode-filename)
  - [Scripts](#scripts)
    - [`buildJs(opts = {})`](#buildjsopts)
      - [Usage](#usage)
    - [`buildCss(opts = {})`](#buildcssopts)
      - [Usage](#usage)
  - [Templates](#templates)
    - [`mainTemplate(opts = {})`](#maintemplateopts)
      - [Usage](#usage)
  - [Styles](#styles)
    - [Usage](#usage)
    - [Standards](#standards)
      - [Breakdown](#breakdown)
  - [Icons](#icons)
  - [Images](#images)
  - [Components](#components)
    - [button](#button)
    - [link](#link)
    - [dropdown](#dropdown)
    - [checkbox](#checkbox)
    - [contexOverlay](#contexoverlay)
    - [Walkthrough](#walkthrough)
    - [walkthroughButton](#walkthroughbutton)
    - [helpers](#helpers)
  - [Spinner](#spinner)
  - [License](#license)

<!-- /MarkdownTOC -->

</details>

## Utils

### `getLoggingPaths(toolName, toolSpecificFiles=[])`

Create a function that builds paths for tool log information. The returned function returns an object mapping virtual path names to actual path names, such as:

```js
{
  '/systeminfo': '{pid}.clinic-{toolName}/{pid}.clinic-{toolName}-systeminfo'
}
```

Arguments:
  - `toolName` - name of the Clinic.js tool.
  - `toolSpecificFiles` - array of file names to generate, on top of the defaults (`/`, `/systeminfo`).
    If `toolName` is 'doctor', this defaults to `['/traceevent', '/processstat']`.
    If `toolName` is 'bubbleprof', this defaults to `['/traceevent', '/stacktrace']`.

### `checkForTranspiledCode(fileName)`

A function that will check file contents for transpiled code. Check also includes a search for a source map comment.

Arguments:
  - `fileName` - Path to the file being passed in.

***

## Scripts

### `buildJs(opts = {})`
Returns a Browserify bundle (Readable Stream)

#### Usage
```js
const buildJs = require('@clinic/clinic-common/scripts/build-js')

const scriptFile = buildJs({
  basedir: __dirname, (String)
  debug: this.debug, (Boolean)
  fakeDataPath, (String)
  scriptPath, (String)
  beforeBundle: b => b.doSomethingWithBundle() (Function)
})
```

💡 The `debug` option will ensure the bundle contains a sourcemap

💡 If `fakeDataPath` is not provided, make sure to provide a separate `dataFile` to the [main template](#templates).

### `buildCss(opts = {})`
Returns a PostCSS bundle (Promise)

#### Usage
```js
const buildCss = require('@clinic/clinic-common/scripts/build-css')

const styleFile = buildCss({
  stylePath, (String)
  debug: this.debug (Boolean)
})
```

💡 The `debug` option will ensure the bundle contains a sourcemap

***

## Templates
Templates use [`stream-template`](https://github.com/almost/stream-template) to interpolate streams, promises and strings into a common template without the need to buffer them first.

### `mainTemplate(opts = {})`
Returns a streamTemplate (Readable Stream)

Use this template for building tool output with a common chrome including a header and a popout tray.

This will need to be used in conjunction with the common UI [styles](#styles) and the tray [behaviours](#behaviours).

#### Usage
```js
const mainTemplate = require('@clinic/clinic-common/templates/main')

const outputFile = mainTemplate({
  htmlClass: '', (String)
  favicon: 'URI', (String)
  title: 'Title', (String)
  styles: styleFile, (Readable Stream)
  data: dataFile, (Readable Stream)
  script: scriptFile, (Promise)
  headerLogoUrl: 'https://github.com/somewhere', (String)
  headerLogoTitle: 'Logo title', (String)
  headerLogo: logoFile, (String)
  headerText: 'Text', (String)
  toolVersion: '1.2.3', (String)
  uploadId: 'ID', (String)
  head: 'extra <head> content', (String)
  body: 'extra <body> contents' (String)
})
```

💡 `opts.data` can be provided to place the JSON output of the analysis into its own script tag. When not provided, analysis data should be bundled in the `scriptFile` by the user.

***

## Styles
Importable CSS to include when using the `mainTemplate` to be used in conjunction with the `buildCss` script to ensure it is bundled with tool-specific styling. This adds some global styles for the header and tray.  The CSS is written using BEM to avoid specificity and has the following overrideable CSS variables:

```css
html {
  --nc-colour-text: white;
  --nc-colour-code: #E9F100;
  --nc-colour-notification-dot: #2165E5;
  --nc-colour-tray-backdrop: rgba(0, 0, 0, 0.6);
  --nc-colour-tray: #292d39;
  --nc-colour-header-background: #292d39;
}
```

### Usage
```css
@import '@clinic/clinic-common/styles/styles.css';

.your {
  tool: styles;
}
```

### Standards
CSS should be written using classes using [BEM](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) as a naming convention for better encapsulation and lower specificity.

Inside this repo, all classes are vendor-prfixed with `.nc-` to avoid class name collision with third party or tool specific styles. For tool-based styling, all styles should follow the same conventions with prefixes for the tools as follows:

```
.ncd- Clinic.js Doctor
.ncb- Clinic.js Bubbleprof
.ncf- Clinic.js Flame
```

#### Breakdown
```css
/* Block: Tray component  */
.nc-tray { ...

/* Element: Tray inner component */
.nc-tray__inner { ...
```

***

## Icons
Returns a dictionary object whose keys are the icon names and the values are the svg files content.
Useful to inline svg files.

[Find here the icons list](../master/icons/readme.md)

**Use examples:**
```js
const icons = require('@clinic/clinic-common/icons')

console.log(icons.activity)

output:
`<svg class="icon-img activity-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.7069 3.00248C11.1545 3.03412 11.5262 3.36 11.6161 3.79959L14.2191 16.5255L15.7076 12.796C15.8593 12.4159 16.2272 12.1667 16.6364 12.1667H21C21.5523 12.1667 22 12.6144 22 13.1667C22 13.7189 21.5523 14.1667 21 14.1667H17.314L14.8379 20.3707C14.6741 20.7811 14.2603 21.0353 13.8202 20.996C13.3801 20.9568 13.0179 20.6333 12.9294 20.2004L10.3742 7.70839L8.30541 13.5029C8.1633 13.9009 7.78629 14.1667 7.36364 14.1667H3C2.44772 14.1667 2 13.7189 2 13.1667C2 12.6144 2.44772 12.1667 3 12.1667H6.65884L9.69459 3.66375C9.84545 3.24118 10.2593 2.97084 10.7069 3.00248Z" fill="#7A7F8F"></path>
</svg>`
```


Alternatively you can import the needed icons individually:
```js
const cog = require('@clinic/clinic-common/icons/cog')
...
`<span class="my_icon_wrapper">${cog}</span>`
```


Basic style can be imported into the page by adding the following line to your main css file (if you use [postcss-import](https://github.com/postcss/postcss-import)):
```css
@import "@clinic/clinic-common/icons/style.css";
```

That will add the following rules:
```css
  /* SVG icons */
  svg.icon-img {
    /* Default to same size as adjacent text */
    width: 1em;
    height: 1em;
    display: block;
  }
```

**Using the icons as BG images**
It is possible to use an icon as a background image too.
In your `style.css` import the icons you need, i.e.:
```css
@import "@clinic/clinic-common/icons/cog.css";
```

This will generate the following **css variable** :
```css
html {
    --cog-icon: url(data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fil…2 19.0006 14.7857 18.9737 14.8485L18.0545 14.4545Z" fill="#7A7F8F"></svg>);
}
```
Now you can use it like this:
```css
.settings-button{
  background-image: var(--cog-icon);
  width: 24px;
  height: 24px;
...
}
```

***

## Images
It is possible to embed Base64-Encoded images.

`scripts/build-images.js` exposes two methods:

```js
  path(sourceDir, exportDir)
  // and
  file(filePath, exportDir)
```
The supported file extensions are:
`png` `jpeg` `jpg` and `gif`

Use example:
```js
  // in your npm script
  const buildImg = require('@clinic/clinic-common/scripts/build-images')
  buildImg.file('my/amazing/image.jpg', 'visualizer/assets/images')

  // in your .js file you first import the image
  const myImage = require('visualizer/assets/images/image.js')

  // and then you use it
  `<img src=${myImage} ... />
```

***

## Components
A set of base components and helpers. All the components styles are `@imported` in `style.css` and can be imported as follows:
```css
@import "@clinic/clinic-common/base/style.css";
```

Each component can be imported singularly:
```js
const button = require('@clinic/clinic-common/base/button.js')
```

or you can import multiple components at once:

```js
const { button, checkbox, contextOverlay } = require('@clinic/clinic-common/base')
```

Each component is a function that returns an HTML element

### button
```js
  // button({label, classNames = [], leftIcon = '', rightIcon = '', disabled = false, onClick, title})
  myForm.appendChild(button({
    label: 'Submit',
    title: 'Click me!',
    classNames: ['submitBtn', 'primaryButton'],
    leftIcon: submitIcon,
    onClick: () => validateAndSubmit()
  }))
```

style can be customised by defining these CSS vars in your CSS
```css
  --nc-button-bgColor
  --nc-button-color
  --nc-button-fontSize
  --nc-button-bgHover
  --nc-button-hoverOutline
```

### link
```js
  // link({ label, classNames = [], leftIcon = '', rightIcon = '', href, title = '', target = '' })
  div.appendChild(link({
    label: 'Documentation',
    title: 'Click me!',
    href: '/docs',
    classNames: ['openDocs'],
    rightIcon: externalLink
  }))
```

style can be customised by defining these CSS vars in your CSS
```css
  --nc-link-bgColor
  --nc-link-color
  --nc-link-fontSize
  --nc-link-bgHover
  --nc-link-hoverOutline
```

### dropdown
```js
// dropdown({ label, classNames = [], disabled = false, expandAbove = false, content })
  div.appendChild(dropdown({
    classNames: ['key-v8'],
    label: checkbox({
      leftLabel: 'V8',
      onChange: e => {
        this.setCodeAreaVisibility('all-v8', e.target.checked)
      }
    }),
    content: `<span>This is some content. ${greetings}</span>`,
    expandAbove: true
  }))
```

style can be customised by defining these CSS vars in your CSS
```css
  --nc-checkbox-bgColor
  --nc-checkbox-hoverColor
  --nc-checkbox-hoverOutline
  --nc-checkbox-borderColor
  --nc-checkbox-checkedIconColor
  --nc-checkbox-indeterminateIconColor
```

### checkbox
```js
  // checkbox({ leftLabel, rightLabel, classNames = [], checked = false, disabled = false, indeterminate = false, onChange })
  checkbox({
    classNames: ['key-core'],
    leftLabel: `<span class='after-bp-1'>Node JS</span>
      <span class='before-bp-1'>Node</span>`,
    onChange: e => this.setCodeAreaVisibility('core', e.target.checked)
  })
```

style can be customised by defining these CSS vars in your CSS
```css
  --nc-dropdown-borderColor
  --nc-dropdown-color
  --nc-dropdown-bgColor
  --nc-dropdown-contentBg
  --nc-dropdown-contentBorderColor
```

### contexOverlay
Displays an overlay containig the given `msg` right next to the targetElement or the targetRect

If **targetElement** and **targetRect** are `null||undefined` then the overlay content will be centerd on the page.
```js
  // const options = {
  //   msg,
  //   targetElement,
  //   targetRect,
  //   outerRect,
  //   offset,
  //   pointerCoords,
  //   verticalAlign = 'bottom'
  // }

    overlay.show({
      msg: this.wrapper,
      classNames: ['wt-container'],
      offset: { y: 10, height: 20 },
      targetElement: document.querySelector('.my-cool-element'),
      showArrow: true
    })
```

### Walkthrough
A class to display step-by-step guide to the UI features.

```js
const wt = new Walkthrough({ steps = [], showBackdrop = false, showControls = true, onProgress })
```
`WT` exposes the following methods:
```js
  `start`
  `next`
  `end`
  `skipTo`
```
```steps``` is an array of objects, each step has the following properties:
- `attachTo`: a css selector to identify the element described
- `msg`: an HTMLElement or string template of the message to be displayed


```onProgress(index)``` gets triggered whenever the Walkthrough component state changes.
```js
// steps definition example
const steps = [
  {
    attachTo: '#selection-controls',
    msg: `
    <div>
      <div class="step-1">
        ${flame}
        Hello, and welcome to Flame!
      </div>
    </div>
    `
  },
  {
    attachTo: '.frame-dropdown',
    msg: `
    <div>
      <p>Do you like Flame?</p>
      <img style="width:400px; height: 225px; display:block;" src="https://images.pexels.com/photos/750225/pexels-photo-750225.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
      ${docs}
    </div>`
  }
]
```

### walkthroughButton
The standardised button to tools which activates the Walkthroughs
```js
  // walkthroughButton(steps, onProgress, [label])
  const hdtw = walkthroughButton(wtSteps, index => {
    this.pushHistory()
  })

  // hdtw.WtPlayer -> the embeded walkthrough player
  // hdtw.button -> the button instance to append to the DOM

  // label defaults to 'How does this work'

```


### helpers
A set of useful functions. Currently contains:
- ```toHtml(data)``` Data can be a string, a function or an HTMLElement. The output is an HTMLElement
```js
  const myHtml = helpers.toHtml(`<span>${greetings}</span>`)
  // or
  const myHtml = helpers.toHtml(getGreetings)

```

## Spinner
To add the `loading spinner` to your app please import `@clinic/clinic-common/spinner` in your `main.js` and the style.css file to your `style.css`

Example:
in main.js
```js
require('@clinic/clinic-common/spinner')
```

in style.css
```css
@import "@clinic/clinic-common/spinner/style.css";
```

This will display the loading spinner while the page gets loaded.
If you need to show the spinner later on, maybe while the app is busy doing some calculation, you can programmatically switch the spinner on and off as shown in the following example:

```js
const spinner = require('@clinic/clinic-common/spinner')

...
const redrawSpinner = spinner.attachTo(document.querySelector('#myHtmlContainerNode'))
redrawSpinner.show('Melting the North pole down...')

// when finished
redrawSpinner.hide()

```

The spinner rotating border is white by default, you can customise it by setting the css var `--spinner-border-color` in your css:
```css
html {
/* this will set the colour for the page-loading spinner*/
  --spinner-border-color: --my-fancy-primary-color;
}

#myHtmlContainerNode {
  /* this will set the colour for the in-page spinner*/
  /* this is optional and inherits from `html` if not defined*/
  --spinner-border-color: --my-fancy-secondary-color;
}
```

Attaching the spinner to an element creates a new instance of `spinner` that can be used later on the switch the spinner on/off. When the spinner is displayed, the element to which the spinner is attached gets blurred and overlaid by a dark box.

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/1298616/49368446-ffdb1f80-f6ee-11e8-9c08-b134bcdcc2e6.gif)


## License

[MIT](LICENSE)
