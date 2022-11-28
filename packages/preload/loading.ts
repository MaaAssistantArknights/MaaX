/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */

import { createApp } from 'vue'
import Loading from './Loading.vue'

export function useLoading() {
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')
  oDiv.id = 'loading'
  oDiv.style.opacity = '1'
  oDiv.style.transition = 'opacity 5s'
  oStyle.innerHTML = `
  font-face {
  font-family: "Cera Round Pro";
  src: url("@/assets/fonts/TypeMates Cera Round Pro Bold.otf"),
    url("@/assets/fonts/TypeMates Cera Round Pro Black.otf"),
    url("@/assets/fonts/TypeMates Cera Round Pro Light.otf"),
    url("@/assets/fonts/TypeMates Cera Round Pro Medium.otf"),
    url("@/assets/fonts/TypeMates Cera Round Pro Regular.otf"),
    url("@/assets/fonts/TypeMates Cera Round Pro Thin.otf");
}

@font-face {
  font-family: "Sarasa UI";
  src: url("@/assets/fonts/sarasa-ui-sc-bold.ttf"),
    url("@/assets/fonts/sarasa-ui-sc-bolditalic.ttf"),
    url("@/assets/fonts/sarasa-ui-sc-extralight.ttf"),
    url("@/assets/fonts/sarasa-ui-sc-extralightitalic.ttf"),
    url("@/assets/fonts/sarasa-ui-sc-italic.ttf"),
    url("@/assets/fonts/sarasa-ui-sc-light.ttf"),
    url("@/assets/fonts/sarasa-ui-sc-lightitalic.ttf"),
    url("@/assets/fonts/sarasa-ui-sc-regular.ttf"),
    url("@/assets/fonts/sarasa-ui-sc-semibold.ttf"),
    url("@/assets/fonts/sarasa-ui-sc-semibolditalic.ttf");
}

:root {
  background: none;
  font-family: "Cera Round Pro", "PingFang SC", "Sarasa UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", sans-serif;
}

::-webkit-scrollbar {
  display: none;
}
`

  const loading = createApp(Loading)
  return {
    appendLoading() {
      document.head.appendChild(oStyle)
      document.body.appendChild(oDiv)
      loading.mount('#loading')
    },
    removeLoading() {
      oDiv.style.opacity = '0'
      setTimeout(() => {
        loading.unmount()
        document.body.removeChild(oDiv)
        document.head.removeChild(oStyle)
      }, 5000)
    },
  }
}
