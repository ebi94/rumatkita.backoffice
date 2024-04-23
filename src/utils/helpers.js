export const selectColor = (val) => {
  if (val === 'Booked') {
    return 'warning';
  } else if (val === 'Cancelled') {
    return 'danger';
  } else if (val === 'Paid') {
    return 'info';
  } else if (val === 'On Progress') {
    return 'secondary';
  } else if (val === 'Completed') {
    return 'success';
  } else {
    return 'secondary';
  }
};
