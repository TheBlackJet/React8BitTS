import React from "react";
import ReactPaginate from 'react-paginate';
import { convertISOStringToDate } from "../shared/utility-functions";
import {
    getCurrentDate,
    getFileAsDataURL,
    generateId
} from "../shared/utility-functions";

interface ITableProps {
    list: Array<string>;
    header: Array<string>;
    buttonText: string;
    buttonColor: string;
    tableCallBack: Function;
    callBackType?: string;
}

interface Item {
    id: string;
    title: string;
    description: string;
    dateCreated: string;
}

//interface ITableComponent

export class TableComponent extends React.Component<ITableProps, {}> {

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

    render() {
        if (!this.props.list) {
            <div> No Record !</div>
        }


        // <ReactPaginate previousLabel={"previous"}
        //                nextLabel={"next"}
        //                breakLabel={<a href="">...</a>}
        //                breakClassName={"break-me"}
        //                pageCount={20}
        //                marginPagesDisplayed={2}
        //                pageRangeDisplayed={5}
        //                onPageChange={this.handlePageChange}
        //                containerClassName={"pagination"}
        //                subContainerClassName={"pages pagination"}
        //                activeClassName={"active"} />

        return (
            <div className="row">
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
                                {this.props.list.map((item: any) => {
                                    return <tr key={item.id}>
                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td>{convertISOStringToDate(item.dateCreated)}</td>
                                        <td><img width="100" height="100" src={item.fullUrl+"?cache="+generateId()}/></td>
                                        <td><button type="button" onClick={this.props.tableCallBack.bind(this, item, this.props.buttonText)}  className={this.props.buttonColor}>{this.props.buttonText}</button></td>
                                    </tr>
                                }, this)}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        );
    }

}