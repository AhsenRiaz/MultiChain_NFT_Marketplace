import { Fragment, ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/react";
import "sf-font";
import Header from "./Header";

interface ILayout {
  children: ReactNode;
}

const Layout = ({ children }: ILayout) => {
  return (
    <Fragment>
      <Header />
      <NextUIProvider>{children}</NextUIProvider>
    </Fragment>
  );
};

export default Layout;
