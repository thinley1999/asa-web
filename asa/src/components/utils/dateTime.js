export const convertToDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
  
    const formattedDateTime = date.toLocaleString('en-US', options);
  
    return formattedDateTime;
}
  