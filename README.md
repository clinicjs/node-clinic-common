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
To add the `loading spinner` to your app please import `@nearform/clinic-common/spinner` in your `main.js` and add the style.css file to your `style.css`

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
spinner.show('Melting the North pole down...')
// when finished
spinner.hide()

```

Please note that when showing the `spinner` after the page loaded you quite possibly will have some content underneath the spinner itself:

![screenshot 2018-11-28 at 12 00 45](https://user-images.githubusercontent.com/1298616/49147975-64b90300-f306-11e8-89f6-d7a26f6175d5.png)

It would be your responsibility to set the main content style so that it looks clear to the user that the page content is temporarily not available.

Es:
![screenshot 2018-11-28 at 12 01 23](https://user-images.githubusercontent.com/1298616/49148092-b5306080-f306-11e8-84e5-39bb6087d50e.png)



[GPL 3.0](LICENSE)
