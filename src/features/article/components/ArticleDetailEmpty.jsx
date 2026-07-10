import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\components\ArticleDetailEmpty.jsx
 */
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
import { StateCard } from '../../../shared/components/Card';
export default function ArticleDetailEmpty({
  articleId
}) {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  return <StateCard variant="warning" icon="lucide:alert-circle" title={t("article.khongTimThayBaiBao")} description={<>{t("article.baiBaoVoiMaSoId")}<strong>{articleId}</strong>{t("article.khongTonTaiHoacDaBiXoaKhoiHeTh")}</>} className="p-5" actions={<>
          <PrimaryButton variant="outline" className="px-4 py-2 font-semibold text-xs" onClick={() => navigate('/dashboard')}>{t("article.veDashboard")}</PrimaryButton>
          <PrimaryButton className="px-4 py-2 font-semibold text-xs" onClick={() => navigate('/articles')}>{t("article.xemDanhSachBaiBao")}</PrimaryButton>
        </>} />;
}