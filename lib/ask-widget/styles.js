'use strict'

const styles = vars => `
  html {
    ${Object.keys(vars).map(key => `--nc-${key}: ${vars[key]};`).join('\n')};
  }

  .nc-icon {
    display: inline-block;
    position: relative;
    width: 1em;
    height: 1em;
    vertical-align: middle;
  }

  .nc-icon svg {
    position: absolute;
    left: -10%;
    top: -10%;
    width: 120%;
    height: 120%;
  }

  .nc-code {
    padding: 1em;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: left;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    tab-size: 2;
    hyphens: none;
    border-radius: 4px;
    color: var(--nc-colourCode);
    background-color: rgba(0, 0, 0, 0.1);
    line-height: 1.75;
    overflow: auto;
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
    color: var(--nc-colourText);
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
    border-radius: 4px;
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
    background-color: var(--nc-colourNotificationDot);
    border-radius: 100%;
    opacity: 0;
    transform: translateY(10px);
  }

  .nc-button.is-notified:after {
    opacity: 1;
    transform: translateY(0);
    transition-property: opacity, transform;
    transition-duration: 0.2s;
    transition-timing-function: ease-out;
  }

  .nc-button:focus {
    outline: 0;
    box-shadow: 0 0 0 1px var(--nc-colourNotificationDot);
  }

  .nc-button__icon {
    padding-right: 0.5em;
  }

  .nc-button__text {
    display: none;
  }

  .nc-tray-backdrop,
  .nc-tray {
    display: none;
    position: fixed;
    z-index: 99999;
    top: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    opacity: 0;
    transition-property: opacity, transform;
    transition-duration: 0.2s;
    transition-timing-function: ease-out;
  }

  .nc-tray-backdrop {
    background-color: var(--nc-colourTrayBackdrop);
  }

  .nc-tray {
    background-color: var(--nc-colourTray);
    color: var(--nc-colourText);
    transform: translateX(100%);
  }

  .nc-tray__inner {
    padding: 2rem;
  }

  .nc-tray__close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 2rem;
    height: 2rem;
    padding: 0.5em;
    border: 0;
    border-radius: 100%;
  }

  .nc-tray__close:before {
    border-radius: 100%;
  }

  .nc-tray__close-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .is-tray-visible .nc-tray,
  .is-tray-visible .nc-tray-backdrop {
    display: block;
  }

  .is-tray-active .nc-tray,
  .is-tray-active .nc-tray-backdrop {
    opacity: 1;
    transform: none;
  }

  @media(min-width: 40em) {
    .nc-button {
      padding: 0.5em 1em;
    }


    .nc-button__text {
      display: initial;
    }

    .nc-tray {
      width: 40em;
    }

    .nc-tray__close {
      padding: 0.5em;
    }
  }
`

module.exports = styles
