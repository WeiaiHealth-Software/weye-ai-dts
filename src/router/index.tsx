import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { ArchiveAppointmentPage } from '@/pages/archive/appointments'
import { ArchiveDetailPage } from '@/pages/archive/detail'
import { ArchiveListPage } from '@/pages/archive/list'
import { ArchiveTagsPage } from '@/pages/archive/tags'
import Login from '@/pages/auth/Login'
import { Centers } from '@/pages/centers'
import { CenterDetail } from '@/pages/centers/detail'
import { Dashboard } from '@/pages/dashboard'
import { MiniProgram } from '@/pages/miniprogram'
import { Profile } from '@/pages/profile'
import { Roles } from '@/pages/roles'
import { SystemLogs } from '@/pages/system/logs'
import { UiSpec } from '@/pages/ui-spec'
import { Users } from '@/pages/users'
import { UserCreate } from '@/pages/users/create'
import { isAuthed } from '@/lib/auth'

function RequireAuth({ children }: { children: ReactElement }) {
  if (!isAuthed()) {
    return <Navigate to="/login" replace />
  }

  return children
}

function RedirectIfAuthed({ children }: { children: ReactElement }) {
  if (isAuthed()) {
    return <Navigate to="/index" replace />
  }

  return children
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuthed>
            <Login />
          </RedirectIfAuthed>
        }
      />
      <Route
        path="/index"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="centers" element={<Centers />} />
        <Route path="centers/:centerId" element={<CenterDetail />} />
        <Route path="roles" element={<Roles />} />
        <Route path="users" element={<Users />} />
        <Route path="users/create" element={<UserCreate />} />
        <Route path="system/logs" element={<SystemLogs />} />
        <Route path="profile" element={<Profile />} />
        <Route path="ui-spec" element={<UiSpec />} />

        {/* 档案管理模块 */}
        <Route path="archive/list" element={<ArchiveListPage />} />
        <Route path="archive/appointments" element={<ArchiveAppointmentPage />} />
        <Route path="archive/tags" element={<ArchiveTagsPage />} />
        <Route path="archive/:patientId" element={<ArchiveDetailPage />} />
      </Route>
      <Route
        path="/miniprogram"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<MiniProgram />} />
      </Route>
      <Route
        path="/"
        element={<Navigate to={isAuthed() ? '/index' : '/login'} replace />}
      />
    </Routes>
  )
}
