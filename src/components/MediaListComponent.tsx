import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { deleteMedia, getInitialData } from "../actions/mediaActions";

import {
    MediaListProps,
} from "../entity/mediaList";

import { ACCEPTED_MIME_TYPES, NASA_IMAGES_URL, NASA_API_KEY } from "../app-config-constants";
import { IAppState, IMediaItem } from '../typings/app';

import TableComponent from "./TableComponent";
import LoaderComponent from "./LoaderComponent";
import { exportToCSV } from '../shared/util';
import _ from 'lodash';
import moment from "moment";


class MediaListComponent extends React.Component<MediaListProps, {}> {

    private fileUpload: any = null;
    private header: Array<string> = ['Title', 'Description', 'Date Created', 'Preview', 'Option(s)'];

    constructor(props) {
        super(props);
        this.state = {
            style: {
                
            },
            text: "The request has been processed. Please wait for a few moment. Thank you!"
        }
    }

    exportPDF() {
        // re format csv the correct collumn
        const reFormatCSV: Array<IMediaItem> = this.props.media.mediaList;
        _.map(reFormatCSV, ((item: IMediaItem) => {
            delete item.url;
            delete item.base64;
            delete item.fullUrl;
            delete item.type;
            delete item.thumbnailUrl;
            delete item.id;
            return {
                item: item.title,
                description: item.description,
                dateCreated: moment(item.dateCreated).utc().format('DD-MM-YYYY')
            }

            
        }));
        exportToCSV(reFormatCSV);
    }

    componentWillMount() {
        // init data list
        this.props.getInitialData();
    }

    render() {
        return <div>
            {!this.props.redirect && <div><TableComponent list={this.props.media.mediaList} header={this.header} buttonText="Remove" buttonColor="btn btn-danger" secondButtonText="Edit" secondButtonColor="btn btn-info" />
            {(this.props.media.mediaList.length != 0) && <div><button type="button" onClick={this.exportPDF.bind(this)} className="btn btn-success">Export to CSV</button></div>}</div>}
            <LoaderComponent />
        </div>;
    }
}


function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({
        deleteMedia,
        getInitialData
    }, dispatch)
}

const mapStateToProps =  (state) => ({
    media: state.media,
    redirect: state.global.redirect,
});


export default connect(mapStateToProps, mapDispatchToProps)(MediaListComponent)