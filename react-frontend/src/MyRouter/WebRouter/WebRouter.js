import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import ProtectedRoute from '../ProtectedRoute';
import NoMatch from '../NoMatch';
import { socket } from '../../services/restClient';
// Web components
import HomePage from '../../components/web_components/Homepage/Homepage';
import CategoryPage1 from '../../components/web_components/CategoryPage1/CategoryPage1';
import ProductPage1 from '../../components/web_components/ProductPage1/ProductPage1';
import OrderPage1 from '../../components/web_components/OrderPage1/OrderPage1';
import CheckoutPage1 from '../../components/web_components/CheckoutPage1/CheckoutPage1';
import CartPage1 from '../../components/web_components/CartPage1/CartPage1';
import OrderHistory1 from '../../components/web_components/OrderHistory1/OrderHistory1';
import WebLogin from '../../components/web_components/Web-login/Web-login';
import '../../assets/mainTheme/modal.css';

const WebRouter = (props) => {
    const [modal, setModalDisplay] = useState('none');

    useEffect(() => {
        const onConnect = () => {
            console.log('✅ Socket.IO Connected to server');
            setModalDisplay('none');
        };

        const onDisconnect = (reason) => {
            console.log('❌ Socket.IO disconnected:', reason);
            if (reason === 'transport close') {
                setModalDisplay('flex');
                socket.connect();
            }
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [modal]);

    return (
        <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/Homepage" exact element={<HomePage />} />
            <Route path="/category" exact element={<CategoryPage1 />} />
            <Route path="/categories/:categoryType" element={<CategoryPage1 />} />
            <Route path="/product" exact element={<ProductPage1 />} />
            <Route path="/product/:productId" element={<ProductPage1 />} />
            <Route path="/order" exact element={<OrderPage1 />} />
            <Route path="/checkout" exact element={<CheckoutPage1 />} />
            <Route path="/cart" exact element={<CartPage1 />} />
            <Route path="/OrderHistory1" exact element={<OrderHistory1 />} />
            <Route path="/orderhistory1" exact element={<OrderHistory1 />} />
            <Route path="/web-login" exact element={<WebLogin />} />
            

            <Route path="*" element={<NoMatch />} />
        </Routes>
    );  
};

const mapState = (state) => {
    const { isLoggedIn } = state.auth;
    return { isLoggedIn };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
    hasServicePermission: (service) => dispatch.perms.hasServicePermission(service),
    hasServiceFieldsPermission: (service) => dispatch.perms.hasServiceFieldsPermission(service)
});

export default connect(mapState, mapDispatch)(WebRouter);