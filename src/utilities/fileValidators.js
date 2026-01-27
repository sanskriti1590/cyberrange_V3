// utilities/fileValidators.js
export const validateWalkthroughFile = (file) => {
    if (!file) return { ok: true };
    if (file.type !== "application/pdf") {
        return { ok: false, message: "Walkthrough file must be a PDF." };
    }
    if (file.size > 50 * 1024 * 1024) {
        return { ok: false, message: "Walkthrough file must not exceed 50 MB." };
    }
    return { ok: true };
};

export const validateThumbnailFile = (file) => {
    if (!file) return { ok: true };
    if (!file.type.startsWith("image/")) {
        return { ok: false, message: "Thumbnail file must be an image." };
    }
    if (file.size > 5 * 1024 * 1024) {
        return { ok: false, message: "Thumbnail file must not exceed 5 MB." };
    }
    return { ok: true };
};
