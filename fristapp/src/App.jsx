import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from './components/Home.jsx'
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Navigation from "./components/Navigation.jsx";
import AddProduct from "./components/AddProduct.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navigation/>
      <Routes>
        <Route path="/" element={<Home/>}/>      
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/add-product" element={<AddProduct/>}/>

      </Routes>
    </BrowserRouter>
  )
}