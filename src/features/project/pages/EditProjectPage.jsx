import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import ROUTES from '../../../app/routes/routePaths';
import projectService from '../services/projectService';
import { Icon } from '@iconify/react';
import { getSubjectAreasApi } from '../../catalog/api/catalogApi';
import keywordApi from '../../keywords/api/keywordApi';
import keywordService from '../../keyword/services/keywordService';
import SearchableKeywordInput from '../../../shared/components/Input/SearchableKeywordInput';
import Header from '../../landing/components/Header';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
const EditProjectPage = () => {
  const { t: _t } = useTranslation();
  const {
    id
  } = useParams();
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [subjectAreaId, setSubjectAreaId] = useState('');
  const [keywords, setKeywords] = useState([]);

  // API Data State
  const [areas, setAreas] = useState([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [areasRes, projectRes] = await Promise.all([getSubjectAreasApi(), projectService.getProjectById(id)]);
        if (areasRes?.data) setAreas(areasRes.data?.data?.items || areasRes.data?.data || areasRes.data || []);

        // Pre-fill
        if (projectRes && projectRes.data) {
          const p = projectRes.data;
          setTitle(p.title || '');
          setSubjectAreaId(p.subject_area?.subject_area_id || p.subject_area || '');
          if (p.watched_keywords && Array.isArray(p.watched_keywords) && p.watched_keywords.length > 0) {
            setKeywords(p.watched_keywords);
          } else {
            try {
              const trendingList = await keywordService.getTrendingKeywords(id, 100);
              if (trendingList && trendingList.length > 0) {
                setKeywords(trendingList.map(t => t.keyword || t.display_name));
              } else if (p.project_keywords) {
                setKeywords(p.project_keywords.map(pk => pk.keyword_text || pk.keyword || pk));
              }
            } catch (e) {
              console.error('Error fetching trending keywords:', e);
            }
          }
        }
      } catch (err) {
        console.error(t("project.loiTaiDuLieuDuAn"), err);
        setError(t("project.khongTheTaiDuLieuDuAnVuiLongTa"));
      } finally {
        setLoadingData(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);
  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const res = await keywordApi.getKeywords({
          limit: 10
        });
        const items = res?.data?.data?.items || res?.data?.data || res?.data || [];
        setSuggestedKeywords(Array.isArray(items) ? items.map(k => k.display_name || k.name).filter(Boolean) : []);
      } catch (err) {
        console.error(t("project.loiTaiGoiYTuKhoa"), err);
      } finally {
        setLoadingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, []);
  const selectedAreaObj = areas.find(a => String(a.id || a.subject_area_id) === String(subjectAreaId));
  const selectedAreaName = selectedAreaObj ? selectedAreaObj.display_name || selectedAreaObj.name || selectedAreaObj.area_name : '';
  const removeKeyword = kw => {
    setKeywords(keywords.filter(k => k !== kw));
  };
  const addSuggestedKeyword = kw => {
    if (!keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
    }
  };

  // Handle Area Change
  const handleAreaChange = e => {
    setSubjectAreaId(e.target.value);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!title.trim() || !subjectAreaId) {
      setError(t("project.vuiLongNhapTenDuAnVaChonLinhVu"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // 1. Cập nhật thông tin dự án (không kèm keywords vì BE đã revert)
      const res = await projectService.updateProject(id, {
        title: title.trim(),
        subject_area_id: parseInt(subjectAreaId, 10),
        subject_category_ids: [],
        journal_ids: []
      });

      // 2. Đồng bộ keywords từ Frontend
      if (res && res.success !== false) {
        await keywordService.syncProjectKeywordsFEOnly(id, keywords);
        navigate(`/projects/${id}`);
      } else {
        setError(res?.message || t("project.capNhatDuAnThatBai"));
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.response?.data?.message || err.message || t("project.daCoLoiXayRaKhiCapNhatDuAn"));
    } finally {
      setLoading(false);
    }
  };
  if (loadingData) {
    return <div className="container-fluid py-4 grid-bg min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>;
  }
  return <div className="container-fluid pb-4 grid-bg min-vh-100 position-relative overflow-hidden" style={{
    paddingTop: '80px'
  }}>
      <div className="position-absolute w-100 h-100 radial-fade pe-none" style={{
      top: 0,
      left: 0,
      zIndex: 0
    }} />
      <Header />
      <div className="container mx-auto position-relative z-1" style={{
      maxWidth: '650px',
      marginTop: '40px'
    }}>
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-2 text-muted-custom small">
            <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted-custom hover-primary">{t("author.tongQuan")}</Link></li>
            <li className="breadcrumb-item"><Link to="/projects" className="text-decoration-none text-muted-custom hover-primary">{t("project.duAnTheoDoi")}</Link></li>
            <li className="breadcrumb-item"><Link to={`/projects/${id}`} className="text-decoration-none text-muted-custom hover-primary">{title || t("landing.duAn")}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{t("project.quanLyTuKhoa")}</li>
          </ol>
        </nav>

        <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm border bg-white">
          <div className="mb-4">
            <h2 className="font-display fw-bold text-main mb-2" style={{
            fontSize: '1.75rem'
          }}>{t("project.quanLyTuKhoaTheoDoi")}</h2>
            <p className="text-muted-custom small mb-0">{t("project.themHoacXoaCacCumTuKhoaNghienC")}</p>
          </div>

          {error && <div className="alert alert-danger border-0 rounded-3 small py-2 d-flex align-items-center gap-2">
              <Icon icon="lucide:alert-circle" width="18" />
              {error}
            </div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="form-label fw-semibold text-muted-custom mb-2 small text-uppercase tracking-wider">{t("project.tuKhoaDangTheoDoi")}</label>
              <SearchableKeywordInput keywords={keywords} placeholder={t("project.chonTuKhoaTheoDoi")} disabled={loading} onAddKeyword={val => {
              if (val && !keywords.includes(val)) {
                setKeywords([...keywords, val]);
              }
            }} onRemoveKeyword={removeKeyword} />

              {suggestedKeywords.length > 0 && <div className="mt-3 small">
                  <span className="text-muted-custom">{t("project.goiYTuKhoaNoiBat")}</span>
                  {loadingSuggestions ? <span className="text-muted-custom ms-2">{t("common.dangTai")}</span> : <div className="d-flex flex-wrap gap-2 mt-2">
                      {suggestedKeywords.filter(k => !keywords.includes(k)).map(sugg => <span key={sugg} className="badge rounded-pill bg-light text-dark border cursor-pointer hover-primary" onClick={() => addSuggestedKeyword(sugg)}>
                          + {sugg}
                        </span>)}
                    </div>}
                </div>}
            </div>

            <div className="d-flex gap-3 justify-content-end pt-4 mt-4 border-top">
              <PrimaryButton type="button" variant="outline" className="px-4 py-2" onClick={() => navigate(-1)} disabled={loading}>{t("auth.quayLai")}</PrimaryButton>
              <PrimaryButton type="submit" className="px-4 py-2" disabled={loading}>
                {loading ? <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>{t("project.dangLuu")}</> : <>
                    <Icon icon="lucide:save" width="18" />{t("admin.luuThayDoi")}</>}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>;
};
export default EditProjectPage;