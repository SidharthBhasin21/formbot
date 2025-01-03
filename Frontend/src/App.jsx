import React from 'react'
import { Route, Routes, useRoutes } from 'react-router-dom'
import Home from './pages/home/Home'
import Dashboard from './pages/dashboard/Dashboard'
import Login from './pages/Login/Login'
import Signup from './pages/signup/Signup'
import Folder from './pages/folder/Folder'
import EditForm from './pages/editForm/EditForm'
import Submission from './pages/submission/Submission'
import FormShare from './pages/formshare/FormShare'
import Settings from './pages/settings/settings'

const App = () => {
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path="/folder/:folderId" element={<Folder />} />
      <Route path="/form/edit/:formId" element={<EditForm />} />
      <Route path="/dashboard/:id" element={<Dashboard />} />
      <Route path="/submissions" element={<Submission />} />
      <Route path="/share/:wid" element={<FormShare />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App