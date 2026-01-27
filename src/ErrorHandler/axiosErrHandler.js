import { toast } from "react-toastify";

const axiosErrorHandler = (error) => {
    const data = error?.response?.data;

    // 🔹 No response (network/server issue)
    if (!data) {
        if (error.message === "Network Error") {
            toast.error("Network error. Please check your connection.");
        } else {
            toast.error("Server error: No response received.");
        }
        return;
    }

    // 🔹 Direct message from backend (detail, message, exception, error)
    const directMessage =
        data.detail || data.message || data.exception || data.error;
    if (directMessage) {
        toast.error(
            Array.isArray(directMessage) ? directMessage.join(", ") : directMessage
        );
        return;
    }

    // 🔹 Handle errors object (field-level or non_field_errors)
    const errors = data.errors;
    if (data.errors === 'No Active Game Console Found.') {
        toast.error('No Active Game Console Found.');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    }
    if (errors && typeof errors === "object") {
        Object.entries(errors).forEach(([field, messages]) => {
            if (!messages) return;

            const label =
                field === "non_field_errors"
                    ? "Error"
                    : field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

            if (Array.isArray(messages)) {
                messages.forEach((msg) => toast.error(`${label}: ${msg}`));
            } else if (typeof messages === "string") {
                toast.error(`${label}: ${messages}`);
            } else {
                toast.error(`${label}: ${JSON.stringify(messages)}`);
            }
        });
        return;
    }

    // 🔹 Fallback for unknown structure
    toast.error("Something went wrong. Please try again later.");
};

export default axiosErrorHandler;

