export function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit', // เพิ่มเวลา (รูปแบบ 2 หลัก)
        minute: '2-digit', // เพิ่มนาที (รูปแบบ 2 หลัก)
        second: '2-digit', // เพิ่มวินาที (รูปแบบ 2 หลัก)
    };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
}