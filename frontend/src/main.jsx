import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "react-hot-toast";
import ClickSpark from '@/components/ui/ClickSpark.jsx';

createRoot(document.getElementById('root')).render(
  <ClickSpark
    sparkColor='#fff'
    sparkSize={14}
    sparkRadius={25}
    sparkCount={9}
    duration={500}
  >
    <BrowserRouter>
      <Provider store={store} >
        <App />
        <Toaster />
      </Provider>
    </BrowserRouter>
  </ClickSpark>
)

