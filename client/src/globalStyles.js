import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
:root {
    --primary-colour: #21b6a8;
    --background-colour: #93e9be;

    --header-offset: 90vh;
    --footer-offset: 90vh;
    --content-width: 75vh;
}

* {
    margin: 0;
    padding: 0;
}

html, body {
    height: calc(100% - (100vh - var(--footer-offset)));
    width: 100%;
}

h1, h2, h3, h4, h5 {
font-weight: normal;
color: var(--primary-colour);
}

h3 {
font-size: 16px;
opacity: 75%;
}

a {
    text-decoration: none;
}

button {
border: none;
}`;

export default GlobalStyle;
