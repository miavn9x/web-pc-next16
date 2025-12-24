"use client";
import Image from "next/image";
import { useProductsList } from "../../hooks/product/listProductHooks";

interface ProductsListProps {
  onEdit: (_productCode: string, _language?: string) => void;
  onAdd: () => void;
}

const ProductsList = ({ onEdit, onAdd }: ProductsListProps) => {
  const {
    products,
    loading,
    language,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    toggleLanguage,
    formatPrice,
    openViewModal,
    closeViewModal,
    viewModalOpen,
    selectedProduct,
    calculateSellingPrice,
    getCategoryName,
    getAvailableCategories,
    handleCategoryFilter,
    clearCategoryFilter,
    handleDeleteProduct,
    deleting,
    itemsPerPage,
    pagination,
    handlePageChange,
    handleItemsPerPageChange,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
  } = useProductsList();

  const getImageUrl = (
    imageObj: { url?: string; src?: string } | string | null | undefined
  ): string => {
    if (!imageObj) return "/img/logow.jpeg";
    if (typeof imageObj === "string") return imageObj;
    if (imageObj.url) return imageObj.url;
    if (imageObj.src) return imageObj.src;
    return "/img/logow.jpeg";
  };

  const PaginationComponent = () => {
    const { currentPage, totalPages, totalItems, hasNextPage, hasPrevPage } =
      pagination;
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + maxVisiblePages - 1);
        if (start > 1) {
          pages.push(1);
          if (start > 2) pages.push("...");
        }
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        if (end < totalPages) {
          if (end < totalPages - 1) pages.push("...");
          pages.push(totalPages);
        }
      }
      return pages;
    };
    if (totalPages <= 1) return null;
    return (
      <div className="flex flex-col gap-3 mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
          <span className="text-gray-700">
            {language === "vi" ? "Hiển thị:" : "表示件数:"}
          </span>
          <select
            id="select-items-per-page"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-gray-700">
            {language === "vi" ? `/ ${totalItems}` : `/ ${totalItems}件`}
          </span>
        </div>

        <div className="text-xs sm:text-sm text-gray-700 text-center">
          {language === "vi"
            ? `Trang ${currentPage} / ${totalPages}`
            : `${currentPage} / ${totalPages} ページ`}
        </div>

        <div className="flex items-center justify-center gap-1 flex-wrap">
          <button
            id="btn-page-first"
            onClick={goToFirstPage}
            disabled={!hasPrevPage}
            className="p-1.5 sm:p-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title={language === "vi" ? "Trang đầu" : "最初のページ"}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <button
            id="btn-page-prev"
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
            className="p-1.5 sm:p-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title={language === "vi" ? "Trang trước" : "前のページ"}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && handlePageChange(page)}
              disabled={page === "..."}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md ${
                page === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : page === "..."
                  ? "border-transparent cursor-default"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            id="btn-page-next"
            onClick={goToNextPage}
            disabled={!hasNextPage}
            className="p-1.5 sm:p-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title={language === "vi" ? "Trang sau" : "次のページ"}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            id="btn-page-last"
            onClick={goToLastPage}
            disabled={!hasNextPage}
            className="p-1.5 sm:p-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title={language === "vi" ? "Trang cuối" : "最後のページ"}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  if (loading)
    return <div className="p-6 text-center">Đang tải dữ liệu...</div>;

  const availableCategories = getAvailableCategories();

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {language === "vi" ? "Danh sách sản phẩm" : "商品リスト"}
              </h2>
              <button
                id="btn-list-lang-toggle"
                onClick={toggleLanguage}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto"
              >
                {language === "vi" ? "Tiếng Nhật" : "ベトナム語"}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3" id="product-list-filter">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {language === "vi" ? "Lọc theo danh mục:" : "カテゴリーで絞り込み:"}
              </span>
              <div className="relative flex-1 sm:flex-initial">
                <select
                  id="select-filter-category"
                  value={selectedCategory || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      clearCategoryFilter();
                    } else {
                      handleCategoryFilter(Number.parseInt(value));
                    }
                  }}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 pr-8 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:min-w-[150px]"
                >
                  <option value="">
                    {language === "vi" ? "Tất cả danh mục" : "すべてのカテゴリ"}
                  </option>
                  {availableCategories.map((categoryId) => (
                    <option key={categoryId} value={categoryId}>
                      {getCategoryName(categoryId)[language]}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <input
                id="input-search-product"
                type="text"
                placeholder={language === "vi" ? "Tìm kiếm sản phẩm..." : "商品を検索..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 pl-9 sm:pl-10 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <div className="text-xs sm:text-sm text-gray-600">
              {language === "vi"
                ? `Hiển thị ${products.length} / ${pagination.totalItems} sản phẩm`
                : `${products.length} / ${pagination.totalItems}件の商品を表示`}
              {selectedCategory !== null && (
                <span className="ml-2 px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {getCategoryName(selectedCategory)[language]}
                </span>
              )}
            </div>
          </div>
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="w-full divide-y divide-gray-200 min-w-full">
              <div className="hidden md:block">
                {products.length > 0 ? (
                  <table className="w-full" id="table-product-list">
                    <thead className="bg-gray-50">
                      <tr>
                        <th id="header-image" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === "vi" ? "Sản phẩm" : "商品"}
                        </th>
                        <th id="header-category" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === "vi" ? "Danh mục" : "カテゴリ"}
                        </th>
                        <th id="header-price" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === "vi" ? "Giá từ" : "価格から"}
                        </th>
                        <th id="header-actions" className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === "vi" ? "Hành động" : "アクション"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product, index) => (
                        <tr key={product.productCode}>
                          <td id={index === 0 ? "cell-product-0" : undefined} className="px-4 lg:px-6 py-4">
                            <div className="flex items-center">
                              <div className="relative w-10 h-10 shrink-0">
                                <Image
                                  src={getImageUrl(product.cover)}
                                  alt={product.name[language]}
                                  fill
                                  sizes="40px"
                                  className="rounded object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {product.name[language]}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.productCode}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td id={index === 0 ? "cell-category-0" : undefined} className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                            {product.categoryInfo !== undefined
                              ? getCategoryName(product.categoryInfo)[language]
                              : language === "vi" ? "Đang tải..." : "読み込み中..."}
                          </td>
                          <td id={index === 0 ? "cell-price-0" : undefined} className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatPrice(product.priceRange[language].min, language)}
                          </td>
                          <td id={index === 0 ? "cell-actions-0" : undefined} className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              id={`btn-view-product-${index}`}
                              onClick={() => openViewModal(product)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              {language === "vi" ? "Xem" : "表示"}
                            </button>
                            <button
                              id={`btn-edit-product-${index}`}
                              onClick={() => onEdit(product.productCode, language)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              {language === "vi" ? "Sửa" : "編集"}
                            </button>
                            <button
                              id={`btn-delete-product-${index}`}
                              onClick={() => handleDeleteProduct(product.productCode)}
                              disabled={deleting === product.productCode}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              {deleting === product.productCode
                                ? language === "vi" ? "Đang xóa..." : "削除中..."
                                : language === "vi" ? "Xóa" : "削除"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : null}
              </div>
              <div className="md:hidden space-y-3 px-3">
                {products.map((product, index) => (
                  <div key={product.productCode} className="flex flex-col p-3 border rounded-lg bg-white shadow-sm">
                    <div id={`mobile-product-info-${index}`} className="flex items-start gap-3 mb-3">
                      <div className="relative w-16 h-16 shrink-0">
                        <Image
                          src={getImageUrl(product.cover)}
                          alt={product.name[language]}
                          fill
                          sizes="64px"
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {product.name[language]}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          {product.productCode}
                        </div>
                        <div id={`mobile-product-category-${index}`} className="text-xs text-gray-600">
                          {product.categoryInfo !== undefined
                            ? getCategoryName(product.categoryInfo)[language]
                            : language === "vi" ? "Đang tải..." : "読み込み中..."}
                        </div>
                      </div>
                    </div>
                    <div id={`mobile-product-price-${index}`} className="text-sm font-semibold text-blue-600 mb-3">
                      {formatPrice(product.priceRange[language].min, language)}
                    </div>
                    <div id={`mobile-product-actions-${index}`} className="grid grid-cols-3 gap-2">
                      <button
                        id={`mobile-btn-view-product-${index}`}
                        onClick={() => openViewModal(product)}
                        className="text-xs text-blue-600 hover:text-blue-900 px-2 py-2 rounded-md bg-blue-50 text-center font-medium"
                      >
                        {language === "vi" ? "Xem" : "表示"}
                      </button>
                      <button
                        id={`mobile-btn-edit-product-${index}`}
                        onClick={() => onEdit(product.productCode, language)}
                        className="text-xs text-blue-600 hover:text-blue-900 px-2 py-2 rounded-md bg-blue-50 text-center font-medium"
                      >
                        {language === "vi" ? "Sửa" : "編集"}
                      </button>
                      <button
                        id={`mobile-btn-delete-product-${index}`}
                        onClick={() => handleDeleteProduct(product.productCode)}
                        disabled={deleting === product.productCode}
                        className="text-xs text-red-600 hover:text-red-900 px-2 py-2 rounded-md bg-red-50 text-center font-medium disabled:opacity-50"
                      >
                        {deleting === product.productCode
                          ? language === "vi" ? "Xóa..." : "削除中..."
                          : language === "vi" ? "Xóa" : "削除"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {products.length === 0 && (
                <div className="text-center py-12 px-3">
                  <div className="text-gray-500 text-base sm:text-lg mb-2">
                    {language === "vi" ? "Không tìm thấy sản phẩm nào" : "商品が見つかりません"}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">
                    {language === "vi"
                      ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                      : "フィルターや検索キーワードを変更してみてください"}
                  </div>
                </div>
              )}
            </div>
          </div>
          <PaginationComponent />
        </div>
      </div>
      {viewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-lg mx-auto container max-h-screen overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-3 sm:p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-base sm:text-xl font-bold">
                {language === "vi" ? "Chi tiết sản phẩm" : "商品詳細"}
              </h2>
              <button id="detail-btn-close-icon" onClick={closeViewModal} className="text-gray-500 hover:text-gray-700 p-1">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div id="detail-main-image" className="relative w-full h-48 sm:h-64 lg:h-80">
                  <Image
                    src={getImageUrl(selectedProduct.cover)}
                    alt={selectedProduct.name[language]}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain rounded"
                  />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {selectedProduct.name[language]}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Code: {selectedProduct.productCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      <strong>{language === "vi" ? "Danh mục" : "カテゴリ"}:</strong>{" "}
                      {selectedProduct.category !== undefined
                        ? getCategoryName(selectedProduct.category)[language]
                        : language === "vi" ? "Chưa phân loại" : "未分類"}
                    </p>
                  </div>
                  <div id="detail-description">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      <strong>{language === "vi" ? "Mô tả" : "説明"}:</strong>
                    </p>
                    {selectedProduct.description &&
                    selectedProduct.description[language] &&
                    selectedProduct.description[language].includes("<") ? (
                      <div
                        className="text-xs sm:text-sm text-gray-800 prose prose-sm max-w-none overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: selectedProduct.description[language]
                            .replace(
                              /<iframe(?![^>]*(?:youtube\.com|youtu\.be))[^]*>.*?<\/iframe>/gi,
                              "[Video không được hỗ trợ]"
                            )
                            .replace(/<script[^>]*>.*?<\/script>/gi, "")
                            .replace(
                              /<iframe([^>]*(?:youtube\.com|youtu\.be)[^>]*)>/gi,
                              '<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin: 10px 0;"><iframe$1 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" sandbox="allow-scripts allow-same-origin allow-presentation" allowfullscreen></iframe></div>'
                            ),
                        }}
                      />
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-800">
                        {(selectedProduct.description && selectedProduct.description[language]) ||
                          (language === "vi" ? "Không có mô tả" : "説明なし")}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      <strong>{language === "vi" ? "Khoảng giá" : "価格帯"}:</strong>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-800 mt-1 font-semibold">
                      {formatPrice(selectedProduct.priceRange[language].min, language)} -{" "}
                      {formatPrice(selectedProduct.priceRange[language].max, language)}
                    </p>
                  </div>
                </div>
              </div>
              {selectedProduct.gallery && selectedProduct.gallery.length > 0 && (
                <div id="detail-gallery-section" className="mt-4 sm:mt-6">
                  <h4 className="text-sm sm:text-base font-semibold mb-3">
                    {language === "vi" ? "Thư viện ảnh" : "ギャラリー"}
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {selectedProduct.gallery.map((image, index) => (
                      <div key={index} className="relative w-full h-20 sm:h-24">
                        <Image
                          src={getImageUrl(image)}
                          alt={`Gallery ${index + 1}`}
                          fill
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 15vw"
                          className="object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div id="detail-variants-section" className="mt-4 sm:mt-6">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4">
                    {language === "vi" ? "Các phiên bản" : "バリエーション"}
                  </h3>
                  <div className="hidden sm:block overflow-x-auto -mx-3 sm:mx-0">
                    <table className="w-full border border-gray-200 min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th id="detail-th-weight" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                            {language === "vi" ? "Trọng lượng" : "重量"}
                          </th>
                          <th id="detail-th-original" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                            {language === "vi" ? "Giá gốc" : "元値"}
                          </th>
                          <th id="detail-th-discount" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                            {language === "vi" ? "Giảm giá" : "割引"}
                          </th>
                          <th id="detail-th-sale" className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                            {language === "vi" ? "Giá bán" : "販売価格"}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedProduct.variants.map((variant, index) => (
                          <tr key={index}>
                            <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-900">
                              {variant.price[language].discountPercent}%
                            </td>
                            <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-900 font-semibold whitespace-nowrap">
                              {formatPrice(
                                calculateSellingPrice(
                                  variant.price[language].original,
                                  variant.price[language].discountPercent
                                ).toString(),
                                language
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="sm:hidden space-y-3">
                    {selectedProduct.variants.map((variant, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <span id={index === 0 ? "mobile-detail-variant-label-0" : undefined} className="text-sm font-semibold text-gray-900">
                            {variant.label[language]}
                          </span>
                          <span id={index === 0 ? "mobile-detail-discount-0" : undefined} className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            -{variant.price[language].discountPercent}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">
                              {language === "vi" ? "Giá gốc:" : "元値:"}
                            </span>
                            <div id={index === 0 ? "mobile-detail-original-0" : undefined} className="text-gray-700 line-through mt-0.5">
                              {formatPrice(variant.price[language].original.toString(), language)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              {language === "vi" ? "Giá bán:" : "販売価格:"}
                            </span>
                            <div id={index === 0 ? "mobile-detail-sale-0" : undefined} className="text-blue-600 font-bold text-sm mt-0.5">
                              {formatPrice(
                                calculateSellingPrice(
                                  variant.price[language].original,
                                  variant.price[language].discountPercent
                                ).toString(),
                                language
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                          <div className="border-t bg-white p-3 sm:p-4 lg:p-6 ">
              <div className="flex flex-row justify-between sm:justify-end gap-2 sm:gap-3">
                <button
                  id="detail-btn-edit"
                  onClick={() => onEdit(selectedProduct.productCode, language)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base font-medium transition-colors text-center"
                >
                  {language === "vi" ? "Sửa" : "編集"}
                </button>
                <button
                  id="detail-btn-close"
                  onClick={closeViewModal}
                  className="w-full sm:w-auto bg-gray-300 text-gray-800 px-4 py-2.5 sm:py-2 rounded-lg hover:bg-gray-400 text-sm sm:text-base font-medium transition-colors text-center"
                >
                  {language === "vi" ? "Đóng" : "閉じる"}
                </button>
              </div>
            </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;