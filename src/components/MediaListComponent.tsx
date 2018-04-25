import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { deleteMedia, getInitialData } from "../actions/mediaActions";

import {
    MediaListProps,
} from "../entity/mediaList";

import { ACCEPTED_MIME_TYPES, NASA_IMAGES_URL, NASA_API_KEY } from "../app-config-constants";
import { IAppState } from '../typings/app';

import TableComponent from "./TableComponent";


class MediaListComponent extends React.Component<MediaListProps, {}> {

    private fileUpload: any = null;
    private header: Array<string> = ['Title', 'Description', 'Date Created', 'Preview', 'Option(s)'];

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
        this.props.getInitialData();
    }

    render() {
        return <div>
            <TableComponent list={this.props.mediaList} header={this.header} buttonText="Remove" buttonColor="btn btn-danger"/>
        </div>;
    }
}


function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({
        deleteMedia,
        getInitialData
    }, dispatch)
}

const mapStateToProps = (state) => {
    return state.media;
    
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaListComponent)