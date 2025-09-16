import React, { useEffect, useState, useRef } from "react";

const RichTextEditor = ({ input, setInput }) => {
  const [Quill, setQuill] = useState(null);
  const [quillInstance, setQuillInstance] = useState(null);
  const quillRef = useRef();

  // Dynamically import react-quilljs
  useEffect(() => {
    let isMounted = true;
    import("react-quilljs").then((mod) => {
      if (!isMounted) return;
      setQuill(mod.useQuill);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize Quill editor once Quill is loaded
  useEffect(() => {
    if (Quill && quillRef.current && !quillInstance) {
      const { quill } = Quill({ theme: "snow", ref: quillRef });
      setQuillInstance(quill);

      // Update input state on text change
      quill.on("text-change", () => {
        setInput({ ...input, description: quill.root.innerHTML });
      });

      // Load existing description if any
      if (input.description) {
        quill.root.innerHTML = input.description;
      }
    }
  }, [Quill, quillRef, quillInstance, input, setInput]);

  return (
    <div className="h-[300px]">
      <div ref={quillRef} />
      {!Quill && <div>Loading editor...</div>}
    </div>
  );
};

export default RichTextEditor;
