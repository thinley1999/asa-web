export const processUserName = (formData, name) => {
  const nameParts = name.split(" ");
  let firstName = formData.firstName;
  let middleName = formData.middleName;
  let lastName = formData.lastName;

  if (nameParts.length === 2) {
    [firstName, lastName] = nameParts;
  } else if (nameParts.length === 3) {
    [firstName, middleName, lastName] = nameParts;
  } else if (nameParts.length === 1) {
    firstName = nameParts[0];
    middleName = "";
    lastName = "";
  }
  return { firstName, middleName, lastName };
};
