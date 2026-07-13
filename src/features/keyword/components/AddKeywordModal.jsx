import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
const AddKeywordModal = ({
  show,
  onHide,
  onAdd,
  actionLoading
}) => {
  const {
    t
  } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    if (!keyword.trim()) return;
    try {
      await onAdd(keyword.trim());
      setKeyword('');
      onHide();
    } catch (err) {
      // Error handled by hook or parent
    }
  };
  return <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="font-display fw-bold">{t("keyword.themKeywordTheoDoi")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="text-muted-custom small">{t("keyword.nhapTuKhoaKeyword")}</Form.Label>
            <Form.Control type="text" placeholder={t("keyword.viDuLargeLanguageModel")} value={keyword} onChange={e => setKeyword(e.target.value)} disabled={actionLoading} required autoFocus />
          </Form.Group>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <PrimaryButton variant="outline" onClick={onHide} disabled={actionLoading}>{t("admin.huy")}</PrimaryButton>
            <PrimaryButton type="submit" disabled={actionLoading || !keyword.trim()}>
              {actionLoading ? t("keyword.dangThem") : t("keyword.themKeyword")}
            </PrimaryButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>;
};
export default AddKeywordModal;