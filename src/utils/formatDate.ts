export const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString()
}