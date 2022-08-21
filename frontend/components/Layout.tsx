import { Fragment, ReactNode } from "react";
import "sf-font";
import Header from "./Header";
import { createTheme, NextUIProvider } from "@nextui-org/react";

interface ILayout {
  children: ReactNode;
}

const theme = createTheme({
  type: "dark",
  theme: {
    colors: {
      primaryLight: "$blue200",
      primaryLightHover: "$blue300",
      primaryLightActive: "$blue400",
      primaryLightContrast: "$blue600",
      primary: "$purple500",
      primaryBorder: "$blue500",
      primaryBorderHover: "$blue600",
      primarySolidHover: "$blue700",
      primarySolidContrast: "$white",
      primaryShadow: "$white500",
      transparent: "#00000000",
      inputBorder:'2px solid #5e1dad',
      gradient:
        "linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple300 90%)",
      link: "#5e1dad",

      myColor: "#00000030",
    },

    space: {},
    fonts: {
      fontFamily: "SF Pro Display",
    },
  },
});

const Layout = ({ children }: ILayout) => {
  return (
    <Fragment>
      <Header />
      <NextUIProvider theme={theme}>{children}</NextUIProvider>
    </Fragment>
  );
};

export default Layout;
