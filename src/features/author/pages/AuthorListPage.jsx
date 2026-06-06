/**
 * @file AuthorListPage.jsx
 * @description Trang hiển thị Danh mục Đăng ký Tác giả (`/authors`).
 * Hiển thị danh sách tác giả phù hợp với các bộ lọc và từ khóa tìm kiếm (phù hợp với Ảnh thiết kế 2).
 * 
 * Các tính năng chính:
 * - Đường dẫn Breadcrumb ánh xạ: `Tổng quan > Tác giả nổi bật`.
 * - 4 Thẻ thống kê tóm tắt hiển thị tổng số lượng tác giả và bài báo khoa học.
 * - Thanh tìm kiếm đi kèm các tham số lọc (lĩnh vực nghiên cứu, chế độ sắp xếp).
 * - Nút chuyển đổi chế độ hiển thị (Lưới/Grid vs Bảng/Table). Bố cục Lưới khớp với Ảnh thiết kế 2.
 * - Đồng bộ trạng thái bộ lọc qua các tham số truy vấn URL (`searchParams`) của React Router.
 * - Tích hợp phân trang đầy đủ với bộ điều khiển phân trang tùy chỉnh.
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Card, Button, Pagination } from 'react-bootstrap';
import Icon from '../../../shared/components/Icon';
import Header from '../../landing/components/Header';
import useAuthors from '../hooks/useAuthors';
import AuthorTable from '../components/AuthorTable';
import AuthorCard from '../components/AuthorCard';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import AuthorNavigationTabs from '../components/AuthorNavigationTabs';

/**
 * @component AuthorListPage
 * @description Trang bộ điều khiển chính cho tuyến đường danh sách tác giả `/authors`.
 */
