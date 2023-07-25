const TWITTER_BLUE_RGB = "rgb(29, 155, 240)";
let darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
let isDarkmode = darkModePreference.matches;
let navbarIcon;
let changed = false;

// This function changes the favicon to the specified image URL
function changeFavicon(newFaviconUrl) {
  const oldFavicon = document.querySelector('link[rel="shortcut icon"]');
  const newFavicon = document.createElement("link");
  newFavicon.rel = "icon";
  newFavicon.href = newFaviconUrl;

  if (oldFavicon) {
    document.head.removeChild(oldFavicon);
  }
  document.head.appendChild(newFavicon);
}

function appendSVGToElement(element, svgString) {
  const parser = new DOMParser();
  const svg = parser
    .parseFromString(svgString, "image/svg+xml")
    .querySelector("svg");

  navbarIcon = element.appendChild(svg);
}

function changeIcons() {
  const topLeftIcon = document.querySelector('a[aria-label="Twitter"] svg');

  if (topLeftIcon) {
    // append this svg to topLeftIcon
    appendSVGToElement(
      topLeftIcon.parentNode,
      iconSvg(topLeftIcon.classList.value)
    );

    // Delete topLeftIcon from DOM
    topLeftIcon.parentNode.removeChild(topLeftIcon);

    changed = true;
    clearInterval(itvId);
  }

  const loadingIcon = document.querySelector('div[aria-label="Loading…"] svg');

  if (loadingIcon) {
    appendSVGToElement(
      loadingIcon.parentNode,
      iconSvg(loadingIcon.classList.value)
    );

    // Delete icon from DOM
    loadingIcon.parentNode.removeChild(loadingIcon);
  }
}

const iconSvg = (classname) => {
  const fill = isDarkmode ? "white" : TWITTER_BLUE_RGB;

  return `
<svg class="${classname}" viewBox="0 0 48 40" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:${fill};stroke:none;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="cls-1" d="M38.74,16.55v1c0,10.07-7.64,21.61-21.62,21.61A21.14,21.14,0,0,1,5.5,35.71a12.22,12.22,0,0,0,1.81.11,15.25,15.25,0,0,0,9.44-3.24,7.56,7.56,0,0,1-7.1-5.29,6.9,6.9,0,0,0,1.44.15,7.53,7.53,0,0,0,2-.27A7.57,7.57,0,0,1,7,19.72v-.1a7.42,7.42,0,0,0,3.44.94A7.54,7.54,0,0,1,8.05,10.5a21.58,21.58,0,0,0,15.68,7.94,6.38,6.38,0,0,1-.21-1.74,7.55,7.55,0,0,1,13.17-5.31,15.59,15.59,0,0,0,4.83-1.85,7.65,7.65,0,0,1-3.39,4.27,15.87,15.87,0,0,0,4.37-1.26,15.56,15.56,0,0,1-3.76,4Z"/></svg>
`;
};

const faviconPath = chrome.runtime.getURL("favicon.png");
changeFavicon(faviconPath);

let itvId = setInterval(changeIcons, 10);

darkModePreference.addEventListener("change", (e) => {
  isDarkmode = e.matches;
  changed = false;
  itvId = setInterval(changeIcons, 10);

  if (navbarIcon) {
    navbarIcon.style.fill = isDarkmode ? "white" : "TWITTER_BLUE_RGB";
  }
});

// inject style
const style = document.createElement("style");
style.textContent = `
  a[aria-label="Twitter"] svg g,
  div[aria-label="Loading…"] svg g {
    display: none;
  }
`;
document.head.appendChild(style);
