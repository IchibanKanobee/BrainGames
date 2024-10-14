export const getLoggedInUserString = () => {
  // Logic to retrieve the currently logged-in user
  // This could be from a global state, context, or local storage
  return JSON.parse(localStorage.getItem("user"));
};
