import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { deleteMedia } from "../actions/mediaActions";

import { 
    MediaListProps,
} from "../entity/mediaList";

import { ACCEPTED_MIME_TYPES, NASA_IMAGES_URL, NASA_API_KEY } from "../app-config-constants";
import { IAppState } from '../typings/app';

import TableComponent from "./TableComponent";


class MediaListComponent extends React.Component<MediaListProps, {}> {

    private fileUpload : any = null;
    private header: Array<string> = ['Title', 'Description', 'Date Created', 'Preview', 'Remove', 'Edit'];

    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    tableCallBack(dataObj: any, type: string) {
        debugger
        if (type != "Remove") {
            //this.props.addNasaMediaFileToList(dataObj);
        } else {
            this.props.deleteMedia(dataObj.id, dataObj.url);
        }
    }

    render(){
        return <div>
            <TableComponent list={this.props.media.mediaList} header={this.header} buttonText="Remove" buttonColor="btn btn-danger" tableCallBack={this.tableCallBack} />
        </div>;
    }
}


function mapDispatchToProps(dispatch : any) {
    return bindActionCreators({
        deleteMedia
    }, dispatch)
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaListComponent)