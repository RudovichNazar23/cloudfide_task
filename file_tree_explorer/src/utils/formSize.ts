export function formatSize(size: number): string {
    if (size < 1024) return `${size} B`;

    const kb = size / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;

    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
}