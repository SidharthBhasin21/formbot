import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer, } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './utils/redux/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer/>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
