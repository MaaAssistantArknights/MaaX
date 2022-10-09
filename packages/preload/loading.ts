/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */

const icon = '/src/assets/logo/icon.png'
const tips = [
  '你知道吗? MAA 是 MAA Assistant Arknights 的简称',
  '牛牛喝酒!',
  '冷知识: 慕斯有两条尾巴'
]

const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const tipIndex = randomNum(0, tips.length - 1)

export function useLoading() {
  const className = "logo";
  const styleContent = `

  .spinner {

    text-align: center;
  }
  
  .spinner > div {
    width: 18px;
    height: 18px;
    background-color: #FFFFFF;
  
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }
  
  .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  
  .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  
  @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% { -webkit-transform: scale(0) }
    40% { -webkit-transform: scale(1.0) }
  }
  
  @keyframes sk-bouncedelay {
    0%, 80%, 100% { 
      -webkit-transform: scale(0);
      transform: scale(0);
    } 40% { 
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }

  .logo-container {
    display:flex;
    top:0;
    position: fixed;
    width: 100vw;
    height: 50vh;
  }

  .logo {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top:10vh;
    width: 30%;
  }

  .loading-text-container {
    margin-top:25vh;
    width: 100vw;
    height: 20vh;
  }

  .loading-text {
    text-align: center;
    font-size: 35px;
  }

  .app-loading-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #282c34;
    z-index: 9;
  }

  .tip-container{
    width: 100vw;
    height: 20vh;
    position: fixed;
    bottom: 0;
  }

  .tip-text{
    text-align: center;
    margin-top: 10vh;
  }
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");

  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `
  <div class="logo-container">
    <img class="logo" src="${icon}" alt="logo"/>
  </div>
  <div class="loading-text-container">
   <p class="loading-text"> Loading </p> 
   <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
   </div>
   <div class="tip-container">
    <p class="tip-text">${tips[tipIndex]}</p>
   </div>
  </div>

   `;

  return {
    appendLoading() {
      document.head.appendChild(oStyle);
      document.body.appendChild(oDiv);
    },
    removeLoading() {
      document.head.removeChild(oStyle);
      document.body.removeChild(oDiv);
    },
  };

}
