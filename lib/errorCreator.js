export function errorCreator(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}
