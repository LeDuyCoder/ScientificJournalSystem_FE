/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\components\ArticleDetailEmpty.jsx
 */
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
import { StateCard } from '../../../shared/components/Card';

export default function ArticleDetailEmpty({ articleId }) {
  const navigate = useNavigate();

  return (
    <StateCard
      variant="warning"
      icon="lucide:alert-circle"
      title="Không tìm thấy bài báo"
      description={(
        <>
          Bài báo với mã số ID <strong>{articleId}</strong> không tồn tại hoặc đã bị xóa khỏi hệ thống cơ sở dữ liệu Scientific Journal.
        </>
      )}
      className="p-5"
      actions={(
        <>
          <PrimaryButton
            variant="outline"
            className="px-4 py-2 font-semibold text-xs"
            onClick={() => navigate('/dashboard')}
          >
            Về Dashboard
          </PrimaryButton>
          <PrimaryButton
            className="px-4 py-2 font-semibold text-xs"
            onClick={() => navigate('/articles')}
          >
            Xem danh sách bài báo
          </PrimaryButton>
        </>
      )}
    />
  );
}
