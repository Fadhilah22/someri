import api from './api'

export async function uploadDocument(
    filename: string,
    file: File,
) {
    console.log('[API] Upload Document');
    const formData = new FormData()

    formData.append('filename', filename)
    formData.append('file', file)

    const { data } = await api.post(
        '/document',
        formData,
    )

    return data
}

export async function getDocuments() {
    const { data } = await api.get('/document')

    return data
}