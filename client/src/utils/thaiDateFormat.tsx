export default function thaiDateFormat(isoDate: string) {
    const date = new Date(isoDate);
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
  
    const thaiDate = date.toLocaleDateString('th-TH', options);
    return thaiDate;
  }