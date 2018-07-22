import React from 'react';
import propTypes from "prop-types";
import LoginForm from '../forms/LoginForm';

const HomePage = function HomePage(props) {
    return (
        <div>
            <h1>LoginPage</h1>
            <LoginForm updateAppState={props.updateAppState}/>
        </div>
    );
};

HomePage.propTypes = {
    updateAppState: propTypes.func.isRequired
};

export default HomePage;