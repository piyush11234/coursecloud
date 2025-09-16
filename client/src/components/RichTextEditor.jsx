import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {
  const quillRef = useRef(null);
  const quillInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR-safe

    // Dynamically import Quill only in browser
    import("quill").then((QuillModule) => {
      const Quill = QuillModule.default;

      if (quillRef.current && !quillInstanceRef.current) {
        const quill = new Quill(quillRef.current, {
          theme: "snow",
        });
        quillInstanceRef.current = quill;

        // Initialize existing content
        if (input.description) {
          quill.root.innerHTML = input.description;
        }

        quill.on("text-change", () => {
          setInput((prev) => ({
            ...prev,
            description: quill.root.innerHTML,
          }));
        });
      }
    });
  }, [input.description, setInput]);

  return (
    <div className="h-[300px]">
      <div ref={quillRef} />
    </div>
  );
};

export default RichTextEditor;
