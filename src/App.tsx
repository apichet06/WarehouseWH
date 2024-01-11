import LoginForm from "./components/login/loginform";
import Home from "./components/home/home";
import Division from "./components/division/division";
import Positions from "./components/position/position";
import Users from "./components/users/users";
import Products from "./components/products/product";
import Checkapproval from "./components/checkapproval/checkapproval";
import Incomingstock from "./components/incommingStock/incomingstock";
import OutgoingStock from "./components/outgoingStock/outgoingstock";
import Profile from "./components/profile/profile";
import ProductType from "./components/productType/productType";
import ProductList from "./components/productList/productlist";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AppProvider } from "./components/productList/AppContext";
import Approved from "./components/approved/approved";
import { api } from "./components/utility/api";

function App() {

  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LoginForm api={api} />} />
          <Route path="/home" element={<Home api={api} />} />
          <Route path="/division" element={<Division api={api} />} />
          <Route path="/position" element={<Positions api={api} />} />
          <Route path="/users" element={<Users api={api} />} />
          <Route path="/products" element={<Products api={api} />} />
          <Route path="/Checkapproval" element={<Checkapproval api={api} />} />
          <Route path="/incomingstock" element={<Incomingstock api={api} />} />
          <Route path="/outgoingstock" element={<OutgoingStock api={api} />} />
          <Route path="/profile" element={<Profile api={api} />} />
          <Route path="/productType" element={<ProductType api={api} />} />
          <Route path="/productlist" element={<ProductList api={api} />} />
          <Route path="/approved" element={<Approved api={api} />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
