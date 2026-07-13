import { useTranslation } from "react-i18next";
import React from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';

/**
 * Component JournalFilterBar - Thanh công cụ lọc, tìm kiếm và chuyển đổi giao diện hiển thị.
 * @param {string} search - Từ khóa tìm kiếm hiện tại
 * @param {function} onSearchChange - Hàm callback khi thay đổi từ khóa tìm kiếm
 * @param {string} statusFilter - Trạng thái lọc (Active/Draft/All)
 * @param {function} onStatusChange - Hàm callback khi thay đổi bộ lọc trạng thái
 * @param {string} viewMode - Chế độ hiển thị ('table' hoặc 'card')
 * @param {function} onViewModeChange - Hàm callback khi bấm chuyển đổi chế độ xem
 * @param {function} onOpenAddModal - Hàm mở Modal thêm Tạp chí mới
 */
export default function JournalFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onOpenAddModal
}) {
  const {
    t
  } = useTranslation();
  return <Row className="mb-4 align-items-center g-3">
      {/* Cột 1: Ô tìm kiếm Tạp chí theo Tên hoặc ISSN */}
      <Col xs={12} md={4}>
        <InputGroup>
          <Form.Control type="text" placeholder={t("journal.timKiemTheoTenTapChiHoacIssn")} value={search} onChange={e => onSearchChange(e.target.value)} style={{
          backgroundColor: 'var(--bg-chip)',
          borderColor: 'var(--border)'
        }} />
        </InputGroup>
      </Col>

      {/* Cột 2: Bộ lọc theo trạng thái (Active / Draft) */}
      <Col xs={6} md={3}>
        <Form.Select value={statusFilter} onChange={e => onStatusChange(e.target.value)} style={{
        backgroundColor: 'var(--bg-chip)',
        borderColor: 'var(--border)'
      }}>
          <option value="All">{t("journal.tatCaTrangThai")}</option>
          <option value="Active">{t("journal.dangHoatDongActive")}</option>
          <option value="Draft">{t("journal.banNhapDraft")}</option>
        </Form.Select>
      </Col>

      {/* Cột 3: Nút Chuyển đổi hiển thị Table / Card và Nút thêm mới */}
      <Col xs={6} md={5} className="d-flex justify-content-md-end align-items-center gap-2">
        {/* Toggle View Mode */}
        <div className="btn-group" role="group">
          <Button variant={viewMode === 'table' ? 'dark' : 'light'} onClick={() => onViewModeChange('table')} className="btn-custom-sm">
            <i className="bi bi-table me-1"></i>{t("journal.bang")}</Button>
          <Button variant={viewMode === 'card' ? 'dark' : 'light'} onClick={() => onViewModeChange('card')} className="btn-custom-sm">
            <i className="bi bi-grid-three-up me-1"></i>{t("journal.the")}</Button>
        </div>

        {/* Nút Tạo Tạp chí Mới (Add Journal) */}
        <PrimaryButton className="gap-1" icon="bi:plus-circle" onClick={onOpenAddModal}>{t("journal.themTapChi")}</PrimaryButton>
      </Col>
    </Row>;
}