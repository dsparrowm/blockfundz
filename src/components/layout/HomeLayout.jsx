import React from "react";
import { MainLayout } from "./MainLayout";

export const HomeLayout = ({ children }) => {
    return (
      <MainLayout>
        {children}
      </MainLayout>
    );
  };