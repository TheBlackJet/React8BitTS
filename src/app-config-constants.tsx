export const NASA_API_KEY = "ZaflJl4jvbUXE3TKIq1g5VVZEZ2dNkkPnAdTSuyD";
export const NASA_IMAGES_URL = "https://images-api.nasa.gov";


export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyALoUxf7O3yJ5vukcfBk9VRrmVQUie2R9U",
    authDomain: "nfqdemoproject.firebaseapp.com",
    databaseURL: "https://nfqdemoproject.firebaseio.com",
    projectId: "nfqdemoproject",
    storageBucket: "nfqdemoproject.appspot.com",
    messagingSenderId: "211529579027"
  };

  // main data file that list all the file info
  export const FIREBASE_DATA_FILE = "media/data.json";
  export const FIREBASE_DATA_TYPE = "application/json";
  export const FIREBASE_FOLDER = "media"; // folder that stores data

  // button constants
  export const BUTTON_ADD_FILE_TO_LIST = "Add file to list";
  export const BUTTON_REMOVE = "Remove";

  // this is incomplete list, more to add later
  export const ACCEPTED_MIME_TYPES = [
    "audio/aac",
    "video/x-msvideo",
    "image/jpeg",
    "video/mpeg",
    "audio/ogg",
    "video/ogg",
    "image/png",
    "audio/wav",
    "audio/webm",
    "video/webm",
    "image/webp",
    "video/3gpp",
    "audio/3gpp",
    "video/3gpp2",
    "audio/3gpp2",
    "audio/midi",
    "application/x-troff-msvideo",
    "video/avs-video",
    "video/quicktime",
    "video/x-sgi-movie",
    "audio/mpeg",
    "audio/mpeg3",
    "video/quicktime",
    "video/mp4",
    "audio/mp3",
    "image/gif",
  ];

  export const PAGINATION = {
    itemPerpage: 3,
    marginPagesDisplayed: 2,
    pageRangeDisplayed: 3
  }

  export const NO_RECORD = "No Record ! Please add more item to the list.";

  export const MEDIA_FILE_TYPE = {
    VIDEO: "video",
    AUDIO: "audio",
    IMAGE: "image",
  }

  export const NASA_DEFAULT_IMAGE_TYPE = "image/jpg";
  export const NASA_DEFAULT_VIDEO_TYPE = "video/mp4";

  export const MEDIA_FILE_BEING_ADDED = "The file now being added. Please wait for a few moment !";
  export const RECORD_BEING_EDITTED = "The record now being editted. Please wait for a few moment !";
  export const RECORD_BEING_DELETED = "The record now being deleted. Please wait for a few moment !";
  export const RECORD_SEARCHING = "Searching for result... Please wait for a few moment !";
  export const RECORD_BEING_ADDED = "The record now being added to the media list. Please wait for a few moment !";