/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\components\ArticleDetailError.jsx
 */
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
import { StateCard } from '../../../shared/components/Card';

export default function ArticleDetailError({ errorMsg, onRetry }) {
  const navigate = useNavigate();

  return (
    <StateCard
      variant="error"
      icon="lucide:wifi-off"
      title="Lỗi tải dữ liệu"
      description={errorMsg || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.'}
      className="p-5"
      actions={(
        <>
          {onRetry && (
            <PrimaryButton
              className="px-4 py-2 font-semibold text-xs"
              onClick={onRetry}
            >
              Thử tải lại
            </PrimaryButton>
          )}
          <PrimaryButton
            variant="outline"
            className="px-4 py-2 font-semibold text-xs"
            onClick={() => navigate('/articles')}
          >
            Về danh sách bài báo
          </PrimaryButton>
        </>
      )}
    />
  );
}
