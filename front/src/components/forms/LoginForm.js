import React from "react";
import PropTypes from "prop-types";
import { Col, Form, FormGroup, FormFeedback, Label, Input, Button } from 'reactstrap';
import user from '../../models/user'

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "data": {
                "email": "",
                "password": ""
            },
            "errors": {}
        }
    }

    onChange = e => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
                data: {
                    ...prevState.data,
                    [name]: value
                }
                
        }))
    };

    onSubmit = (e) => {
        e.preventDefault();
        const { data } = this.state;
        const errors = this.validate(data);
        this.setState({ errors });
        if (!Object.keys(errors).length) {
            user.login(data).then(res => {
                localStorage.appJWT = res.data.user.token;
                this.props.updateAppState(res.data.user.token);
            }).catch(error => {
                console.log(error);
            })
        }

        return false;
    };

    validate = (data) => {
        const validationErrors = {};

        if (!validateEmail(data.email)) {
            validationErrors.email = "Provide proper email address."
        }

        if (!data.password) {
            validationErrors.password = "Password can't be blank."
        }

        return validationErrors;
    }

    render() {
        const { errors} = this.state;
        return (
            <Form onSubmit={this.onSubmit} method="POST">
                <FormGroup row>
                    <Label htmlFor="email" sm={1} size="sm">Email:</Label>
                    <Col sm={3}>
                        <Input
                            invalid={ !!errors.email }
                            type="email"
                            name="email"
                            placeholder="Email"
                            bsSize="sm"
                            onChange={this.onChange}
                        />
                        { errors.email && <FormFeedback>{ errors.email }</FormFeedback> }
                    </Col>
                </FormGroup>
                {' '}
                <FormGroup row>
                    <Label htmlFor="password" sm={1} size="sm">Password</Label>
                    <Col sm={3}>
                        <Input
                            invalid={ !!errors.password }
                            type="password"
                            name="password"
                            bsSize="sm"
                            placeholder="Password"
                            onChange={this.onChange}
                        />
                        { errors.password && <FormFeedback>{ errors.password }</FormFeedback> }
                    </Col>
                </FormGroup>
                {' '}
                <Button color="primary">Submit</Button>
            </Form>
        );
    }
}

LoginForm.propTypes = {
    updateAppState: PropTypes.func.isRequired
};

export default LoginForm;
