import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import TableComponent from "./TableComponent";

import { addFileToMediaList, searchForMedia, editFile } from "../actions/mediaActions";

import {
    MediaUploadProps,
    MediaUploadState
} from "../entity/mediaUpload";

import { ACCEPTED_MIME_TYPES, NASA_IMAGES_URL, NASA_API_KEY } from "../app-config-constants";
import { IAppState } from '../typings/app';
import LoaderComponent from './LoaderComponent';



class FormMediaUploadComponent extends React.Component<MediaUploadProps, MediaUploadState> {

    private fileUpload: any = null;

    constructor(props: MediaUploadProps) {
        super(props);
        this.state = {
            id: '',
            title: '',
            searchString: "",
            editMode: false
        }
    }

    componentWillMount() {
        const { match: { params: { id } } } = this.props;
        if (!_.isEmpty(id)) {
            const foundObj: MediaUploadState = _.find(this.props.media.mediaList, { id: id });
            if (foundObj && !this.state.editMode) {
                this.setState({
                    editMode: true,
                    id: foundObj.id,
                    title: foundObj.title,
                    description: foundObj.description,
                    fullUrl: foundObj.fullUrl
                })
            }
        }
    }

    uploadFile(evt: any) {
        evt.preventDefault();
        if (this.state.editMode) {
            this.props.editFile(this.state);
        } else {
            if (this.state.file) {
                if (this.props.addFileToMediaList) {
                    this.props.addFileToMediaList(this.state);
                }

            }
        }

    }

    handleChange(e: any) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    fileOnchange(e: any) {
        const file = this.fileUpload.files[0];
        if (file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.setState({
                    base64: reader.result
                })
            };
        }
        if (ACCEPTED_MIME_TYPES.indexOf(file.type) <= -1) {
            alert("Wrong file type! Please select another file");
            this.fileUpload.value = "";
            return;
        }

        this.setState({
            file: file,
            fileType: file.type
        });
    }



    render() {
        return <div className="row-12-xs local-media-upload">
            {!this.props.global.redirect ? <form onSubmit={this.uploadFile.bind(this)}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title" aria-describedby="text" required placeholder="Enter title" onChange={this.handleChange.bind(this)} value={this.state.title} />
                    <small id="text" className="form-text text-muted">Please enter the title of the media.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" id="description" rows={3} onChange={this.handleChange.bind(this)} value={this.state.description}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="file">Select media ( accepted : video, image, audio file formats  )</label>
                    <input type="file" required={!this.state.editMode} className="form-control-file" id="file" onChange={this.fileOnchange.bind(this)}
                        ref={(ref) => this.fileUpload = ref} />
                </div>
                <div className="preview">

                </div>
                {!this.state.editMode && <button type="submit" className="btn btn-primary">Add new media</button>}
                {this.state.editMode && <button type="submit" className="btn btn-primary">Edit</button>}
            </form> : <div></div>}

            <LoaderComponent />
        </div>
    }
}



function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({
        addFileToMediaList,
        searchForMedia,
        editFile
    }, dispatch)
}

const mapStateToProps = (state) => ({
    media: state.media,
    global: state.global,
})

export default connect(mapStateToProps, mapDispatchToProps)(FormMediaUploadComponent)