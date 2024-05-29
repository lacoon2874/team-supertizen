import { createGlobalStyle } from "styled-components";
import "@/fonts/font.css";

export const GlobalStyles = createGlobalStyle`
	html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
	box-sizing: border-box;
}
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	/* background-color: aqua;x */
    line-height: 1;
    margin-left: auto;
    margin-right: auto;
    max-width: 450px;
    min-width: 320px;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    /* font-family: "notosans"; */
	font-family: 'SamsungSans', sans-serif;
	-ms-overflow-style: none;

}

::-webkit-scrollbar {
  	display: none;
}


ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
input {
	border: none;
	background-color: transparent;
}
input:focus {
	outline:none;
}


input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
	-webkit-text-fill-color: #000;
    -webkit-box-shadow: 0 0 0px 1000px #fff inset;
    box-shadow: 0 0 0px 1000px #fff inset;
    transition: background-color 5000s ease-in-out 0s;
}


/* @font-face {
    font-family: "notosans";
    src: url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap');
} */

/* @font-face {
    font-family: 'SamsungSans';
    src: url('./../fonts/SamsungSans-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
} */
`;
