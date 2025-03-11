import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/home';
import Login from './components/login';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import Register from './components/register';
import PrivateRoute from './Router/PrivateRoute';
const queryClient = new QueryClient()
import { AuthProvider } from "./components/AuthContext";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>

            <Routes>
              <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path='/register' element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </>
  )
}

export default App