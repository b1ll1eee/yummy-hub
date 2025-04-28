import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/authentication/Login';
import Register from '../pages/authentication/Register';
import Home from '../pages/general/Home';
import NoPage from '../pages/general/NoPage';
import Order from '../pages/store/Order';
import AnonymousRoutes from '../utils/AnonymousRoutes';
import CustomerRoutes from '../utils/CustomerRoutes';
import OwnerRoutes from '../utils/OwnerRoutes';
import AdminRoutes from '../utils/AdminRoutes';
import Address from '../pages/general/Location';
import Success from '../pages/customer/Success';
import Payment from '../pages/customer/Payment';
import History from '../pages/customer/History';
import Cart from '../pages/customer/Cart';
import Favorite from '../pages/customer/Favorite';
import ManagePayment from '../pages/administrator/ManagePayment';
import Product from '../pages/store/Product';
import EditProduct from '../pages/store/EditProduct';
import CreateProduct from '../pages/store/CreateProduct';
import InfoStore from '../pages/general/InfoStore';
import Type from '../pages/general/Type';
import InfoProduct from '../pages/general/InfoProduct'
import Stores from '../pages/general/Stores';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AnonymousRoutes/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/location" element={<Address/>}/>
          <Route path="/stores" element={<Stores/>}/>
          <Route path="/infostore/:id" element={<InfoStore/>}/>
          <Route path="/type/:id/:name" element={<Type/>}/>
          <Route path="/infoproduct/:id" element={<InfoProduct/>}/>
          <Route path="/*" element={<NoPage/>}/>
        </Route>
        <Route element={<CustomerRoutes/>}>
          <Route path="/favorite" element={<Favorite/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/history" element={<History/>}/>
          <Route path="payment" element={<Payment/>}/>
          <Route path="/success" element={<Success/>}/>
        </Route>
        <Route path='/store' element={<OwnerRoutes />}>
          <Route path="product" element={<Product />} />
          <Route path="product/:id" element={<EditProduct />} />
          <Route path="product/create" element={<CreateProduct />} />
          <Route path="order" element={<Order />} />
        </Route>

        <Route element={<AdminRoutes/>}>
          <Route path="/admin" element={<ManagePayment />}/>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
