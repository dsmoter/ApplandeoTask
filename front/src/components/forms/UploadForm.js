import React from "react";
import { Col, Form, FormGroup, FormFeedback, Label, Input, Button } from 'reactstrap';
import file from '../../models/file';

const MAX_FILE_SIZE = 5242880; // 5 MB
const MIME_TYPES = ['image/gif', 'image/png', 'image/jpeg', 'application/pdf'];

class UploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "files": {},
            "error": " ",
            "successFeedback": false
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { files, error } = this.state;
        if (!error.length) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append(`file${i}`, files[i]);
            }
            file.upload(formData).then(() => {
                this.setState({
                    successFeedback: true
                })
            }).catch(err => {
                const { data } = err.response;
                if (data.type == "TOKERR") {
                    this.setState({
                        error: data.status
                    })
                    localStorage.removeItem('appJWT')
                } else {
                    this.setState({
                        error: data.error + data.wrongFiles.toString()
                    })
                }
            })
        }

        return false;
    };

    onChange = (e) => {
        const { files } = e.target;
        const error = this.validateFiles(files);
        this.setState({ error, files });
    };

    validateFiles = (files) => {
        let validationError = "";

        if (files.length < 1 || files.length > 10) {
            validationError = "Provide more than 1 files, but no more than 10";
            return validationError;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > MAX_FILE_SIZE || !MIME_TYPES.includes(file.type)) {
                validationError = "Max file size exceeded or invalid mime type."
                return validationError;
            }
        }

        return validationError;
    };

    render() {
        const { error, successFeedback } = this.state;
        return (
            <Form onSubmit={this.onSubmit} method="POST" encType="multipart/form-data">
                <FormGroup row>
                    <Label htmlFor="files" sm={1}>Select files:</Label>
                    <Col sm={3}>
                        <Input
                            invalid={ !!error }
                            valid={ !!successFeedback }
                            type="file"
                            name="files"
                            bsSize="sm"
                            multiple
                            onChange={this.onChange}
                        />
                        { error && <FormFeedback>{ error }</FormFeedback> }
                        { successFeedback && <FormFeedback valid>Files uploaded.</FormFeedback> }
                    </Col>
                </FormGroup>
                <Button color="primary" disabled={ !!error.length }>Upload</Button>
            </Form>
        );
    }
}

export default UploadForm;
