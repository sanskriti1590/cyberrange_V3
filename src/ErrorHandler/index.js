
import { toast } from "react-toastify";

const ErrorHandler = (error) => {

  if (error.response) {

    if (error.response.data.exception) {
      toast.error(error?.response?.data.exception)
      return
    }
  }




  if (error?.response?.data === null || error?.response?.data === undefined) {
    toast.error("Server error: No response data received");
    return;
  }
  if (error?.response?.data?.errors === 'No Active Game Console Found.') {
    toast.error('No Active Game Console Found.');
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }


  // ✅ Case 1: If response exists (i.e. backend sent a structured error)
  if (error.response) {
    if (error.response.data.exception) {
      toast.error(error?.response?.data.exception)
      return
    }
    const obj = error.response.data?.errors;


    // 🔹 If `errors` object is missing or malformed
    if (!obj || typeof obj !== "object") {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    // ✅ Case 2: Handle non-field/global errors
    if (obj.non_field_errors) {
      const nonFieldErrors = obj.non_field_errors;

      // Handle both array and string formats
      if (Array.isArray(nonFieldErrors)) {
        nonFieldErrors.forEach((msg) => toast.error(msg));
      } else if (typeof nonFieldErrors === "string") {
        toast.error(nonFieldErrors);
      }
      return; // stop further execution since handled
    }



    // ✅ Case 3: Handle field-specific errors (e.g. red_team, purple_team)
    for (let i in obj) {
      const fieldErrors = obj[i];

      // 🔸 If fieldErrors is an array (most common case)
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((errorItem, index) => {
          // Case: nested object (e.g. [{ name: ["Cannot be blank"] }])
          if (typeof errorItem === "object" && errorItem !== null) {
            for (let fieldKey in errorItem) {
              const messages = errorItem[fieldKey];

              // If that key contains an array of messages
              if (Array.isArray(messages)) {
                messages.forEach((msg) => {
                  const fieldName =
                    i.charAt(0).toUpperCase() +
                    i.slice(1).replace(/_/g, " ") +
                    ` → ${fieldKey}`;
                  toast.error(`${fieldName}: ${msg}`);
                });
              }
            }

            // Case: direct array of strings (e.g. "name": ["Invalid"])
          } else if (typeof errorItem === "string") {
            const fieldName =
              i.charAt(0).toUpperCase() + i.slice(1).replace(/_/g, " ");
            toast.error(`${fieldName}: ${errorItem}`);
          }
        });

        // 🔸 If fieldErrors is a single string
      } else if (typeof fieldErrors === "string") {
        const fieldName =
          i.charAt(0).toUpperCase() + i.slice(1).replace(/_/g, " ");
        toast.error(`${fieldName}: ${fieldErrors}`);
      }

      // 🔸 Fallback for unexpected formats
      else {
        toast.error(`${i}: ${JSON.stringify(fieldErrors)}`);
      }
    }
  }

  // ✅ Case 4: If `error.errors` exists (fallback from other handlers)
  else if (error.errors) {
    toast.error(error.errors);
  }


  // ✅ Case 5: Network or generic server error
  else if (error.message === "Network Error") {
    toast.error("Network error. Please check your connection.");
  }

  // ✅ Case 6: Catch-all fallback
  else {
    toast.error("Server error. Please try again later.");
  }
};

export default ErrorHandler;
