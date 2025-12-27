"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductDescriptionProps {
    content: string;
}

export default function ProductDescription({ content }: ProductDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex flex-col">
            <div className="relative">
                <div
                    className={`prose prose-blue max-w-none prose-img:rounded-xl prose-headings:text-gray-900 prose-p:text-gray-700 transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-none" : "max-h-[500px]"
                        }`}
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-white to-transparent pointer-events-none" />
                )}
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 group z-10"
                >
                    {isExpanded ? (
                        <>
                            Thu gọn <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        </>
                    ) : (
                        <>
                            Xem thêm <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
