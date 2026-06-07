import api from './api'

export async function generateSummary(
    DocumentId: string,
    style: string,
    length: string,
    language: string,
    startPage: number,
    endPage: number,
) {
    console.log('[API] Generate Summary')

    const { data } = await api.post(
        '/summary',
        {
            DocumentId,
            style,
            length,
            language,
            startPage,
            endPage,
        },
    )

    return data
}

export async function getSummary(documentIds: string[]) {
    const { data } = await api.post('/summary', {
        documentIds,
    });

    return data;
}