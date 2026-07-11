import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ROUTES from '../../../app/routes/routePaths';
import useProjects from '../hooks/useProjects';
import { Icon } from '@iconify/react';
import { getSubjectAreasApi } from '../../catalog/api/catalogApi';
import keywordApi from '../../keywords/api/keywordApi';
import keywordService from '../../keyword/services/keywordService';
import SearchableSelect from '../../../shared/components/Select/SearchableSelect';
import SearchableKeywordInput from '../../../shared/components/Input/SearchableKeywordInput';
import Header from '../../landing/components/Header';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
const CreateProjectPage = () => {
  const { t: _t } = useTranslation();
  const navigate = useNavigate();
  const {
    createProject
  } = useProjects();

  // Form State
  const [title, setTitle] = useState('');
  const [subjectAreaId, setSubjectAreaId] = useState('');
  const [keywords, setKeywords] = useState([]);

  // API Data State
  const [areas, setAreas] = useState([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);

  // Loading States
  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    const fetchCatalogs = async () => {      setLoadingCatalogs(true);
      try {
        const areasRes = await getSubjectAreasApi();
        if (areasRes?.data) setAreas(areasRes.data?.data?.items || areasRes.data?.data || areasRes.data || []);
      } catch (err) {
        console.error(t("project.loiTaiDanhMuc"), err);
        setError(t("project.khongTheTaiDuLieuDanhMucVuiLon"));
      } finally {
        setLoadingCatalogs(false);
      }
    };
    fetchCatalogs();
  }, []);

  // Fetch suggested keywords
  useEffect(() => {
    const fetchSuggestions = async () => {      setLoadingSuggestions(true);
      try {
        const res = await keywordApi.getKeywords({
          limit: 10
        });
        const items = res?.data?.data?.items || res?.data?.data || res?.data || [];
        // Map to string names for the UI suggestions
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
  const handleAreaChange = val => {
    setSubjectAreaId(val);
  };
  const areaOptions = Array.isArray(areas) ? areas.map(area => ({
    value: area.id || area.subject_area_id,
    label: area.display_name || area.name || area.area_name
  })) : [];
  const handleSubmit = async e => {    e.preventDefault();
    if (!title.trim() || !subjectAreaId) {
      setError(t("project.vuiLongNhapTenDuAnVaChonLinhVu"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // 1. Tạo project (không truyền keywords vì BE không còn nhận)
      const res = await createProject({
        title: title.trim(),
        subject_area_id: parseInt(subjectAreaId, 10),
        subject_category_ids: [],
        journal_ids: []
      });

      // 2. Đồng bộ keywords bằng API FE
      const projectId = res?.data?.project_id || res?.data?.id || res?.project_id;
      if (projectId) {
        await keywordService.syncProjectKeywordsFEOnly(projectId, keywords);
        navigate(`/projects/${projectId}`);
      } else {
        setError(res?.message || t("project.taoDuAnThatBai"));
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || err.message || t("project.daCoLoiXayRaKhiTaoDuAn"));
    } finally {
      setLoading(false);
    }
  };
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
            <li className="breadcrumb-item"><Link to={ROUTES.DASHBOARD} className="text-decoration-none text-muted-custom hover-primary">{t("author.tongQuan")}</Link></li>
            <li className="breadcrumb-item"><Link to={ROUTES.PROJECTS} className="text-decoration-none text-muted-custom hover-primary">{t("project.duAnTheoDoi")}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{t("journal.taoDuAnMoi")}</li>
          </ol>
        </nav>

        <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm border">
          <div className="mb-4 text-center">
            <h2 className="font-display fw-bold text-main mb-2">{t("project.khoiTaoDuAnNghienCuuMoi")}</h2>
            <p className="text-muted-custom small mb-0">{t("project.thietLapKhongGianLamViecDeTuDo")}</p>
          </div>

          {error && <div className="alert alert-danger border-0 rounded-3 small py-2 d-flex align-items-center gap-2">
              <Icon icon="lucide:alert-circle" width="18" />
              {error}
            </div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="projectTitle" className="form-label fw-semibold text-main mb-2 small text-uppercase tracking-wider">{t("project.tenDuAn")}<span className="text-danger">*</span>
              </label>
              <input type="text" className="form-control form-control-lg journal-dark-input" id="projectTitle" placeholder={t("project.viDuNghienCuuUngDungDeepLearni")} value={title} onChange={e => setTitle(e.target.value)} disabled={loading} autoFocus required style={{
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              borderColor: 'var(--border)'
            }} />
            </div>

            <div className="mb-4">
              <label htmlFor="subjectArea" className="form-label fw-semibold text-main mb-2 small text-uppercase tracking-wider">{t("project.linhVucNghienCuuChinh")}<span className="text-danger">*</span>
              </label>
              <SearchableSelect options={areas.map(a => ({
              value: a.id || a.subject_area_id,
              label: a.display_name || a.name || a.area_name
            }))} fetchOptions={async search => {
              const res = await getSubjectAreasApi({
                search,
                limit: 20
              });
              const items = res?.data?.data?.items || res?.data?.data || res?.data || [];
              return items.map(a => ({
                value: a.id || a.subject_area_id,
                label: a.display_name || a.name || a.area_name
              }));
            }} value={subjectAreaId} onChange={handleAreaChange} placeholder={t("project.chonLinhVucNghienCuu")} disabled={loadingCatalogs || loading} debounceTime={100} loading={loadingCatalogs} limit={20} />
            </div>

            <div className="mb-5">
              <label className="form-label fw-semibold text-main mb-2 small text-uppercase tracking-wider">{t("project.tuKhoaMuonTheoDoi")}</label>
              <p className="text-muted-custom small mb-2">{t("project.nhanEnterHoacGoDauPhayDeThemTu")}</p>
              
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

            <div className="d-flex gap-3 justify-content-end pt-3 border-top">
              <PrimaryButton type="button" variant="outline" className="px-4 py-2" onClick={() => navigate(-1)} disabled={loading}>{t("admin.huy")}</PrimaryButton>
              <PrimaryButton type="submit" className="px-4 py-2" disabled={loading || !title.trim() || !subjectAreaId}>
                {loading ? <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>{t("project.dangTao")}</> : <>
                    <Icon icon="lucide:check" width="18" />{t("project.taoDuAn")}</>}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>;
};
export default CreateProjectPage;