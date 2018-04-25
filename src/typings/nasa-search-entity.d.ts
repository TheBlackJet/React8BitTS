

export interface Metadata {
    total_hits: number;
}

export interface Link {
    render?: string;
    href?: string;
    prompt: string;
    rel: string;
}

export interface Datum {
    center: string;
    description_508: string;
    date_created: string;
    description: string;
    secondary_creator: string;
    nasa_id: string;
    keywords: string[];
    title: string;
    media_type: string;
    location: string;
    album: string;
}

export interface Item {
    href: string;
    links: Link[];
    data: Datum[];
}

export interface Collection {
    metadata: Metadata;
    version: string;
    href: string;
    links: Link[];
    items: Item[];
}

export interface INasaData {
    collection: Collection;
}



