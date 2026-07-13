import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\components\ArticleDetailError.jsx
 */
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
import { StateCard } from '../../../shared/components/Card';
export default function ArticleDetailError({
  errorMsg,
  onRetry
}) {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  return <StateCard variant="error" icon="lucide:wifi-off" title={t("article.loiTaiDuLieu")} description={errorMsg || t("article.khongTheKetNoiDenMayChuVuiLong")} className="p-5" actions={<>
          {onRetry && <PrimaryButton className="px-4 py-2 font-semibold text-xs" onClick={onRetry}>{t("article.thuTaiLai")}</PrimaryButton>}
          <PrimaryButton variant="outline" className="px-4 py-2 font-semibold text-xs" onClick={() => navigate('/articles')}>{t("article.veDanhSachBaiBao")}</PrimaryButton>
        </>} />;
}