import { useTranslation } from "react-i18next";
import { t } from "i18next";
import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
const ManageKeywordsModal = ({
  show,
  onHide,
  watchedKeywords,
  onRemove,
  actionLoading
}) => {
  const { t: _t } = useTranslation();
  return <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="font-display fw-bold">{t("keyword.quanLyKeywordWatchList")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Array.isArray(watchedKeywords) && watchedKeywords.length > 0 ? <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th className="text-muted-custom font-display fw-medium">Keyword</th>
                  <th className="text-muted-custom font-display fw-medium text-end">{t("journal.hanhDong")}</th>
                </tr>
              </thead>
              <tbody>
                {watchedKeywords.map((kw, idx) => {
              const label = typeof kw === 'string' ? kw : kw.keyword || kw.name;
              const id = typeof kw === 'string' ? kw : kw.id || kw.keywordId;
              return <tr key={idx}>
                      <td className="fw-medium text-main">{label}</td>
                      <td className="text-end">
                        <Button variant="link" className="text-danger p-0 border-0 text-decoration-none" onClick={() => onRemove(id)} disabled={actionLoading}>
                          <i className="bi bi-trash3"></i>{t("keyword.xoa")}</Button>
                      </td>
                    </tr>;
            })}
              </tbody>
            </Table>
          </div> : <div className="text-center py-4 text-muted-custom">{t("keyword.chuaCoKeywordNaoTrongDanhSachT")}</div>}
      </Modal.Body>
      <Modal.Footer className="border-top-0 pt-0">
        <Button variant="light" className="text-muted-custom border" onClick={onHide}>{t("article.dong")}</Button>
      </Modal.Footer>
    </Modal>;
};
export default ManageKeywordsModal;