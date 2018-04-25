import React from "react";
import ReactPaginate from 'react-paginate';

import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { FIREBASE_FOLDER } from "../app-config-constants";

import { deleteMedia } from "../actions/mediaActions";


import {
    convertISOStringToDate,
    getCurrentDate,
    getFileAsDataURL,
    generateId
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
            activePage: 15
        };
    }

    remove(id: string) {
        alert(id);
    }


    handlePageChange() {
        alert("OK");
    }

    tableCall(item: any, type: string) {
        debugger
        if (this.props.buttonText == "Remove") {
            this.props.deleteMedia(item.id, item.url);
        }
    }

    render() {
        if (!this.props.list) {
            <div> No Record !</div>
        }

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
                                    {this.props.list.map((item: IMediaItem) => {
                                        if (false) {
                                            return <tr key={item.id}>

                                                <td><input value={item.title} /></td>
                                                <td><textarea>{item.description}</textarea></td>
                                                <td>{convertISOStringToDate(item.dateCreated)}</td>
                                                <td><img width="100" height="100" src={item.fullUrl + "?cache=" + generateId()} /> <input type="file" /></td>
                                                <td><button type="button" onClick={this.tableCall.bind(this, item, this.props.buttonText)} className={this.props.buttonColor}>{this.props.buttonText}</button></td>
                                                <td><button type="button" onClick={() => { }} className={this.props.buttonColor}>Edit</button></td>
                                            </tr>
                                        }
                                        else {
                                            return <tr key={item.id}>
                                                <td>{item.title}</td>
                                                <td>{item.description}</td>
                                                <td>{convertISOStringToDate(item.dateCreated)}</td>
                                                <td>{(false) && <video width="320" height="240" controls>
                                                    <source src={item.fullUrl} type={item.type} />
                                                    Your browser does not support the video tag.
                                                    </video>}

                                                    {(false) &&
                                                        <img width="100" height="100" src={item.fullUrl + "?cache=" + generateId()} />
                                                    }

                                                    {(true) && <audio controls>
                                                        <source src={item.fullUrl + "?cache=" + generateId()} type={item.type} />
                                                        Your browser does not support the audio element.
                                                        </audio>

                                                    }


                                                </td>
                                                <td><button type="button" onClick={this.tableCall.bind(this, item, this.props.buttonText)} className={this.props.buttonColor}>{this.props.buttonText}</button></td>
                                                <td><button type="button" onClick={() => { }} className={this.props.buttonColor}>Edit</button></td>
                                            </tr>
                                        }


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
                        pageCount={20}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageChange}
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
    }, dispatch)
}

export default connect(null, mapDispatchToProps)(TableComponent);