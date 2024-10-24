export function formatDate(date) {

    const dateObj = new Date(date);

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0-11
    const year = dateObj.getFullYear();

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedDate = `${day}-${month}-${year}`;

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
}

export function formatDateOnly(date) {
    const dateObj = new Date(date);

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
}
