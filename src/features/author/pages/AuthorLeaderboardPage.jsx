/**
 * @file AuthorLeaderboardPage.jsx
 * @description Trang hiển thị Bảng xếp hạng Tác giả.
 * Hỗ trợ lọc các tác giả hàng đầu theo lĩnh vực nghiên cứu hoặc khoảng thời gian (tất cả, tuần này, tháng này).
 * 
 * Bố cục giao diện:
 * - Component Header điều hướng phía trên.
 * - Thanh breadcrumb dẫn đường.
 * - Menu điều hướng phụ dạng tab (`AuthorNavigationTabs`) ở trạng thái hoạt động "leaderboard".
 * - Bộ điều khiển bộ lọc (hộp chọn lĩnh vực nghiên cứu, hộp chọn khoảng thời gian).
 * - Bảng hiển thị danh sách xếp hạng tác giả (`AuthorLeaderboardTable`).
 */

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../shared/components/Icon';
import Header from '../../landing/components/Header';
import useAuthors from '../hooks/useAuthors';
import AuthorLeaderboardTable from '../components/AuthorLeaderboardTable';
import AuthorNavigationTabs from '../components/AuthorNavigationTabs';

/**
 * Hiển thị trang Bảng xếp hạng tác giả tại tuyến đường `/authors/leaderboard`.
 * 
 * @returns {JSX.Element} Giao diện trang Bảng xếp hạng tác giả.
 */
export default function AuthorLeaderboardPage() {
  const navigate = useNavigate();

  // Trích xuất các trạng thái và trigger bảng xếp hạng từ hook useAuthors
  const {
    leaderboard,
    loadingLeaderboard,
    errorLeaderboard,
    fetchLeaderboard
  } = useAuthors();

  // ── CÁC TRẠNG THÁI BỘ LỌC CỤC BỘ ───────────────────────────────────────────
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // Time range filter: 'week', 'month', 'all'

  // ── SIDE EFFECT: KÍCH HOẠT KHI THAY ĐỔI BỘ LỌC ──────────────────────────────
  // Gọi lại API lấy dữ liệu bảng xếp hạng mỗi khi lĩnh vực nghiên cứu hoặc khoảng thời gian được chọn thay đổi.
  useEffect(() => {
    fetchLeaderboard({
      subject_area: selectedArea,
      period: selectedPeriod
    });
  }, [selectedArea, selectedPeriod, fetchLeaderboard]);

  return (
    <div
      className="min-vh-100"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', paddingTop: '80px' }}
    >
      {/* Thanh Header điều hướng */}
      <Header />

      <Container className="py-4">
        {/* Đường dẫn Breadcrumb */}
        <nav className="mb-3" aria-label="breadcrumb">
          <ol className="breadcrumb m-0" style={{ fontSize: '0.8rem' }}>
            <li className="breadcrumb-item">
              <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                Tổng quan
              </span>
            </li>
            <li className="breadcrumb-item">
              <span onClick={() => navigate('/authors')} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                Tác giả nổi bật
              </span>
            </li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--text-muted)' }}>
              Bảng xếp hạng
            </li>
          </ol>
        </nav>

        {/* Tiêu đề Trang & Liên kết quay lại */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <h1 
              className="font-display fw-bold text-main mb-2" 
              style={{ fontSize: '2.1rem', letterSpacing: '-0.02em' }}
            >
              🏆 Bảng xếp hạng tác giả
            </h1>
            <p className="text-muted-custom mb-0" style={{ fontSize: '0.88rem' }}>
              Các tác giả nổi bật nhất hệ thống được xếp hạng theo số bài báo, citations và tầm ảnh hưởng nghiên cứu.
            </p>
          </div>
          <Button 
                      variant="link" 
                      onClick={() => navigate('/authors')}
                      className="text-main hover:text-dark p-0 text-decoration-none d-flex align-items-center gap-2 mb-3 font-semibold"
                      style={{ fontSize: '0.9rem', fontWeight: 600 }}
                    >
                      <Icon icon="lucide:arrow-left" width="18" />
                      <span>Quay lại danh sách tác giả</span>
                    </Button>
        </div>

        {/* Tab menu điều hướng phụ (Đặt activeTab="leaderboard") */}
        <AuthorNavigationTabs activeTab="leaderboard" />

        {/* Bảng điều khiển bộ lọc */}
        <Card 
          className="p-3 mb-4" 
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border)', 
            borderRadius: '12px' 
          }}
        >
          <Row className="g-3 align-items-center">
            {/* Hộp chọn bộ lọc Lĩnh vực nghiên cứu */}
            <Col xs={12} sm={6} md={4}>
              <Form.Group className="d-flex align-items-center gap-2">
                <Form.Label className="text-muted-custom m-0 text-sm flex-shrink-0" style={{ fontSize: '0.8rem' }}>Lĩnh vực:</Form.Label>
                <Form.Select
                  size="sm"
                  value={selectedArea}
                  onChange={e => setSelectedArea(e.target.value)}
                  className="text-muted-custom"
                  style={{ borderColor: 'var(--border)', fontSize: '0.82rem' }}
                >
                  <option value="">Tất cả lĩnh vực</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="Deep Learning">Deep Learning</option>
                  <option value="Quantum Optics">Quantum Optics</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Hộp chọn bộ lọc Khoảng thời gian */}
            <Col xs={12} sm={6} md={4}>
              <Form.Group className="d-flex align-items-center gap-2">
                <Form.Label className="text-muted-custom m-0 text-sm flex-shrink-0" style={{ fontSize: '0.8rem' }}>Thời gian:</Form.Label>
                <Form.Select
                  size="sm"
                  value={selectedPeriod}
                  onChange={e => setSelectedPeriod(e.target.value)}
                  className="text-muted-custom"
                  style={{ borderColor: 'var(--border)', fontSize: '0.82rem' }}
                >
                  <option value="all">Tất cả thời gian</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card>

        {/* Bảng xếp hạng tác giả */}
        <AuthorLeaderboardTable
          authors={leaderboard}
          loading={loadingLeaderboard}
          error={errorLeaderboard}
          onRetry={() => fetchLeaderboard({ subject_area: selectedArea, period: selectedPeriod })}
        />
      </Container>
    </div>
  );
}
