# node-clinic-common

Common functionality shared throughout node-clinic

## `getLoggingPaths(toolName, toolSpecificFiles=[])`

Create a function that builds paths for tool log information. The returned function returns an object mapping virtual path names to actual path names, such as:

```js
{
  '/systeminfo': '{pid}.clinic-{toolName}/{pid}.clinic-{toolName}-systeminfo'
}
```

Arguments:
  - `toolName` - name of the clinic tool.
  - `toolSpecificFiles` - array of file names to generate, on top of the defaults (`/`, `/systeminfo`).
    If `toolName` is 'doctor', this defaults to `['/traceevent', '/processstat']`.
    If `toolName` is 'bubbleprof', this defaults to `['/traceevent', '/stacktrace']`.

## License

***

## Spinner
To add the `loading spinner` to your app please import `@nearform/clinic-common/spinner` in your `main.js` and the style.css file to your `style.css`

Example:
in main.js
```js
require('@nearform/clinic-common/spinner')
```

in style.css
```css
@import "@nearform/clinic-common/spinner/style.css";
```

This will display the loading spinner while the page gets loaded.
If you need to show the spinner later on, maybe while the app is busy doing some calculation, you can programmatically switch the spinner on and off as shown in the following example:

```js
const spinner = require('@nearform/clinic-common/spinner')

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



[GPL 3.0](LICENSE)
