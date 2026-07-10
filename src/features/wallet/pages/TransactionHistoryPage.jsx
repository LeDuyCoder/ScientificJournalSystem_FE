import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { getWalletTransactions } from '../api/walletApi';
import './TransactionHistoryPage.css';
export default function TransactionHistoryPage() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState(''); // empty for all
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    const params = {
      page,
      limit
    };
    if (filterType) params.type = filterType;
    getWalletTransactions(params).then(res => {      if (!mounted) return;
      const items = Array.isArray(res?.data) ? res.data : res?.data?.transactions;
      const pagination = res?.pagination || res?.data?.pagination;
      if (res?.success && Array.isArray(items)) {
        setTransactions(items);
        if (pagination) {
          setTotalPages(pagination.totalPages || pagination.total_pages || 1);
        }
      } else {
        setError(t("wallet.khongTheTaiLichSuGiaoDich"));
      }
    }).catch(() => {      if (mounted) setError(t("wallet.loiKetNoiLichSuGiaoDich"));
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [page, filterType]);
  const formatCoin = n => {
    const value = Number(n || 0);
    return Number.isInteger(value) ? value.toLocaleString('en-US') : value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const formatDate = dateStr => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return `${date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })} ${date.toLocaleDateString('vi-VN')}`;
  };
  const getStatusBadgeClass = status => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'failed';
      case 'pending':
        return 'pending';
      default:
        return '';
    }
  };
  const getStatusLabel = status => {    switch (status) {
      case 'success':
        return t("wallet.thanhCong");
      case 'failed':
        return t("wallet.thatBai");
      case 'pending':
        return t("wallet.dangXuLy");
      default:
        return status || '—';
    }
  };
  const getTxTypeLabel = type => {    switch (type) {
      case 'deposit':
        return t("wallet.napCoin1");
      case 'spend':
        return t("wallet.tieuCoin");
      case 'refund':
        return t("wallet.hoanCoin");
      case 'admin_adjust':
        return t("wallet.heThongDieuChinh");
      default:
        return type || t("wallet.giaoDich");
    }
  };
  const getTxTypeIconClass = type => {
    switch (type) {
      case 'deposit':
        return 'deposit';
      case 'spend':
        return 'spend';
      case 'refund':
        return 'refund';
      default:
        return 'adjust';
    }
  };
  const getTxStatus = tx => tx?.status || tx?.transaction_status || tx?.payment_status || 'success';
  return <div className="tx-history-page">
      <div className="tx-history-breadcrumb">
        <span>Dashboard</span>
        <Icon icon="lucide:chevron-right" width={12} />
        <span>My Wallet</span>
        <Icon icon="lucide:chevron-right" width={12} />
        <span>Transaction History</span>
      </div>

      <div className="tx-history-hero">
        <h1 className="tx-history-title">{t("wallet.lichSuBienDongCoin")}</h1>
        <p className="tx-history-subtitle">{t("wallet.xemLaiDanhSachNapTieuVaHoanCoi")}</p>
      </div>

      {/* Filter Tabs */}
      <div className="tx-history-filters">
        <button type="button" className={`tx-filter-tab ${filterType === '' ? 'active' : ''}`} onClick={() => {
        setFilterType('');
        setPage(1);
      }}>{t("dashboard.tatCa")}</button>
        <button type="button" className={`tx-filter-tab ${filterType === 'deposit' ? 'active' : ''}`} onClick={() => {
        setFilterType('deposit');
        setPage(1);
      }}>{t("wallet.napCoin1")}</button>
        <button type="button" className={`tx-filter-tab ${filterType === 'spend' ? 'active' : ''}`} onClick={() => {
        setFilterType('spend');
        setPage(1);
      }}>{t("wallet.tieuCoin")}</button>
        <button type="button" className={`tx-filter-tab ${filterType === 'refund' ? 'active' : ''}`} onClick={() => {
        setFilterType('refund');
        setPage(1);
      }}>{t("wallet.hoanCoin")}</button>
      </div>

      {/* Main Table Card */}
      <div className="tx-history-card">
        {loading ? <div className="tx-history-table-loading">{t("wallet.dangTaiLichSuGiaoDich")}</div> : error ? <div className="tx-history-table-empty">{error}</div> : transactions.length === 0 ? <div className="tx-history-table-empty">{t("wallet.khongTimThayGiaoDichNao")}</div> : <>
            <div className="tx-history-table-wrap">
              <table className="tx-history-table">
                <thead>
                  <tr>
                    <th>{t("wallet.giaoDichMoTa")}</th>
                    <th>{t("wallet.idGiaoDich")}</th>
                    <th>{t("wallet.thoiGian")}</th>
                    <th>{t("wallet.bienDong")}</th>
                    <th>{t("wallet.soDuTruoc")}</th>
                    <th>{t("wallet.soDuSau")}</th>
                    <th>{t("wallet.trangThai")}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => {                const amountVal = tx.amount || 0;
                const isMinus = amountVal < 0;
                const status = getTxStatus(tx);
                return <tr key={tx.wallet_transaction_id}>
                        <td>
                          <div className="tx-history-table-desc">
                            <span className={`tx-history-table-type-icon ${getTxTypeIconClass(tx.type)}`}>
                              <Icon icon={isMinus ? 'lucide:arrow-up-right' : 'lucide:arrow-down-left'} width={13} />
                            </span>
                            <div>
                              <div className="tx-history-table-type-label">{getTxTypeLabel(tx.type)}</div>
                              <div className="tx-history-table-detail">{tx.description || t("wallet.giaoDichViCoin")}</div>
                            </div>
                          </div>
                        </td>
                        <td className="tx-history-id-col">{tx.wallet_transaction_id}</td>
                        <td>{formatDate(tx.created_at)}</td>
                        <td className={`tx-history-table-amount ${isMinus ? 'spend' : 'deposit'}`}>
                          {isMinus ? '-' : '+'}
                          {formatCoin(Math.abs(amountVal))}
                        </td>
                        <td>{formatCoin(tx.balance_before)}</td>
                        <td style={{
                    fontWeight: 800
                  }}>{formatCoin(tx.balance_after)}</td>
                        <td>
                          <span className={`tx-history-table-badge ${getStatusBadgeClass(status)}`}>
                            {getStatusLabel(status)}
                          </span>
                        </td>
                      </tr>;
              })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && <div className="tx-history-pagination">
                <button type="button" disabled={page <= 1} onClick={() => setPage(prev => Math.max(1, prev - 1))} className="tx-pagination-btn">
                  <Icon icon="lucide:chevron-left" width={16} />{t("article.truoc")}</button>
                <span className="tx-pagination-text">Trang {page} / {totalPages}</span>
                <button type="button" disabled={page >= totalPages} onClick={() => setPage(prev => Math.min(totalPages, prev + 1))} className="tx-pagination-btn">
                  Sau
                  <Icon icon="lucide:chevron-right" width={16} />
                </button>
              </div>}
          </>}
      </div>
    </div>;
}