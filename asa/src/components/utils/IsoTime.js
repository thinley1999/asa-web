export const isoToTime = (date) => {
    const dateObject = new Date(date);
    let hours = dateObject.getHours();
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12'; 
    
    return `${hours}:${minutes} ${ampm}`;
  };