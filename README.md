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


***


## `svgIcons`
Returns a dictionary object whose keys are the icon names and the values are the svg files content.
Useful to inline svg files.

[Find here the icons list](https://github.com/nearform/node-clinic-common/blob/feature/svg-icons/icons/icons.md)

```js
const icons = require('@nearform/clinic-common').svgIcons
...
myCustomElement.htmlContent=icons.activity
```

or

```js
`<span class="my_icon">${icons.activity}</span>`
```


Alternatively you can import the needed icons individually:
```js
const activity = require('@nearform/clinic-common/icons/activity.js')
...
`<span class="my_icon">${activity}</span>`
```


Basic style can be injected into the page by calling:
`icons.injectStyle()`

That will add the following rules:
```css
  /* SVG icons */
  svg.icon-img path {
    /* Default to same fill as adjacent text */
    fill: currentColor;
  }
  
  svg.icon-img {
    /* Default to same size as adjacent text */
    width: 1em;
    height: 1em;
    display: block;
  }
```

## License

[GPL 3.0](LICENSE)
