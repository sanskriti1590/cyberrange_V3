import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div
      style={{
        border: "1px solid rgba(148,163,184,0.18)",
        borderRadius: 12,
        overflow: "hidden",
        background: "rgba(15,17,23,0.9)",
      }}
    >
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        modules={{
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        }}
        style={{ color: "#e5e7eb", minHeight: 140 }}
      />
    </div>
  );
}
