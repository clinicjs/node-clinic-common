'use strict'

const styles = vars => `
  html {
    ${Object.keys(vars).map(key => `--nc-${key}: ${vars[key]};`)};
  }

  .nc-button {
    display: inline-block;
    position: relative;
    z-index: 0;
    width: auto;
    padding: 0.5em;
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

  .nc-button:after {
    content: '';
    position: absolute;
    right: -0.5em;
    top: -0.5em;
    width: 1em;
    height: 1em;
    font-size: 0.6rem;
    background-color: var(--nc-colour-accent-primary);
    border-radius: 100%;
    opacity: 0;
    transform: translateY(10px);
  }

  .nc-button.is-notified:after {
    opacity: 1;
    transform: translateY(0);
    transition-property: opacity transform;
    transition-duration: 0.2s;
    transition-timing-functon: ease-out;
  }

  .nc-button:focus {
    outline: 0;
    box-shadow: 0 0 0 1px var(--nc-colour-accent-primary);
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

  .nc-button__text {
    display: none;
  }

  @media(min-width: 40em) {
    .nc-button {
      padding: 0.5em 1em;
    }

    .nc-button__text {
      display: initial;
    }
  }
`

module.exports = styles
