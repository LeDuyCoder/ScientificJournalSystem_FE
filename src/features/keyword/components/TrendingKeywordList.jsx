import { useTranslation } from "react-i18next";
import React from 'react';
import KeywordChip from './KeywordChip';
const TrendingKeywordList = ({
  trendingKeywords,
  loading,
  onKeywordClick
}) => {
  const {
    t
  } = useTranslation();
  return <div className="glass-card p-4 rounded-4 mb-4">
      <div className="d-flex align-items-center mb-3">
        <h4 className="font-display mb-0 text-main fw-bold">🔥 Top 20 Trending Keywords</h4>
      </div>
      <p className="text-muted-custom small mb-4">{t("keyword.tinhTrong30NgayGanNhat")}</p>

      {loading ? <div className="d-flex flex-wrap gap-2">
          {[...Array(10)].map((_, i) => <div key={i} className="skeleton-shimmer" style={{
        width: `${Math.random() * 80 + 80}px`,
        height: '32px',
        borderRadius: '16px'
      }}></div>)}
        </div> : Array.isArray(trendingKeywords) && trendingKeywords.length > 0 ? <div className="d-flex flex-wrap">
          {trendingKeywords.map((item, idx) => <KeywordChip key={idx} keyword={item.keyword || item.name} count={item.count || item.score} isTrending={true} onClick={() => onKeywordClick && onKeywordClick(item.keyword || item.name)} />)}
        </div> : <div className="text-center py-4 text-muted-custom">{t("keyword.chuaCoDuLieuTrending")}</div>}

      <div className="mt-4 p-3 rounded text-muted-custom small" style={{
      backgroundColor: 'var(--bg-chip)',
      border: '1px solid var(--border)'
    }}>{t("keyword.clickVaoKeywordDeTheoDoiCacKey")}</div>
    </div>;
};
export default TrendingKeywordList;