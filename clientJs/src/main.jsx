import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Laboratory from './Laboratory.jsx'
import '@fontsource/inter'; 
import ReportModal from './components/ReportModal.jsx'

const router = createBrowserRouter(
  [{
    path: '/laboratory',
    element: <Laboratory />
  },
  {
    path: '/',
    element: <App />
  },
  {
    path: '/report',
    element: <ReportModal/>
  }],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true
    }
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
