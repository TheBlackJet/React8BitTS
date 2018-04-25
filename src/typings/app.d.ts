export interface IAppState {
    global?: IStateGlobal;
    media?: IMediaState;
}

export interface IMediaState {
    mediaList: Array<IMediaItem>;
    nasaResult?: Array<IMediaItem>;
}

export interface INasaState {
    nasaList: INasaList;
}

export interface INasaList {

}

export interface IMediaList {
    id: string;
    title: string;
    description?: string;
    dateCreated: string;
    url?: string
    thumbnailUrl?: string;
    fullUrl?: string;
    base64?: string;
    type: string;
}

export interface IStateGlobal {

}


export interface IMediaItem {
    id: string;
    title: string;
    description?: string;
    dateCreated: string;
    url?: string
    thumbnailUrl?: string;
    fullUrl?: string;
    base64?: string;
    type: string;
}
