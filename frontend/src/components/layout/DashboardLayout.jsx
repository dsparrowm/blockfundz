import React from "react";
import { MainLayout } from "./MainLayout";

export const DashboardLayout = ({ children }) => {
    return (
      <MainLayout withNav={false} withFooter={false}>
        {children}
      </MainLayout>
    );
  };