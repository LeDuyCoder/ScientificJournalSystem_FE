import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import projectService from '../services/projectService';
import { Icon } from '@iconify/react';
import { getSubjectAreasApi } from '../../catalog/api/catalogApi';
import Header from '../../landing/components/Header';

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form State
  const [title, setTitle] = useState('');
  const [subjectAreaId, setSubjectAreaId] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  
  // API Data State
  const [areas, setAreas] = useState([]);
  
  // Loading States
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [areasRes, projectRes] = await Promise.all([
          getSubjectAreasApi(),
          projectService.getProjectById(id)
        ]);
        
        if (areasRes?.data) setAreas(areasRes.data?.data?.items || areasRes.data?.data || areasRes.data || []);

        // Pre-fill
        if (projectRes?.data) {
          const p = projectRes.data;
          setTitle(p.title || '');
          setSubjectAreaId(p.subject_area?.subject_area_id || p.subject_area || '');
          if (p.keywords && Array.isArray(p.keywords)) {
            setKeywords(p.keywords);
          } else if (p.project_keywords) {
            setKeywords(p.project_keywords.map(pk => pk.keyword_text || pk.keyword || pk));
          }
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu dự án:', err);
        setError('Không thể tải dữ liệu dự án. Vui lòng tải lại trang.');
      } finally {
        setLoadingData(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

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
      
      const response = await projectService.updateProject(id, payload);
      if (response && response.success !== false) {
        navigate(`/projects/${id}`);
      } else {
        setError(response?.message || 'Cập nhật dự án thất bại');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.response?.data?.message || err.message || 'Đã có lỗi xảy ra khi cập nhật dự án');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="container-fluid py-4 grid-bg min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid pb-4 grid-bg min-vh-100 position-relative overflow-hidden" style={{ paddingTop: '80px' }}>
      <div className="position-absolute w-100 h-100 radial-fade pe-none" style={{ top: 0, left: 0, zIndex: 0 }} />
      <Header />
      <div className="container mx-auto position-relative z-1" style={{ maxWidth: '650px', marginTop: '40px' }}>
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-2 text-muted-custom small">
            <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted-custom hover-primary">Tổng quan</Link></li>
            <li className="breadcrumb-item"><Link to="/projects" className="text-decoration-none text-muted-custom hover-primary">Dự án theo dõi</Link></li>
            <li className="breadcrumb-item"><Link to={`/projects/${id}`} className="text-decoration-none text-muted-custom hover-primary">{title || 'Dự án'}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Quản lý từ khóa</li>
          </ol>
        </nav>

        <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm border bg-white">
          <div className="mb-4">
            <h2 className="font-display fw-bold text-main mb-2" style={{ fontSize: '1.75rem' }}>Quản lý từ khóa theo dõi</h2>
            <p className="text-muted-custom small mb-0">Thêm hoặc xóa các cụm từ khóa nghiên cứu để tối ưu hóa nguồn bài báo và cảnh báo liên quan.</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-3 small py-2 d-flex align-items-center gap-2">
              <Icon icon="lucide:alert-circle" width="18" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold text-muted-custom mb-2 small text-uppercase tracking-wider">
                THÊM TỪ KHÓA MỚI
              </label>
              <div className="input-group input-group-lg border rounded-3 p-1" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border)' }}>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent text-main fs-6 shadow-none"
                  placeholder="Ví dụ: Transformer, Large Language Models..."
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-dark fw-medium rounded-2 px-4"
                  onClick={() => {
                    const val = keywordInput.trim();
                    if (val && !keywords.includes(val)) {
                      setKeywords([...keywords, val]);
                    }
                    setKeywordInput('');
                  }}
                  disabled={loading}
                >
                  Thêm
                </button>
              </div>
            </div>

            <div className="mb-5">
              <label className="form-label fw-semibold text-muted-custom mb-2 small text-uppercase tracking-wider">
                DANH SÁCH TỪ KHÓA ĐANG HOẠT ĐỘNG ({keywords.length})
              </label>
              
              <div className="border rounded-3 p-4" style={{ backgroundColor: '#FAFAFA', minHeight: '120px' }}>
                {keywords.length === 0 ? (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted-custom small text-center" style={{ minHeight: '80px' }}>
                    Chưa có từ khóa nào được đăng ký. Hãy thêm một vài từ khóa bên trên!
                  </div>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {keywords.map(kw => (
                      <span key={kw} className="badge rounded-pill d-flex align-items-center gap-1 px-3 py-2 fw-normal fs-6 shadow-sm bg-white" style={{ color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                        {kw}
                        <Icon icon="lucide:x" width="16" className="cursor-pointer text-muted-custom ms-1 hover-danger" onClick={() => removeKeyword(kw)} />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex gap-3 justify-content-end pt-4 mt-4 border-top">
              <button
                type="button"
                className="btn btn-light px-4 py-2 border fw-medium rounded-pill"
                onClick={() => navigate(-1)}
                disabled={loading}
                style={{ color: 'var(--text-muted)' }}
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 btn-primary-glow fw-medium d-flex align-items-center justify-content-center gap-2 rounded-pill"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:save" width="18" />
                    Lưu thay đổi
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

export default EditProjectPage;
