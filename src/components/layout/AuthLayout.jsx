import React from "react";
import { MainLayout } from "./MainLayout";

export const AuthLayout = ({ children }) => {
    return (
      <MainLayout withNav={false} withFooter={false}>
        {children}
      </MainLayout>
    );
  };