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
import { exportToCSV } from '../shared/util';
import _ from 'lodash';
import moment from "moment";


class MediaListComponent extends React.Component<MediaListProps, {}> {

    private fileUpload: any = null;
    private header: Array<string> = ['Title', 'Description', 'Date Created', 'Preview', 'Option(s)'];

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    exportPDF() {
        // re format csv the correct collumn
        const reFormatCSV: Array<IMediaItem> = this.props.mediaList;
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
        this.props.getInitialData();
    }

    render() {
        return <div>
            <TableComponent list={this.props.mediaList} header={this.header} buttonText="Remove" buttonColor="btn btn-danger" secondButtonText="Edit" secondButtonColor="btn btn-info" />
            {(this.props.mediaList.length != 0) && <div><button type="button" onClick={this.exportPDF.bind(this)} className="btn btn-success">Export to CSV</button></div>}
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