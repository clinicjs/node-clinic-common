'use strict'

const styles = vars => `
  html {
    ${Object.keys(vars).map(key => `--nc-${vars[key]}`)};
  }

  .nc-button {
    display: inline-block;
    position: relative;
    z-index: 0;
    width: auto;
    padding: 0.5em 1em;
    font-size: 1rem;
    font-family: inherit;
    font-weight: bold;
    text-decoration: none;
    text-align: center;
    white-space: nowrap;
    border: solid currentColor 1px;
    color: white;
    border-radius: 4px;
    background-color: transparent;
    cursor: pointer;
  }

  .nc-button:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: currentColor;
    opacity: 0;
    transition: opacity 0.2s ease-out;
  }

  .nc-button:hover:before,
  .nc-button:active:before {
    opacity: 0.1;
  }

  .nc-button:active:before {
    background-color: black;
  }

  .nc-button:focus {
    outline: 0;
    border-color: var(--nc-colour-accent-primary);
  }

  .nc-button__icon {
    display: inline-block;
    position: relative;
    width: 1em;
    height: 1em;
    padding-right: 0.5em;
    vertical-align: middle;
  }

  .nc-button__icon svg {
    position: absolute;
    left: -10%;
    top: -10%;
    width: 120%;
    height: 120%;
  }
`

module.exports = styles
