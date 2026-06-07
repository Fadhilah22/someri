export interface Summary {
    id: string
    documentId: string
    content: string
    createdAt: string
}

export interface Document {
    id: string
    userId: string
    filename: string
    originalName: string
    status: 'PENDING' | 'PROCESSING' | 'DONE'
    extractedText: string | null
    createdAt: string
    summary: Summary[]
}

export interface SummaryDisplay {
    id: string
    documentId: string
    content: string
    createdAt: string
    documentName: string
}