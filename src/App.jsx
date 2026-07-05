import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/homePage'
import Login from './pages/loging'



function App() {

  return (
    <div className='bg-primary'>
     <BrowserRouter>
      <Toaster position='top-right'/>
      <Routes path="/*">          
        <Route path="/*" element={<HomePage/>}/>
        <Route path="/login" element={<Login/>}/>             
      </Routes>
     </BrowserRouter>
    </div>
  )
}

export default App
