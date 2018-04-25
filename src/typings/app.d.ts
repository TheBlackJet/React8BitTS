export interface IMediaItem {
    id: string;
    title: string;
    description?: string;
    dateCreated: string;
    url?: string
    thumbnailUrl? : string;
    fullUrl?: string;
    base64?: string;
}