import React from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import UploadPage from './components/pages/UploadPage';

import user from './models/user';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    componentWillMount() {
        if (localStorage.getItem('appJWT')) {
            this.setState({
                loading: true
            })
            const token = localStorage.getItem('appJWT');
            user.checkAuth(token).then(() => {
                this.setState({
                    currentUserToken: token,
                    loading: false
                });
            }).catch(err => {
                localStorage.removeItem('appJWT');
                this.setState({
                    loading: false
                })
            })
        }
    }

    updateAppState = (token) => {
        this.setState({
            currentUserToken: token
        })
    }

    render() {
        const { currentUserToken, loading }  = this.state;

        if (loading) {
            return <h2>Loading</h2>
        }
        
        return (
            <div>
                <Route path="/" exact render={ (props) =>  currentUserToken ? <Redirect to="/form" /> : <HomePage updateAppState={this.updateAppState} {...props}/> }/>
                <Route path="/form" exact render={ (props) => currentUserToken ? <UploadPage {...props} /> : <Redirect to="/" /> }/>
            </div>
        );
    }
}

export default withRouter(App);