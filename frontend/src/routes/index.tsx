import {
  ProfilePage,
  ProtectedRoute,
  PublicRoute,
  VacanciesPage,
} from "@/components";
import {
  CreateRoomPage,
  EditProfilePage,
  HomePage,
  LoginPage,
  MatchesPage,
  PeoplePage,
  PreferencesPage,
  RegisterPage,
  VacancyDescriptionPage,
  PublicUserPage,
} from "@/pages";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/preferences"
        element={
          <ProtectedRoute>
            <PreferencesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:userId/edit"
        element={
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vacancies"
        element={
          <ProtectedRoute>
            <VacanciesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vacancy/:vacancySlug"
        element={
          <ProtectedRoute>
            <VacancyDescriptionPage />
          </ProtectedRoute>
        }
      />
      <Route path="/user/:userSlug" element={<PublicUserPage />} />
      <Route
        path="/people"
        element={
          <ProtectedRoute>
            <PeoplePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-room"
        element={
          <ProtectedRoute>
            <CreateRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/matches"
        element={
          <ProtectedRoute>
            <MatchesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
