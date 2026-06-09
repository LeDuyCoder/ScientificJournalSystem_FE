import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useProjects from '../hooks/useProjects';
import { Icon } from '@iconify/react';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Vui lòng nhập tên dự án');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createProject({ title: title.trim() });
      if (response && response.success !== false) {
        // response.data from service contains the inner payload
        const projectId = response.data?.project_id || response.data?.id;
        // Chuyển hướng tới trang chi tiết project hoặc dashboard
        navigate(projectId ? `/projects/${projectId}` : '/dashboard');
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
    <div className="container-fluid py-4 grid-bg min-vh-100">
      <div className="container mx-auto" style={{ maxWidth: '600px', marginTop: '40px' }}>
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-2 text-muted-custom small">
            <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted-custom hover-primary">Dashboard</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Tạo Project mới</li>
          </ol>
        </nav>

        <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm">
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '64px', height: '64px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Icon icon="lucide:folder-plus" width="32" />
            </div>
            <h2 className="font-display fw-bold text-main mb-2">Tạo Dự án Nghiên cứu</h2>
            <p className="text-muted-custom small">Bắt đầu một không gian làm việc mới để lưu trữ và theo dõi các bài báo khoa học, từ khóa liên quan.</p>
          </div>

          {error && (
            <div className="alert alert-danger border-0 rounded-3 small">
              <Icon icon="lucide:alert-circle" className="me-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="projectTitle" className="form-label fw-semibold text-main mb-2">
                Tên Dự án <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-lg journal-dark-input"
                id="projectTitle"
                placeholder="Nhập tiêu đề dự án nghiên cứu..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                autoFocus
                required
                style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', borderColor: 'var(--border)' }}
              />
            </div>

            <div className="d-flex gap-3 mt-5">
              <button
                type="button"
                className="btn btn-light flex-grow-1 border fw-medium"
                onClick={() => navigate(-1)}
                disabled={loading}
                style={{ color: 'var(--text-muted)' }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-grow-1 btn-primary-glow fw-medium d-flex align-items-center justify-content-center gap-2"
                disabled={loading || !title.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:check" width="18" />
                    Khởi tạo
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
