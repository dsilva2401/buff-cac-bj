import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: none;
    font-family: 'Poppins', sans-serif;
    color: #1B1B1B;
    outline: none;
  }

  html {
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: fixed;
    
    body {
      overflow: hidden;
      height: 100%;
      position: relative;
    }
  }

  img {
    max-width: 100%;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display:none;
  }

  #root {
    height: 100vh;
    overflow: hidden;
  }

  .MuiPaper-rounded {
    border-radius: 20px!important;
  }
  
  .Toastify__toast-icon {
    display: inline !important;
    margin-top: 8px;
  }
`;
