import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import TableComponent from "./TableComponent";

import { addFileToMediaList } from "../actions/mediaActions";

import {
    MediaUploadProps,
    MediaUploadState
} from "../entity/mediaUpload";

import { ACCEPTED_MIME_TYPES, NASA_IMAGES_URL, NASA_API_KEY } from "../app-config-constants";
import { IAppState } from '../typings/app';



class MediaUploadComponent extends React.Component<MediaUploadProps, MediaUploadState> {

    private fileUpload: any = null;

    constructor(props: MediaUploadProps) {
        super(props);
        this.state = {
            id: '',
            title: '',
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

    searchByQuery(e: any) {
        e.preventDefault();
        //this.props.searchForMedia(this.state.searchQuery);
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
        return <Tabs onSelect={(index, label) => console.log(label + ' selected')}>
            <Tab label="Upload Media Using Form"><div className="row local-media-upload">
                <form onSubmit={this.uploadFile.bind(this)}>
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
                        <input type="file" required className="form-control-file" id="file" onChange={this.fileOnchange.bind(this)}
                            ref={(ref) => this.fileUpload = ref} />
                    </div>
                    <div className="preview">
                    </div>
                    <button type="submit" className="btn btn-primary">Add new media</button>
                </form>
            </div></Tab>
            <Tab label="Upload Media Using NASA Library">
                <div className="row-12-xs nasa-media-upload">
                    <div className="col-12-xs">
                        <form onSubmit={this.searchByQuery.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="search">Title</label>
                                <input type="text" className="form-control" id="search" value="s" aria-describedby="text" required placeholder="Enter serach string" onChange={e => this.handleChange(e)} />
                                <small id="search" className="form-text text-muted">Please enter name of content that you want to search.</small>
                            </div>
                            <button type="submit" className="btn btn-primary">Search</button>
                        </form>
                        </div>
                            <div className="col-12-xs"><TableComponent list={this.props.nasaResult} header={['Title', 'Description', 'Date Created', 'Preview', 'Add To List']} buttonText="Add file to list" buttonColor="btn btn-success" /></div>

                        </div>
                </Tab>
        </Tabs>
                }
            }
            
            
function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({
                    addFileToMediaList,
                }, dispatch)
            }
            
const mapStateToProps = (state) => {
    return state.media;
            }
            
export default connect(mapStateToProps, mapDispatchToProps)(MediaUploadComponent)