export default function AuthorListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // Đồng bộ trực tiếp với tham số truy vấn trên URL

  // Trích xuất các trạng thái và phương thức lấy dữ liệu tác giả từ useAuthors
  const {
    authors,
    totalAuthors,
    loadingAuthors,
    errorAuthors,
    fetchAuthors
  } = useAuthors();

  // Chuyển đổi chế độ xem cục bộ (mặc định là 'grid' khớp với ảnh thiết kế 2)
  const [viewMode, setViewMode] = useState('grid'); // Hiển thị kiểu 'grid' hoặc 'table'

  // Trích xuất các tham số truy vấn URL với giá trị mặc định an toàn
  const searchVal = searchParams.get('search') || '';
  const pageVal = parseInt(searchParams.get('page') || '1', 10);
  const limitVal = parseInt(searchParams.get('limit') || '4', 10); // Mặc định là 4 tác giả mỗi trang (phù hợp với Ảnh 2)
  const sortVal = searchParams.get('sort') || '';
  const subjectAreaVal = searchParams.get('subject_area') || '';
  const countryVal = searchParams.get('country') || '';

  // Trạng thái đệm cục bộ cho ô nhập tìm kiếm (chỉ áp dụng khi Submit Form)
  const [searchInput, setSearchInput] = useState(searchVal);

  // ── SIDE EFFECT: ĐỒNG BỘ GỌI API FETCH ─────────────────────────────────────
  // Gọi lại API lấy danh sách tác giả mỗi khi bất kỳ tham số truy vấn URL nào thay đổi.
  useEffect(() => {
    fetchAuthors({
      search: searchVal,
      page: pageVal,
      limit: limitVal,
      sort: sortVal,
      subject_area: subjectAreaVal,
      country: countryVal
    });
  }, [searchVal, pageVal, limitVal, sortVal, subjectAreaVal, countryVal, fetchAuthors]);

  /**
   * @function handleSearchSubmit
   * @description Đẩy giá trị nhập tìm kiếm cục bộ vào các tham số URL. Đặt lại trang hiện tại về 1.
   */
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      nextParams.set('search', searchInput.trim());
    } else {
      nextParams.delete('search');
    }
    nextParams.set('page', '1'); // Đặt lại chỉ số trang về 1
    setSearchParams(nextParams);
  };

  /**
   * @function handleFilterChange
   * @description Đẩy các thay đổi của hộp chọn bộ lọc vào tham số URL. Đặt lại trang hiện tại về 1.
   */
  const handleFilterChange = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  /**
   * @function handlePageChange
   * @description Cập nhật tham số trang trong URL khi nhấp vào nút phân trang.
   */
  const handlePageChange = (newPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    setSearchParams(nextParams);
  };

  // Tính toán giới hạn phân trang
  const totalPages = Math.ceil(totalAuthors / limitVal);
  const startIndex = (pageVal - 1) * limitVal + 1;

  // Dữ liệu tĩnh hiển thị trên các thẻ thống kê
  const statCards = [
    { label: 'Tổng tác giả', value: '4.821', icon: 'lucide:users', desc: 'Nhà nghiên cứu hệ thống' },
    { label: 'Tác giả nổi bật', value: '124', icon: 'lucide:award', desc: 'H-index vượt trội (>=30)' },
    { label: 'Tổng bài báo', value: '98.542', icon: 'lucide:file-text', desc: 'Công bố khoa học được lưu trữ' },
    { label: 'Tổng citations', value: '1.2M+', icon: 'lucide:quote', desc: 'Trích dẫn nghiên cứu khoa học' }
  ];

  return (
    <div
      className="min-vh-100"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', paddingTop: '80px' }}
    >
      {/* Thanh Header điều hướng phía trên */}
      <Header />

      <Container className="py-4">
        {/* 1. Đường dẫn điều hướng breadcrumb khớp chính xác với thiết kế */}
        <nav className="mb-3" aria-label="breadcrumb">
          <ol className="breadcrumb m-0" style={{ fontSize: '0.8rem' }}>
            <li className="breadcrumb-item">
              <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                Tổng quan
              </span>
            </li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Tác giả nổi bật
            </li>
          </ol>
        </nav>

        {/* 2. Tiêu đề Trang & Mô tả phụ */}
        <div className="mb-4">
          <h1 
            className="font-display fw-bold text-main mb-2" 
            style={{ fontSize: '2.1rem', letterSpacing: '-0.02em' }}
          >
            Danh sách Nhà khoa học & Tác giả
          </h1>
          <p 
            className="text-muted-custom mb-0" 
            style={{ fontSize: '0.88rem', maxWidth: '800px', lineHeight: '1.6' }}
          >
            Tra cứu thông tin, chỉ số học thuật h-index, số trích dẫn và các công trình khoa học của các tác giả hàng đầu.
          </p>
        </div>

        {/* Các Tab menu điều hướng phụ (Đặt activeTab="list") */}
        <AuthorNavigationTabs activeTab="list" />

        {/* 3. Hàng thẻ Thống kê chỉ số */}
        <Row className="g-3 mb-4">
          {statCards.map((stat, idx) => (
            <Col xs={12} sm={6} lg={3} key={idx}>
              <Card 
                className="p-3 border transition-all"
                style={{
                  backgroundColor: 'var(--bg-chip)',
                  borderColor: 'var(--border)',
                  borderTop: '3px solid var(--primary)', // Đường viền màu cam phía trên làm điểm nhấn
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.01)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-muted-custom" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {stat.label}
                  </span>
                  <Icon icon={stat.icon} width="16" className="text-primary" />
                </div>
                <div className="text-main fw-bold" style={{ fontSize: '1.45rem', fontFamily: 'var(--font-sans)' }}>
                  {stat.value}
                </div>
                <div className="text-muted-custom mt-1" style={{ fontSize: '0.68rem' }}>
                  {stat.desc}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 4. Thanh Tìm kiếm & Bộ lọc */}
        <Card 
          className="p-3 mb-4" 
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border)', 
            borderRadius: '12px' 
          }}
        >
          <Form onSubmit={handleSearchSubmit}>
            <Row className="g-3 align-items-center">
              {/* Ô nhập tìm kiếm từ khóa kèm hiệu ứng focus */}
              <Col xs={12} lg={4}>
                <InputGroup
                  className="rounded-3 border overflow-hidden bg-transparent"
                  style={{
                    borderColor: 'var(--border)',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onBlurCapture={e  => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <InputGroup.Text className="border-0 bg-transparent text-muted-custom pe-1">
                    <Icon icon="lucide:search" width="16" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Tìm theo tên, viện nghiên cứu, từ khóa..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="border-0 bg-transparent text-main text-sm"
                    style={{ 
                      outline: 'none', 
                      boxShadow: 'none', 
                      fontSize: '0.82rem',
                      paddingLeft: '6px'
                    }}
                  />
                </InputGroup>
              </Col>

              {/* Hộp chọn bộ lọc Lĩnh vực nghiên cứu */}
              <Col xs={12} sm={6} lg={3}>
                <Form.Select
                  size="sm"
                  value={subjectAreaVal}
                  onChange={e => handleFilterChange('subject_area', e.target.value)}
                  className="text-muted-custom text-sm"
                  style={{ borderColor: 'var(--border)', padding: '0.5rem 0.75rem', fontSize: '0.82rem' }}
                >
                  <option value="">Tất cả lĩnh vực</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="Natural Language Processing">Natural Language Processing</option>
                  <option value="Quantum Optics">Quantum Optics</option>
                </Form.Select>
              </Col>

              {/* Hộp chọn Chế độ Sắp xếp */}
              <Col xs={12} sm={6} lg={2}>
                <Form.Select
                  size="sm"
                  value={sortVal}
                  onChange={e => handleFilterChange('sort', e.target.value)}
                  className="text-muted-custom text-sm"
                  style={{ borderColor: 'var(--border)', padding: '0.5rem 0.75rem', fontSize: '0.82rem' }}
                >
                  <option value="">Sắp xếp mặc định</option>
                  <option value="articles">Sắp xếp theo bài báo</option>
                  <option value="citations">Sắp xếp theo citations</option>
                </Form.Select>
              </Col>

              {/* Các nút hành động (Tìm kiếm & Điều hướng) */}
              <Col xs={12} sm={6} lg={1} className="d-flex gap-2">
                <Button 
                  type="submit"
                  className="btn-primary-glow w-100 py-2"
                  style={{ borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  Tìm
                </Button>
              </Col>

              {/* Bộ chuyển đổi chế độ hiển thị giao diện (Lưới/Grid vs Bảng/Table) */}
              <Col xs={12} sm={6} lg={2} className="d-flex justify-content-lg-end gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  active={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: viewMode === 'grid' ? 'var(--primary-light)' : 'transparent',
                    color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)'
                  }}
                  title="Xem dạng Lưới (Thiết kế ảnh mẫu)"
                >
                  <Icon icon="lucide:grid" width="14" />
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  active={viewMode === 'table'}
                  onClick={() => setViewMode('table')}
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: viewMode === 'table' ? 'var(--primary-light)' : 'transparent',
                    color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-muted)'
                  }}
                  title="Xem dạng Bảng (Thiết kế chuẩn)"
                >
                  <Icon icon="lucide:list" width="14" />
                </Button>
                <Button
                  variant="link"
                  onClick={() => navigate('/authors/leaderboard')}
                  className="text-primary text-decoration-none text-xs fw-semibold p-0 ms-2 d-flex align-items-center gap-1-5"
                  style={{ fontSize: '0.8rem' }}
                >
                  <Icon icon="lucide:trophy" width="14" />
                  BXH →
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* 5. Nội dung chính: Chế độ Lưới hoặc chế độ Bảng */}
        <div className="mb-4">
          {viewMode === 'grid' ? (
            /* ── CHẾ ĐỘ XEM LƯỚI (Bố cục thẻ 2 cột khớp với Ảnh thiết kế 2) ───────── */
            loadingAuthors ? (
              <Row className="g-3">
                {Array.from({ length: limitVal }).map((_, idx) => (
                  <Col xs={12} md={6} key={idx}>
                    <Card className="p-4 border rounded-3 bg-white" style={{ minHeight: '200px' }}>
                      <div className="d-flex gap-3 mb-3">
                        <LoadingSkeleton width="48px" height="48px" borderRadius="50%" />
                        <div className="flex-grow-1">
                          <LoadingSkeleton width="60%" height="16px" className="mb-2" />
                          <LoadingSkeleton width="40%" height="12px" />
                        </div>
                      </div>
                      <LoadingSkeleton width="100%" height="32px" className="mb-3" />
                      <LoadingSkeleton width="30%" height="18px" />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : authors.length === 0 ? (
              <AuthorTable authors={[]} loading={false} error={errorAuthors} onRetry={() => fetchAuthors()} />
            ) : (
              <Row className="g-3">
                {authors.map((author) => (
                  <Col xs={12} md={6} key={author.author_id ?? author.id}>
                    <AuthorCard author={author} />
                  </Col>
                ))}
              </Row>
            )
          ) : (
            /* ── CHẾ ĐỘ XEM BẢNG (Bảng danh sách tác giả chuẩn) ─────────────────── */
            <AuthorTable
              authors={authors}
              loading={loadingAuthors}
              error={errorAuthors}
              onRetry={() => fetchAuthors()}
              startIndex={startIndex}
            />
          )}
        </div>

        {/* 6. Các nút điều khiển thanh phân trang */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination className="m-0">
              <Pagination.Prev 
                disabled={pageVal === 1}
                onClick={() => handlePageChange(pageVal - 1)}
              />
              {Array.from({ length: totalPages }).map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={pageVal === idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                  style={{
                    '--bs-pagination-active-bg': 'var(--primary)',
                    '--bs-pagination-active-border-color': 'var(--primary)',
                    '--bs-pagination-color': 'var(--text-muted)'
                  }}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                disabled={pageVal === totalPages}
                onClick={() => handlePageChange(pageVal + 1)}
              />
            </Pagination>
          </div>
        )}
      </Container>
    </div>
  );
}
