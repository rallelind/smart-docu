export interface TextAnnotaionResponse {
    fullTextAnnotation: {
        text: string
    }
}

export interface NoteData {
    text: string;
    dateOfPost: string;
    page: number;
}

export interface HighlightData {
    highlightStartOffset: number;
    highlightEndOffset: number;
    highlightTextContent: string;
    highlightNodeHtml: string;
    highlightTagName: string;
    color: string;
    top: number;
    left: number;
    start: number;
}



