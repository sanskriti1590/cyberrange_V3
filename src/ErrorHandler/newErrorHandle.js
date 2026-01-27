import { toast } from "react-toastify";

function handleApiError(res) {
  const response = res?.response?.data;
  if (response.error) {
    // If response.error is an array, show each error message
    if (Array.isArray(response.error)) {
      response.error.forEach((errorMsg) => {
        toast.error(errorMsg);
      });
    } else {
      // If it's a single error message, show it directly
      toast.error(response.error);
    }
  } else if (response.exception) {
    // Handle exception messages
    toast.error(response.exception);
  } else {
    // Handle any unknown or unexpected errors
    toast.error("An unexpected error occurred.");
  }
}

export default handleApiError;
