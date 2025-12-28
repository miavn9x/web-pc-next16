import React, { useState, useEffect, useRef, useMemo } from "react";

interface Category {
  code: string;
  name: string;
  children?: Category[];
}

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten for search only
  const flattenForSearch = (cats: Category[]) => {
    let result: { code: string; name: string }[] = [];
    for (const cat of cats) {
      result.push({ code: cat.code, name: cat.name });
      if (cat.children) {
        result = [...result, ...flattenForSearch(cat.children)];
      }
    }
    return result;
  };

  const allSearchOptions = useMemo(
    () => flattenForSearch(categories),
    [categories]
  );

  const filteredSearchOptions = useMemo(() => {
    if (!searchTerm) return [];
    return allSearchOptions.filter((opt) =>
      opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allSearchOptions, searchTerm]);

  const selectedOption = allSearchOptions.find((opt) => opt.code === value);

  // Toggle expand
  const toggleExpand = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    setExpanded((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  // Recursive render
  const renderTree = (cats: Category[], level = 0) => {
    return cats.map((cat) => {
      const hasChildren = cat.children && cat.children.length > 0;
      const isExpanded = expanded[cat.code];
      const isSelected = value === cat.code;

      return (
        <React.Fragment key={cat.code}>
          <div
            className={`flex items-center px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
              isSelected
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            style={{ paddingLeft: `${level * 16 + 12}px` }}
            onClick={() => {
              onChange(cat.code);
              setIsOpen(false);
              setSearchTerm("");
            }}
          >
            {/* Expand Icon */}
            {hasChildren ? (
              <div
                onClick={(e) => toggleExpand(e, cat.code)}
                className="p-1 mr-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            ) : (
              <div className="w-5 mr-1" /> // Spacer
            )}

            <span className="truncate">{cat.name}</span>
          </div>

          {/* Render Children */}
          {hasChildren && isExpanded && (
            <div>{renderTree(cat.children!, level + 1)}</div>
          )}
        </React.Fragment>
      );
    });
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Danh mục
      </label>

      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer flex items-center justify-between"
      >
        <span
          className={`truncate ${value ? "text-gray-900" : "text-gray-500"}`}
        >
          {selectedOption ? selectedOption.name : "Tất cả danh mục"}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500  transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm danh mục..."
              className="w-full px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 p-1 custom-scrollbar">
            {searchTerm ? (
              // Search Mode: Flat List
              filteredSearchOptions.length > 0 ? (
                filteredSearchOptions.map((opt) => (
                  <div
                    key={opt.code}
                    onClick={() => {
                      onChange(opt.code);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                      value === opt.code
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {opt.name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy kết quả
                </div>
              )
            ) : (
              // Tree Mode: Recursive
              <>
                <div
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                  className={`flex items-center px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                    value === ""
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="w-5 mr-1" />
                  Tất cả danh mục
                </div>
                {renderTree(categories)}
                {categories.length === 0 && (
                  <div className="px-3 py-4 text-center text-sm text-gray-500">
                    Chưa có danh mục nào
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
