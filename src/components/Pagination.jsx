import { useState } from "react";
import "./Pagination.css";

export default function Pagination({ page, totalPages, onChange, onError }) {
  const [pageInput, setPageInput] = useState("");

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const windowSize = 10;
    let start = Math.max(0, page - Math.floor(windowSize / 2));
    let end = start + windowSize;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(0, end - windowSize);
    }
    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  const handlePageInputChange = (e) => {
    const onlyNum = e.target.value.replace(/[^0-9]/g, "");
    setPageInput(onlyNum);
  };

  const goToPage = (e) => {
    e.preventDefault();
    if (!pageInput) return;

    const num = Number(pageInput);
    if (num < 1 || num > totalPages) {
      onError?.(`1 ~ ${totalPages} 사이 페이지를 입력하세요.`);
      return;
    }
    onChange(num - 1);
    setPageInput("");
  };

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination-btn"
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        이전
      </button>

      {getPageNumbers().map((n) => (
        <button
          key={n}
          type="button"
          className={`pagination-btn ${n === page ? "active" : ""}`}
          onClick={() => onChange(n)}
        >
          {n + 1}
        </button>
      ))}

      <button
        type="button"
        className="pagination-btn"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        다음
      </button>

      <form className="page-jump" onSubmit={goToPage}>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={pageInput}
          onChange={handlePageInputChange}
          placeholder={`1 ~ ${totalPages}`}
          className="page-jump-input"
          aria-label="페이지 번호"
        />
        <button type="submit" className="pagination-btn">
          이동
        </button>
      </form>
    </div>
  );
}
