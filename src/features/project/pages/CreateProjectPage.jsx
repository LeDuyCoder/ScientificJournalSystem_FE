import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useProjects from '../hooks/useProjects';
import { Icon } from '@iconify/react';
import { getSubjectAreasApi } from '../../catalog/api/catalogApi';
import Header from '../../landing/components/Header';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  
  // Form State
  const [title, setTitle] = useState('');
  const [subjectAreaId, setSubjectAreaId] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  
  // API Data State
  const [areas, setAreas] = useState([]);
  
  // Loading States
  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [error, setError] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoadingCatalogs(true);
      try {
        const areasRes = await getSubjectAreasApi();
        if (areasRes?.data) setAreas(areasRes.data?.data?.items || areasRes.data?.data || areasRes.data || []);
      } catch (err) {
        console.error('Lỗi tải danh mục:', err);
        setError('Không thể tải dữ liệu danh mục. Vui lòng tải lại trang.');
      } finally {
        setLoadingCatalogs(false);
      }
    };
    fetchCatalogs();
  }, []);

  const selectedAreaObj = areas.find(a => String(a.id || a.subject_area_id) === String(subjectAreaId));
  const selectedAreaName = selectedAreaObj ? (selectedAreaObj.display_name || selectedAreaObj.name || selectedAreaObj.area_name) : '';

  const getSuggestions = (areaName) => {
    if (!areaName) return [];
    if (areaName.toLowerCase().includes('computer science')) {
      return ["Machine Learning", "Artificial Intelligence", "Cybersecurity", "Blockchain", "Cloud Computing", "Computer Vision", "NLP"];
    }
    if (areaName.toLowerCase().includes('medicine') || areaName.toLowerCase().includes('health')) {
      return ["Clinical Trials", "Public Health", "Genetics", "Immunology", "Neuroscience"];
    }
    return ["Data Analysis", "Methodology", "Research Design", "Literature Review"];
  };

  const handleKeywordKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = keywordInput.trim();
      if (val && !keywords.includes(val)) {
        setKeywords([...keywords, val]);
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw) => {
    setKeywords(keywords.filter(k => k !== kw));
  };
  
  const addSuggestedKeyword = (kw) => {
    if (!keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
    }
  };

  // Handle Area Change
  const handleAreaChange = (e) => {
    setSubjectAreaId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subjectAreaId) {
      setError('Vui lòng nhập tên dự án và chọn lĩnh vực nghiên cứu.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        subject_area_id: parseInt(subjectAreaId, 10),
        keywords: keywords
      };
      
      const response = await createProject(payload);
      if (response && response.success !== false) {
        const projectId = response.data?.project_id || response.data?.id || response.project_id;
        navigate(projectId ? `/projects/${projectId}` : '/projects');
      } else {
        setError(response?.message || 'Tạo dự án thất bại');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || err.message || 'Đã có lỗi xảy ra khi tạo dự án');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid pb-4 grid-bg min-vh-100 position-relative overflow-hidden" style={{ paddingTop: '80px' }}>
      <div className="position-absolute w-100 h-100 radial-fade pe-none" style={{ top: 0, left: 0, zIndex: 0 }} />
      <Header />
      <div className="container mx-auto position-relative z-1" style={{ maxWidth: '650px', marginTop: '40px' }}>
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-2 text-muted-custom small">
            <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted-custom hover-primary">Tổng quan</Link></li>
            <li className="breadcrumb-item"><Link to="/projects" className="text-decoration-none text-muted-custom hover-primary">Dự án theo dõi</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Tạo dự án mới</li>
          </ol>
        </nav>

        <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm border">
          <div className="mb-4 text-center">
            <h2 className="font-display fw-bold text-main mb-2">Khởi tạo dự án nghiên cứu mới</h2>
            <p className="text-muted-custom small mb-0">Thiết lập không gian làm việc để tự động theo dõi xu hướng, nhận cảnh báo bài viết khoa học và giám sát từ khóa.</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-3 small py-2 d-flex align-items-center gap-2">
              <Icon icon="lucide:alert-circle" width="18" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="projectTitle" className="form-label fw-semibold text-main mb-2 small text-uppercase tracking-wider">
                Tên Dự án <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-lg journal-dark-input"
                id="projectTitle"
                placeholder="Ví dụ: Nghiên cứu ứng dụng Deep Learning trong Y học"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                autoFocus
                required
                style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', borderColor: 'var(--border)' }}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="subjectArea" className="form-label fw-semibold text-main mb-2 small text-uppercase tracking-wider">
                Lĩnh vực nghiên cứu chính <span className="text-danger">*</span>
              </label>
              <select
                className="form-select form-control-lg journal-dark-input"
                id="subjectArea"
                value={subjectAreaId}
                onChange={handleAreaChange}
                disabled={loadingCatalogs || loading}
                required
                style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', borderColor: 'var(--border)' }}
              >
                <option value="">-- Chọn lĩnh vực nghiên cứu --</option>
                {Array.isArray(areas) && areas.map(area => (
                  <option key={area.id || area.subject_area_id} value={area.id || area.subject_area_id}>
                    {area.display_name || area.name || area.area_name}
                  </option>
                ))}
              </select>
              {loadingCatalogs && <div className="form-text mt-2"><span className="spinner-border spinner-border-sm me-2"></span> Đang tải danh mục...</div>}
            </div>

            <div className="mb-5">
              <label className="form-label fw-semibold text-main mb-2 small text-uppercase tracking-wider">
                Từ khóa muốn theo dõi
              </label>
              <p className="text-muted-custom small mb-2">Nhấn Enter hoặc gõ dấu phẩy để thêm từ khóa. Hệ thống sẽ quét các bài báo mới dựa trên các từ khóa này.</p>
              
              <div className="form-control form-control-lg journal-dark-input d-flex flex-wrap gap-2 align-items-center" style={{ minHeight: '50px', backgroundColor: 'var(--bg-main)', borderColor: 'var(--border)' }}>
                {keywords.map(kw => (
                  <span key={kw} className="badge rounded-pill d-flex align-items-center gap-1 px-2 py-1 fw-normal" style={{ backgroundColor: 'var(--bg-section)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                    {kw}
                    <Icon icon="lucide:x" width="14" className="cursor-pointer hover-danger" onClick={() => removeKeyword(kw)} />
                  </span>
                ))}
                <input
                  type="text"
                  className="border-0 bg-transparent text-main flex-grow-1"
                  style={{ outline: 'none', minWidth: '150px' }}
                  placeholder="Thêm từ khóa và nhấn Enter..."
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  disabled={loading}
                />
              </div>

              {subjectAreaId && (
                <div className="mt-3 small">
                  <span className="text-muted-custom">Gợi ý từ khóa cho {selectedAreaName}: </span>
                  <div className="d-flex flex-wrap gap-2 mt-1">
                    {getSuggestions(selectedAreaName).map(sugg => (
                      <span 
                        key={sugg} 
                        className="text-muted-custom cursor-pointer hover-primary"
                        onClick={() => addSuggestedKeyword(sugg)}
                      >
                        + {sugg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex gap-3 justify-content-end pt-3 border-top">
              <button
                type="button"
                className="btn btn-light px-4 py-2 border fw-medium rounded-pill"
                onClick={() => navigate(-1)}
                disabled={loading}
                style={{ color: 'var(--text-muted)' }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 btn-primary-glow fw-medium d-flex align-items-center justify-content-center gap-2 rounded-pill"
                disabled={loading || !title.trim() || !subjectAreaId}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:check" width="18" />
                    Tạo dự án
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
