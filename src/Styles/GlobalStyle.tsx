import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

*{
  font-family: "GmarketSans";
  font-size: 62.5%;

  @media (min-width: 628px) {
    font-size: 70%;
  }

	@media (min-width: 1024px) {
    font-size: 75%;
  }
}

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}

/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
  display: none;
}

img{
  display:block;
}

body {
  line-height: 1;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};

  &::-webkit-scrollbar {
    display: none;
  }
}

button {
  background-color: ${(props) => props.theme.accentColor};
  border : none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: inset 4px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }
}

menu, ol, ul,li {
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

*{
  box-sizing: border-box;
}

a{
  text-decoration: none
}
`;
