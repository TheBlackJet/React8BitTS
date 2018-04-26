export interface MediaUploadProps {
    getInitialData?: Function;
    addFileToTheList?: Function;
    fileUpload?: any;
    file?: string;
    addFileToMediaList?: Function;
    searchForMedia?: Function;
}

export interface MediaUploadState {
    id: string;
    title: string;
    searchString: string;
    description?: string;
    file?: any;
    fileType?: string;
    base64?: string;
    searchQuery?: string;
    editMode?: boolean;
    mediaList?: Array<any>;
    fullUrl?: string;
    text?: string;
}