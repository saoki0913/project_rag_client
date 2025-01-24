// routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProjectPage from "../pages/ProjectPage";
import NotFoundPage from "../pages/NotFoundPage";
import SettingPage from  "../pages/SettingPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/setting" element={<SettingPage />} />
      <Route path="*" element={<NotFoundPage />} /> {/* 404ページ */}
    </Routes>
  );
};

export default AppRoutes;
