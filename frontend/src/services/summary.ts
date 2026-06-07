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

export async function deleteSummary(id: string) {
    return api.delete(`/summary/${id}/delete`);
}

export async function downloadSummaryPdf(
    summaryId: string,
    documentName: string,
): Promise<void> {
    const theme = document.documentElement.getAttribute('data-theme') ?? 'light';

    const response = await api.get(`/summary/${summaryId}/${documentName}/pdf`, {
        params: { theme },
        responseType: 'blob',
    });

    const url = URL.createObjectURL(new Blob([response.data]));

    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentName}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
}