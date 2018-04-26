import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import TableComponent from "./TableComponent";
import LoaderComponent from "./LoaderComponent";

import { addFileToMediaList, searchForMedia } from "../actions/mediaActions";

import {
    MediaUploadProps,
    MediaUploadState
} from "../entity/mediaUpload";

import { ACCEPTED_MIME_TYPES, NASA_IMAGES_URL, NASA_API_KEY } from "../app-config-constants";
import { IAppState } from '../typings/app';



class NasaMediaUploadComponent extends React.Component<MediaUploadProps, MediaUploadState> {

    private fileUpload: any = null;

    constructor(props: MediaUploadProps) {
        super(props);
        this.state = {
            id: '',
            title: '',
            searchString: "",
            text: ""
        }
    }

    uploadFile(evt: any) {
        evt.preventDefault();
        if (this.state.file) {
            if (this.props.addFileToMediaList) {
                this.props.addFileToMediaList(this.state);
            }

        }
    }

    handleChange(e: any) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    searchByQuery(evt: any) {
        evt.preventDefault();
        if (this.props.searchForMedia) {
            this.props.searchForMedia(evt.target[0].value);
        }

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
        return <div>
            {!this.props.redirect && <div className="row-12-xs nasa-media-upload">
            <div className="col-12-xs search-box">
                <form onSubmit={this.searchByQuery.bind(this)}>
                    <div className="form-group">
                        <label htmlFor="searchString">Title</label>
                        <input type="text" className="form-control" id="searchString" value={this.state.searchQuery} aria-describedby="text" required placeholder="Enter search string" />
                        <small id="searchString" className="form-text text-muted">Please enter name of content that you want to search.</small>
                    </div>
                    <button type="submit" className="btn btn-primary">Search</button>
                </form>
            </div>
            <div className="col-12-xs"><TableComponent list={this.props.media.nasaResult} header={['Title', 'Description', 'Date Created', 'Preview', 'Add To List']} buttonText="Add file to list" buttonColor="btn btn-success" /></div>
        </div>}
        <LoaderComponent />
        </div>
        
    }
}


function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({
        addFileToMediaList,
        searchForMedia
    }, dispatch)
}

const mapStateToProps =  (state) => ({
    media: state.media,
    redirect: state.global.redirect,
});

export default connect(mapStateToProps, mapDispatchToProps)(NasaMediaUploadComponent);