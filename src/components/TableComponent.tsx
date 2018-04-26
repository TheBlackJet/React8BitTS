import React from "react";
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import _ from "lodash";

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { FIREBASE_FOLDER, 
    PAGINATION, 
    BUTTON_ADD_FILE_TO_LIST, 
    BUTTON_REMOVE, 
    NO_RECORD,
    MEDIA_FILE_TYPE } from "../app-config-constants";

import { deleteMedia, addNasaMediaFileToList } from "../actions/mediaActions";


import {
    convertISOStringToDate,
    getCurrentDate,
    getFileAsDataURL,
    generateId,
    calculatePageRangeForPagination,
    mediaFileIdentifier
} from "../shared/util";
import { IMediaItem } from '../typings/app';

interface TableProps {
    list?: Array<any>;
    header: Array<string>;
    buttonText: string;
    buttonColor: string;
    callBackType?: string;
    deleteMedia: Function;
}

interface Item {
    id: string;
    title: string;
    description: string;
    dateCreated: string;
}

//interface ITableComponent

class TableComponent extends React.Component<TableProps, {}> {

    constructor(props) {
        super(props);
        this.state = {
            activePage: 1,
            pageItems: [],
            totalItems: [],
        };
    }

    handlePageChange(event) {
        this.setState({
            activePage: event.selected + 1
        })

    }

    tableCall(item: any, type: string) {
        if (this.props.buttonText == BUTTON_REMOVE) {
            this.props.deleteMedia(item.id, item.url);
        }else{
            this.props.addNasaMediaFileToList(item);
        }
    }



    render() {
        if (this.props.list.length == 0) {
            return <div>{NO_RECORD}</div>
        }
        const numOfPage = this.props.list.length / PAGINATION.itemPerpage; // calculate total pages needed for paging
        return (
            <div className="row-xs-12">
                <div className="col-xs-12">
                    <div className="col-xs-12">
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        {this.props.header.map((item: any) => {
                                            return <th>{item}</th>
                                        }, this)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {calculatePageRangeForPagination(this.props.list, this.state.activePage, PAGINATION.itemPerpage).map((item: IMediaItem) => {
                                        return <tr key={item.id}>
                                            <td>{item.title}</td>
                                            <td>{item.description}</td>
                                            <td>{convertISOStringToDate(item.dateCreated)}</td>
                                            <td>{(mediaFileIdentifier(item.type) == MEDIA_FILE_TYPE.VIDEO) && <video width="320" height="240" controls>
                                                <source src={item.fullUrl} type={item.type} />
                                                Your browser does not support the video tag.
                                                    </video>}

                                                {(mediaFileIdentifier(item.type) == MEDIA_FILE_TYPE.IMAGE) &&
                                                    <img width="100" height="100" src={item.fullUrl + "?cache=" + generateId()} />
                                                }
                                                {(mediaFileIdentifier(item.type) == MEDIA_FILE_TYPE.AUDIO) && <audio controls>
                                                    <source src={item.fullUrl + "?cache=" + generateId()} type={item.type} />
                                                    Your browser does not support the audio element.
                                                        </audio>
                                                }
                                            </td>
                                            <td>
                                                <div><button type="button" onClick={this.tableCall.bind(this, item, this.props.buttonText)} className={this.props.buttonColor}>{this.props.buttonText}</button></div>
                                                <br/>
                                                {(this.props.buttonText !== BUTTON_ADD_FILE_TO_LIST) && <div><Link to={"/edit/" + item.id}><button type="button" className={this.props.secondButtonColor}>{this.props.secondButtonText}</button></Link></div>}
                                            </td>
                                        </tr>
                                    }, this)}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
                <div className="col-xs-12">
                    <ReactPaginate previousLabel={"previous"}
                        nextLabel={"next"}
                        breakLabel={<a href="">...</a>}
                        breakClassName={"break-me"}
                        pageCount={numOfPage}
                        marginPagesDisplayed={PAGINATION.marginPagesDisplayed}
                        pageRangeDisplayed={PAGINATION.pageRangeDisplayed}
                        onPageChange={this.handlePageChange.bind(this)}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
                </div>
            </div>
        );
    }

}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({
        deleteMedia,
        addNasaMediaFileToList
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(TableComponent);