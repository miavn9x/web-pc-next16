"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSunEditorUpload } from "../hooks/useSunEditorUpload";

// Dynamically import SunEditor
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

interface SunEditorComponentProps {
  value: string;
  onChange: (_content: string) => void;
  placeholder: string;
}

// Skeleton UI khi loading
function EditorSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="flex gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="h-96 bg-gray-50 animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading editor...</div>
      </div>
    </div>
  );
}

// Fallback khi editor lỗi
function FallbackEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (_content: string) => void;
  placeholder: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 border-b border-gray-200 p-2">
        <div className="flex gap-2 flex-wrap">
          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
            <strong>B</strong>
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
            <em>I</em>
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
            <u>U</u>
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-96 p-4 border-none outline-none resize-none"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "16px",
          lineHeight: "1.6",
        }}
      />
      <div className="bg-yellow-50 border-t border-yellow-200 p-2 text-sm text-yellow-700">
        ⚠️ Rich text editor not available - using fallback mode
      </div>
    </div>
  );
}

export default function SunEditorComponent({
  value,
  onChange,
  placeholder,
}: SunEditorComponentProps) {
  const editorRef = useRef<any>(null);
  const [editorError, setEditorError] = useState(false);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false); // Trạng thái để theo dõi editor đã tải xong chưa

  // Helper để chuyển đổi HTML cho hiển thị trong editor (đường dẫn tương đối -> tuyệt đối)
  const transformHtmlForEditor = useCallback((html: string): string => {
    if (typeof document === "undefined" || !html) return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const images = doc.querySelectorAll("img");
    const imageUrlPrefix = process.env.NEXT_PUBLIC_IMAGE_URL || "";

    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src && src.startsWith("/uploads/") && imageUrlPrefix) {
        // Chỉ tiền tố nếu là đường dẫn tương đối và chưa được tiền tố
        if (!src.startsWith(imageUrlPrefix)) {
          img.setAttribute("src", `${imageUrlPrefix}${src}`);
        }
      }
    });
    return doc.body.innerHTML;
  }, []);

  // Helper để chuyển đổi HTML cho lưu trữ (đường dẫn tuyệt đối -> tương đối)
  const transformHtmlForStorage = useCallback((html: string): string => {
    if (typeof document === "undefined" || !html) return html;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const images = doc.querySelectorAll("img");
    const imageUrlPrefix = process.env.NEXT_PUBLIC_IMAGE_URL || "";

    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src && imageUrlPrefix && src.startsWith(imageUrlPrefix)) {
        // Xóa tiền tố nếu nó tồn tại
        img.setAttribute("src", src.substring(imageUrlPrefix.length));
      }
    });
    return doc.body.innerHTML;
  }, []);

  // Load CSS SunEditor
  useEffect(() => {
    const loadCSS = () => {
      if (typeof document !== "undefined") {
        const existingLink = document.querySelector("link[href*=\"suneditor\"]");
        if (!existingLink) {
          const cssLink = document.createElement("link");
          cssLink.rel = "stylesheet";
          cssLink.href =
            "https://cdn.jsdelivr.net/npm/suneditor@latest/dist/css/suneditor.min.css";
          document.head.appendChild(cssLink);
        }
      }
    };
    loadCSS();
  }, []);

  const { handleImageUpload } = useSunEditorUpload();

  const handleEditorLoad = () => {
    // console.log("SunEditor loaded");
    setEditorError(false);
    setIsEditorLoaded(true); // Đánh dấu editor đã tải xong
    // Đặt nội dung ban đầu sau khi editor đã tải và ref có sẵn
    if (editorRef.current && value) {
      editorRef.current.setContents(transformHtmlForEditor(value));
    }
  };

  const getSunEditorInstance = (sunEditor: any) => {
    try {
      editorRef.current = sunEditor;
    } catch (error) {
      setEditorError(true);
    }
  };

  // Effect để cập nhật nội dung editor khi prop 'value' thay đổi
  useEffect(() => {
    if (isEditorLoaded && editorRef.current) {
      // Chỉ cập nhật nếu editor đã tải
      const transformedValueForEditor = transformHtmlForEditor(value);
      // Lấy nội dung hiện tại từ editor để tránh cập nhật không cần thiết/vòng lặp vô hạn
      const currentEditorContent = editorRef.current.getContents();

      // Chỉ cập nhật nếu nội dung thực sự khác
      if (currentEditorContent !== transformedValueForEditor) {
        editorRef.current.setContents(transformedValueForEditor);
      }
    }
  }, [value, isEditorLoaded, editorRef, transformHtmlForEditor]);

  // ✅ Cập nhật hàm này để truyền URL tuyệt đối cho SunEditor
  const handleImageUploadBefore = (
    files: File[],
    _info: any,
    uploadHandler: any
  ): boolean => {
    const file = files[0];
    (async () => {
      try {
        const relativeImageUrl = await handleImageUpload(file); // Hàm này trả về đường dẫn tương đối
        if (!relativeImageUrl) {
          uploadHandler(false);
          return;
        }

        const imageUrlPrefix = process.env.NEXT_PUBLIC_IMAGE_URL || "";
        // ✅ Tạo URL tuyệt đối để SunEditor hiển thị và xử lý resizing
        const absoluteImageUrl = imageUrlPrefix + relativeImageUrl;

        uploadHandler({
          result: [
            {
              url: absoluteImageUrl, // Truyền URL tuyệt đối cho SunEditor
              name: file.name,
              size: file.size,
            },
          ],
        });
      } catch (error) {
        uploadHandler(false);
      }
    })();
    return false;
  };

  // Xử lý onChange tùy chỉnh cho SunEditor
  const handleEditorChange = (content: string) => {
    // Chuyển đổi nội dung trở lại đường dẫn tương đối trước khi truyền cho onChange của parent
    const contentForStorage = transformHtmlForStorage(content);
    onChange(contentForStorage);
  };

  const editorOptions = {
    height: "800px",
    buttonList: [
      ["undo", "redo"],
      ["font", "fontSize", "formatBlock"],
      ["paragraphStyle", "blockquote"],
      ["bold", "underline", "italic", "strike", "subscript", "superscript"],
      ["fontColor", "hiliteColor", "textStyle"],
      ["removeFormat"],
      ["outdent", "indent"],
      ["align", "horizontalRule", "list", "lineHeight"],
      ["table", "link", "image", "video"],
      ["fullScreen", "showBlocks", "codeView"],
      ["preview", "print"],
    ],
    font: [
      "Arial",
      "Comic Sans MS",
      "Courier New",
      "Impact",
      "Georgia",
      "Tahoma",
      "Trebuchet MS",
      "Verdana",
    ],
    fontSize: [8, 10, 12, 14, 16, 18, 20, 24, 36, 48],
    placeholder,
    resizingBar: true,
    showPathLabel: false,
    width: "100%",
    minWidth: "100%",
    tabDisable: false,
    // ✅ Đảm bảo imageResizing được bật (mặc định là true nhưng có thể đặt rõ ràng)
    imageResizing: true,
    // ✅ Các tùy chọn khác liên quan đến hình ảnh nếu cần
    // imageWidth: 'auto', // Có thể đặt mặc định nếu muốn
    // imageHeight: 'auto',
  };

  return (
    <>
      {!editorError ? (
        <div className="suneditor-wrapper">
          <SunEditor
            onChange={handleEditorChange} // Sử dụng handler tùy chỉnh
            setOptions={editorOptions}
            getSunEditorInstance={getSunEditorInstance}
            onLoad={handleEditorLoad}
            onImageUploadBefore={handleImageUploadBefore}
            width="100%"
          />
        </div>
      ) : (
        <FallbackEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </>
  );
}
