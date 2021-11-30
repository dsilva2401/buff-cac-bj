import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    *,
    *::after,
    *::before {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      border: none;
      font-family: "Poppins", sans-serif;
      color: #1B1B1B;
      outline: none;
    }
 
    html {
      overflow: hidden;
      width: 100%;
      height: 100%;
      position: fixed;
     
      body {
        overflow: auto;
        height: 100%;
        position: relative;
      }
    }

    #root {
      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
      overflow: hidden;
    }

    .MuiPaper-rounded {
      border-radius: 20px!important;
    }
 `;
