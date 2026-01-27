const truncateString = (inputString, maxLength) =>
  inputString?.length > maxLength ? `${inputString?.substring(0, maxLength)}...` : inputString;
export default truncateString;