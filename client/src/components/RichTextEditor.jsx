import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        // Save editor content into input state
        setInput({
          ...input,
          description: quill.root.innerHTML, // 📝 store as HTML string
        });
      });

      // Initialize with existing description if any
      if (input.description) {
        quill.root.innerHTML = input.description;
      }
    }
  }, [quill]);

  return (
    <div className="h-[300px]">
      <div ref={quillRef} />
    </div>
  );
};

export default RichTextEditor;
