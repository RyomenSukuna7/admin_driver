export const emptyStudents = () =>
  Array.from({ length: 8 }, () => ({ name: '', location: '' }));

// Lasts while the admin app is open. Saving permanently needs a database.
export const busStore = {
  driverName: '',
  students: emptyStudents(),
};