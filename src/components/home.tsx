import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { FireBase, getFileAsDataURL, exportToCSV } from '../shared/utility-functions';
import { FIREBASE_CONFIG } from "../app-config-constants";
// import actions
import { addFileToTheList, getInitialData, searchForMedia, addNasaMediaFileToList } from "../actions/app";
import { ACCEPTED_MIME_TYPES,NASA_IMAGES_URL, NASA_API_KEY } from "../app-config-constants";
import _ from "lodash";
// import components
import { TableComponent } from "./TableComponent";

interface HomeProps {
    getInitialData: Function;
    addFileToTheList: Function;
    fileUpload: any;
    file: string;
    appState: {
        contentList: Array<string>;
        nasaData: Array<string>;
    }
}

interface IHomeState {
    id: string,
    title: string,
    description: string,
    file: any,
    fileType:string,
    base64: string,
    searchQuery: string;
}

class Home extends React.Component<HomeProps, {}> {

    constructor(props: any) {
        super(props);
        this.state  = {
            id: '',
            title: '',
            description: '',
            file: '',
            fileType: '',
            base64: '',
            searchQuery: ''
        }

        this.tableCallBack = this.tableCallBack.bind(this);
    }


    componentDidMount() {
        this.props.getInitialData();
    }

    handleChange(e: any) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    uploadFile(evt: any) {
        evt.preventDefault();
        if (this.state.file) {
            this.props.addFileToTheList(this.state);
        }

    }

    searchByQuery(e: any){
        e.preventDefault();
        this.props.searchForMedia(this.state.searchQuery);
    }

    tableCallBack(dataObj: any, type: string){
        if (type != "Remove"){
            this.props.addNasaMediaFileToList(dataObj);
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
        return (
            <div className="container">
                <div className="row wrapper">
                    <div className="col media-upload-column">
                        <div className="row local-media-upload">
                            <form onSubmit={this.uploadFile.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" className="form-control" id="title" aria-describedby="text" required placeholder="Enter title" onChange={e => this.handleChange(e)} value={this.state.title} />
                                    <small id="text" className="form-text text-muted">Please enter the title of the media.</small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea className="form-control" id="description" rows="3" onChange={e => this.handleChange(e)} value={this.state.description}></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="file">Select media ( accepted : video, image, audio file formats  )</label>
                                    <input type="file" required className="form-control-file" id="file" onChange={this.fileOnchange.bind(this)}
                                        ref={(ref) => this.fileUpload = ref} />
                                </div>
                                <div className="preview">
                                </div>
                                <button type="submit" className="btn btn-primary">Add new media</button>
                            </form>
                        </div>


                        <div className="row nasa-media-upload">
                            <form onSubmit={this.searchByQuery.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="search">Title</label>
                                    <input type="text" className="form-control" id="search" value="s" aria-describedby="text" required placeholder="Enter serach string" onChange={e => this.handleChange(e)} />
                                    <small id="search" className="form-text text-muted">Please enter name of content that you wanna search.</small>
                                </div>
                                <button type="submit" className="btn btn-primary">Search</button>
                            </form>
                        </div>
                        <div className="col"><TableComponent list={this.props.appState.nasaData} header={['Title','Description','Date Created','Preview','Add To List']} buttonText="Add file to list" buttonColor="btn btn-success" tableCallBack={this.tableCallBack} /></div>
                    </div>
                    <div className="col"><TableComponent list={this.props.appState.contentList} header={['Title','Description','Date Created','Preview','Remove']}  buttonText="Remove" buttonColor="btn btn-danger"  tableCallBack={this.tableCallBack}  /></div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        addFileToTheList, 
        getInitialData,
        searchForMedia,
        addNasaMediaFileToList
    }, dispatch)
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)