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

import { useEffect, useRef, useState } from 'react';
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
 * Trang bộ điều khiển chính cho tuyến đường danh sách tác giả `/authors`.
 * 
 * @returns {JSX.Element} Giao diện trang danh sách tác giả.
 */
export default function AuthorListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // Đồng bộ trực tiếp với tham số truy vấn trên URL

  // Trích xuất các trạng thái và phương thức lấy dữ liệu tác giả từ useAuthors
  const {
    authors,
    totalAuthors,
    totalPages,
    subjectAreas,
    loadingAuthors,
    loadingSubjectAreas,
    errorAuthors,
    fetchAuthors,
    fetchSubjectAreas
  } = useAuthors();

  // Chuyển đổi chế độ xem cục bộ (mặc định là 'grid' khớp với ảnh thiết kế 2)
  const [viewMode, setViewMode] = useState('grid'); // Hiển thị kiểu 'grid' hoặc 'table'
  const [subjectAreaDropdownOpen, setSubjectAreaDropdownOpen] = useState(false);
  const subjectAreaMenuRef = useRef(null);

  // Trích xuất các tham số truy vấn URL với giá trị mặc định an toàn
  const searchVal = searchParams.get('search') || '';
  const pageVal = parseInt(searchParams.get('page') || '1', 10);
  const limitVal = parseInt(searchParams.get('limit') || '10', 10);
  const sortVal = searchParams.get('sort') || 'impact';
  const subjectAreaVal = searchParams.get('subject_area') || '';
  const countryVal = searchParams.get('country') || '';

  // Trạng thái đệm cục bộ cho ô nhập tìm kiếm (chỉ áp dụng khi Submit Form)
  const [searchInput, setSearchInput] = useState(searchVal);

  // ── SIDE EFFECT: ĐỒNG BỘ GỌI API FETCH ─────────────────────────────────────
  // Gọi lại API lấy danh sách tác giả mỗi khi bất kỳ tham số truy vấn URL nào thay đổi.
  useEffect(() => {
    // 1. Tạo object gom các tham số lại
    const params = {
      search: searchVal,
      page: pageVal,
      limit: limitVal,
      sort: sortVal,
      subject_area: subjectAreaVal,
      country: countryVal
    };

    // 2. Lọc bỏ các key có giá trị là chuỗi rỗng, null hoặc undefined
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '')
    );

    // 3. Truyền object đã lọc vào API
    fetchAuthors(filteredParams);
    
  }, [searchVal, pageVal, limitVal, sortVal, subjectAreaVal, countryVal, fetchAuthors]);

  useEffect(() => {
    if (!subjectAreas || subjectAreas.length === 0) {
      fetchSubjectAreas();
    }
  }, [subjectAreas, fetchSubjectAreas]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (subjectAreaMenuRef.current && !subjectAreaMenuRef.current.contains(event.target)) {
        setSubjectAreaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  /**
   * Đẩy giá trị nhập tìm kiếm cục bộ vào các tham số URL. Đặt lại trang hiện tại về 1.
   * 
   * @param {React.FormEvent} [e] - Sự kiện submit form.
   * @returns {void}
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
   * Đẩy các thay đổi của hộp chọn bộ lọc vào tham số URL. Đặt lại trang hiện tại về 1.
   * 
   * @param {string} key - Khóa tham số URL cần cập nhật.
   * @param {string} value - Giá trị mới cần thiết lập.
   * @returns {void}
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
   * Cập nhật tham số trang trong URL khi nhấp vào nút phân trang.
   * 
   * @param {number} newPage - Chỉ số trang mới được chọn.
   * @returns {void}
   */
  const handlePageChange = (newPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    setSearchParams(nextParams);
  };

  const totalPagesCount = Math.max(1, totalPages);
  const startIndex = (pageVal - 1) * limitVal + 1;

  const formatLocalNumber = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return '0';
    }
    return Number(value).toLocaleString('vi-VN');
  };

  const visibleAuthorsCount = authors.length;
  const featuredAuthorsCount = authors.filter((author) => Number(author.h_index ?? author.hindex ?? 0) >= 30).length;
  const totalWorksCount = authors.reduce((sum, author) => sum + (Number(author.works_count ?? author.article_count ?? 0) || 0), 0);
  const totalCitationCount = authors.reduce((sum, author) => sum + (Number(author.cited_by_count ?? author.citation_count ?? 0) || 0), 0);

  const renderPagination = () => {
    if (totalPagesCount <= 1) return null;

    const items = [];
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={pageVal === 1}
        onClick={() => handlePageChange(pageVal - 1)}
        className="mx-0.5"
      />
    );

    const maxButtons = 7;
    let startPage = Math.max(1, pageVal - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPagesCount, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} active={1 === pageVal} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );

      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      }
    }

    for (let p = startPage; p <= endPage; p += 1) {
      items.push(
        <Pagination.Item
          key={p}
          active={p === pageVal}
          onClick={() => handlePageChange(p)}
        >
          {p}
        </Pagination.Item>
      );
    }

    if (endPage < totalPagesCount) {
      if (endPage < totalPagesCount - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      }
      items.push(
        <Pagination.Item key={totalPagesCount} active={totalPagesCount === pageVal} onClick={() => handlePageChange(totalPagesCount)}>
          {totalPagesCount}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        disabled={pageVal === totalPagesCount}
        onClick={() => handlePageChange(pageVal + 1)}
        className="mx-0.5"
      />
    );

    return (
      <Pagination
        className="justify-content-center m-0 custom-pagination"
        style={{
          '--bs-pagination-bg': 'var(--bg-card)',
          '--bs-pagination-border-color': 'var(--border)',
          '--bs-pagination-color': 'var(--text-muted)',
          '--bs-pagination-hover-color': 'var(--primary)',
          '--bs-pagination-hover-bg': 'var(--bg-main)',
          '--bs-pagination-hover-border-color': 'var(--border)',
          '--bs-pagination-active-bg': 'var(--primary)',
          '--bs-pagination-active-border-color': 'var(--primary)',
          '--bs-pagination-active-color': '#ffffff',
          '--bs-pagination-disabled-bg': 'var(--bg-main)',
          '--bs-pagination-disabled-color': 'var(--text-muted)',
          '--bs-pagination-disabled-border-color': 'var(--border)'
        }}
      >
        {items}
      </Pagination>
    );
  };

  // Dữ liệu hiển thị trên các thẻ thống kê sẽ sử dụng kết quả API nếu có
  const statCards = [
    {
      label: 'Tổng tác giả',
      value: formatLocalNumber(totalAuthors),
      icon: 'lucide:users',
      desc: 'Tổng tác giả trong hệ thống',
    },
    {
      label: 'Tác giả nổi bật',
      value: formatLocalNumber(featuredAuthorsCount || visibleAuthorsCount),
      icon: 'lucide:award',
      desc: visibleAuthorsCount > 0
        ? `Trong ${formatLocalNumber(visibleAuthorsCount)} tác giả đang hiển thị`
        : 'H-index vượt trội (>=30)'
    },
    {
      label: 'Tổng bài báo',
      value: formatLocalNumber(totalWorksCount),
      icon: 'lucide:file-text',
      desc: 'Tổng bài báo trên trang hiện tại'
    },
    {
      label: 'Tổng citations',
      value: formatLocalNumber(totalCitationCount),
      icon: 'lucide:quote',
      desc: 'Tổng citations trên trang hiện tại'
    }
  ];

  return (
    <div
      className="w-100"
      style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', paddingTop: '80px' }}
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
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--text-muted  )', fontWeight: 600 }}>
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
                  <Icon icon={stat.icon} width="16" style={{ color: 'var(--primary)' }} />
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
                <Form.Group className="position-relative" ref={subjectAreaMenuRef}>
                  <InputGroup
                    className="rounded-3 border overflow-hidden bg-transparent"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Form.Control
                      id="subjectAreaInput"
                      size="sm"
                      type="text"
                      placeholder="Nhập hoặc chọn lĩnh vực"
                      value={subjectAreaVal}
                      onChange={e => {
                        handleFilterChange('subject_area', e.target.value);
                        setSubjectAreaDropdownOpen(true);
                      }}
                      onFocus={() => setSubjectAreaDropdownOpen(true)}
                      className="text-muted-custom text-sm"
                      style={{
                        border: 'none',
                        boxShadow: 'none',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.82rem',
                        backgroundColor: 'transparent'
                      }}
                    />
                    <InputGroup.Text
                      className="bg-white border-0 px-3"
                      style={{
                        borderLeft: '1px solid var(--border)',
                        backgroundColor: 'var(--bg-card)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSubjectAreaDropdownOpen((prev) => !prev)}
                    >
                      <Icon icon="lucide:chevron-down" width="16" />
                    </InputGroup.Text>
                  </InputGroup>

                  {subjectAreaDropdownOpen && subjectAreas && subjectAreas.length > 0 && (
                    <div
                      className="position-absolute w-100 border rounded-3 overflow-hidden"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border)',
                        top: 'calc(100% + 0.35rem)',
                        zIndex: 1050,
                        maxHeight: '240px',
                        overflowY: 'auto'
                      }}
                    >
                      <button
                        type="button"
                        className="w-100 text-start px-3 py-2 border-0 bg-transparent text-muted-custom"
                        style={{ fontSize: '0.82rem' }}
                        onClick={() => {
                          handleFilterChange('subject_area', '');
                          setSubjectAreaDropdownOpen(false);
                        }}
                      >
                        Tất cả lĩnh vực
                      </button>
                      {subjectAreas.map((area) => (
                        <button
                          key={area.subject_area_id || area.id || area.display_name}
                          type="button"
                          className="w-100 text-start px-3 py-2 border-0 bg-transparent hover-bg-light"
                          style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}
                          onClick={() => {
                            handleFilterChange('subject_area', area.display_name || area.name || '');
                            setSubjectAreaDropdownOpen(false);
                          }}
                        >
                          {area.display_name || area.name || ''}
                        </button>
                      ))}
                    </div>
                  )}
                </Form.Group>
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
        {renderPagination()}
      </Container>
    </div>
  );
}
