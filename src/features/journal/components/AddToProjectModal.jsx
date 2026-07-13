import { useTranslation } from "react-i18next";
import { t } from "i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\journal\components\AddToProjectModal.jsx
 */
import { useState, useEffect } from 'react';
import { Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
import { getProjectsApi, createProjectApi, getProjectByIdApi, updateProjectApi } from '../../project/api/project.api';
export default function AddToProjectModal({
  show,
  onHide,
  journalId,
  onConfirm
}) {
  const { t: _t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Selection mode: 'select' (choose existing) or 'create' (create new)
  const [mode, setMode] = useState('select');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjectsApi();
      if (res.data?.success && res.data?.data) {
        setProjects(res.data.data);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(t("journal.khongTheTaiDanhSachDuAnVuiLong"));
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects on show and reset form state
  useEffect(() => {
    if (!show) return;
    setError(null);
    setSuccess(false);
    setMode('select');
    setSelectedProjectId('');
    setNewProjectTitle('');
    fetchProjects();
  }, [show]);
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'create') {
        if (!newProjectTitle.trim()) {
          setError(t("journal.vuiLongNhapTenDuAnMoi"));
          setSubmitting(false);
          return;
        }

        // Create new project with current journal ID
        const res = await createProjectApi({
          title: newProjectTitle.trim(),
          journal_ids: [parseInt(journalId, 10)]
        });
        if (res.data?.success) {
          setSuccess(true);
          setTimeout(() => {
            onHide();
            if (onConfirm) onConfirm(res.data.data.project_id); // triggers callback to refresh detail page if necessary
          }, 1500);
        } else {
          setError(res.data?.message || t("journal.taoDuAnMoiThatBai"));
        }
      } else {
        if (!selectedProjectId) {
          setError(t("journal.vuiLongChonMotDuAn"));
          setSubmitting(false);
          return;
        }

        // Fetch details of selected project to append journal
        const detailsRes = await getProjectByIdApi(selectedProjectId);
        if (!detailsRes.data?.success || !detailsRes.data?.data) {
          throw new Error(t("journal.khongTheLayChiTietDuAnDeCapNha"));
        }
        const project = detailsRes.data.data;
        const currentJournalIds = project.journals?.map(j => j.journal_id) || [];
        const numericJournalId = parseInt(journalId, 10);
        if (currentJournalIds.includes(numericJournalId)) {
          setError(t("journal.tapChiNayDaTonTaiTrongDuAnDaCh"));
          setSubmitting(false);
          return;
        }

        // Call update API
        const updateRes = await updateProjectApi(selectedProjectId, {
          title: project.title,
          subject_area: project.subject_area?.subject_area_id || null,
          subject_category_ids: project.subject_categories?.map(c => c.subject_category_id) || [],
          journal_ids: [...currentJournalIds, numericJournalId]
        });
        if (updateRes.data?.success) {
          setSuccess(true);
          setTimeout(() => {
            onHide();
            if (onConfirm) onConfirm(selectedProjectId);
          }, 1500);
        } else {
          setError(updateRes.data?.message || t("journal.themTapChiVaoDuAnThatBai"));
        }
      }
    } catch (err) {
      console.error('Error adding to project:', err);
      setError(err.response?.data?.message || err.message || t("journal.daCoLoiXayRa"));
    } finally {
      setSubmitting(false);
    }
  };
  return <Modal show={show} onHide={onHide} centered contentClassName="border-0 text-start text-main rounded-3 shadow" style={{
    backdropFilter: 'blur(4px)'
  }}>
      <Modal.Header closeButton className="border-0 pb-0" style={{
      backgroundColor: 'var(--bg-card)'
    }}>
        <Modal.Title className="font-display fw-bold text-main d-flex align-items-center gap-2" style={{
        fontSize: '1.25rem'
      }}>
          <Icon icon="lucide:folder-plus" className="text-primary" width="22" />{t("journal.themTapChiVaoDuAn")}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-4" style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-main)'
      }}>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{t("journal.daThemTapChiVaoDuAnThanhCong")}</Alert>}

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2" style={{
            fontSize: '0.9rem'
          }}>{t("journal.phuongThuc")}</Form.Label>
            <div className="d-flex gap-3">
              <Form.Check type="radio" label={t("journal.chonDuAnDaCo")} name="projectMode" id="modeSelect" checked={mode === 'select'} onChange={() => setMode('select')} className="custom-radio" />
              <Form.Check type="radio" label={t("journal.taoDuAnMoi")} name="projectMode" id="modeCreate" checked={mode === 'create'} onChange={() => setMode('create')} className="custom-radio" />
            </div>
          </Form.Group>

          {mode === 'select' ? <Form.Group className="mb-3">
              <Form.Label className="fw-semibold mb-2" style={{
            fontSize: '0.9rem'
          }}>{t("journal.chonDuAnCuaBan")}</Form.Label>
              {loading ? <div className="d-flex align-items-center gap-2 py-2 text-muted-custom">
                  <Spinner animation="border" size="sm" />
                  <span>{t("journal.dangTaiDanhSachDuAn")}</span>
                </div> : projects.length === 0 ? <div className="text-muted-custom py-2" style={{
            fontSize: '0.9rem'
          }}>{t("journal.banChuaCoDuAnNaoVuiLongChonTao")}</div> : <Form.Select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="journal-dark-input" style={{
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-main)',
            borderColor: 'var(--border)',
            borderRadius: '8px',
            padding: '0.6rem 1rem'
          }}>
                  <option value="">{t("journal.chonDuAn")}</option>
                  {projects.map(p => <option key={p.project_id} value={p.project_id}>
                      {p.title}
                    </option>)}
                </Form.Select>}
            </Form.Group> : <Form.Group className="mb-3">
              <Form.Label className="fw-semibold mb-2" style={{
            fontSize: '0.9rem'
          }}>{t("journal.tenDuAnMoi")}</Form.Label>
              <Form.Control type="text" placeholder={t("journal.nhapTieuDeDuAnNghienCuu")} value={newProjectTitle} onChange={e => setNewProjectTitle(e.target.value)} className="journal-dark-input" style={{
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-main)',
            borderColor: 'var(--border)',
            borderRadius: '8px',
            padding: '0.6rem 1rem'
          }} required />
            </Form.Group>}
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0" style={{
        backgroundColor: 'var(--bg-card)',
        gap: '8px'
      }}>
          <PrimaryButton variant="outline" onClick={onHide} disabled={submitting}>{t("admin.huy")}</PrimaryButton>

          <PrimaryButton type="submit" disabled={submitting || mode === 'select' && projects.length === 0}>
            {submitting && <Spinner animation="border" size="sm" />}
            <span>{t("auth.xacNhan")}</span>
          </PrimaryButton>
        </Modal.Footer>
      </Form>
    </Modal>;
}