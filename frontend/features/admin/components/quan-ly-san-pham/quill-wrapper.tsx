"use client";

import type React from "react";
import { forwardRef } from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";

// ---------------------------------------------------------------------------
// Polyfill for react-quill v2 with Next.js 15+ and React 18+
// This addresses the missing findDOMNode issue
if (typeof window !== "undefined") {
  const ReactDOM = require("react-dom");
  if (!ReactDOM.findDOMNode) {
    ReactDOM.findDOMNode = (component: any) => {
      // Handle different component types
      if (!component) return null;

      // If it's already a DOM node
      if (component.nodeType === 1) return component;

      // If it's a ref with current property
      if (component.current && component.current.nodeType === 1) {
        return component.current;
      }

      // If it's a React component instance, try to find the DOM node
      if (component._reactInternalFiber || component._reactInternals) {
        // This is a simplified approach - in practice, react-quill
        // should handle this internally
        return component.current || null;
      }

      return null;
    };
  }
}
// ---------------------------------------------------------------------------

interface ReactQuillInternalProps {
  theme: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: any;
  formats?: string[];
  className?: string;
  readOnly?: boolean;
  onBlur?: (...args: any[]) => void;
  onFocus?: (...args: any[]) => void;
}

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="p-4 border rounded">Loading editor...</div>,
}) as React.ComponentType<ReactQuillInternalProps & { ref?: React.Ref<any> }>;

// Default modules and formats
const defaultModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "video"],
    ["clean"],
  ],
};

const defaultFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "link",
  "video",
];

// Props for wrapper
interface QuillWrapperProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  modules?: any;
  formats?: string[];
  className?: string;
  readOnly?: boolean;
  name?: string; // For integration with form libs
  onBlur?: () => void;
  onFocus?: () => void;
}

const QuillWrapper = forwardRef<any, QuillWrapperProps>(
  (
    {
      value,
      onChange,
      placeholder,
      modules,
      formats,
      className,
      readOnly = false,
      onBlur,
      onFocus,
    },
    ref
  ) => {
    // Handle the case where ReactQuill might not be loaded yet
    if (!ReactQuill) {
      return <div className="p-4 border rounded">Error loading editor...</div>;
    }

    return (
      <div className={className}>
        <ReactQuill
          ref={ref}
          theme="snow"
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules || defaultModules}
          formats={formats || defaultFormats}
          readOnly={readOnly}
          onBlur={onBlur}
          onFocus={onFocus}
          
        />
      </div>
    );
  }
);

QuillWrapper.displayName = "QuillWrapper";

export default QuillWrapper;
