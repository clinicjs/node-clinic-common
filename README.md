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


## `Icons`
Returns a dictionary object whose keys are the icon names and the values are the svg files content.
Useful to inline svg files.

[Find here the icons list](https://github.com/nearform/node-clinic-common/blob/master/icons/readme.md)

**Use examples:**
```js
const icons = require('@nearform/clinic-common/icons')

console.log(icons.activity)

output:
`<svg class="icon-img activity-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.7069 3.00248C11.1545 3.03412 11.5262 3.36 11.6161 3.79959L14.2191 16.5255L15.7076 12.796C15.8593 12.4159 16.2272 12.1667 16.6364 12.1667H21C21.5523 12.1667 22 12.6144 22 13.1667C22 13.7189 21.5523 14.1667 21 14.1667H17.314L14.8379 20.3707C14.6741 20.7811 14.2603 21.0353 13.8202 20.996C13.3801 20.9568 13.0179 20.6333 12.9294 20.2004L10.3742 7.70839L8.30541 13.5029C8.1633 13.9009 7.78629 14.1667 7.36364 14.1667H3C2.44772 14.1667 2 13.7189 2 13.1667C2 12.6144 2.44772 12.1667 3 12.1667H6.65884L9.69459 3.66375C9.84545 3.24118 10.2593 2.97084 10.7069 3.00248Z" fill="#7A7F8F"></path>
</svg>`
```


Alternatively you can import the needed icons individually:
```js
const cog = require('@nearform/clinic-common/icons/cog')
...
`<span class="my_icon_wrapper">${cog}</span>`
```


Basic style can be imported into the page by adding the following line to your main css file (if you use [postcss-import](https://github.com/postcss/postcss-import)):
```css
@import "@nearform/clinic-common/icons/style.css";
```

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
