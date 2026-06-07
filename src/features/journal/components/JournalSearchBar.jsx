import React from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { Icon } from '@iconify/react';

export default function JournalSearchBar({
  searchInput,
  setSearchInput,
  quartile,
  setQuartile,
  isOpenAccess,
  setIsOpenAccess,
  onSubmit,
  onClear
}) {
  return (
    <Form onSubmit={onSubmit} className="mb-4">
      <Row className="g-3 align-items-center">
        {/* Search Input Box */}
        <Col lg={6} md={12}>
          <InputGroup 
            style={{ 
              borderRadius: '10px', 
              overflow: 'hidden', 
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-card)' 
            }}
          >
            <InputGroup.Text className="bg-transparent border-0 text-muted-custom">
              <Icon icon="lucide:search" width="18" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Tìm journal..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border-0 bg-transparent text-main py-2.5 shadow-none"
              style={{ fontSize: '0.9rem' }}
            />
            {searchInput && (
              <Button 
                variant="link" 
                className="text-muted-custom hover:text-main p-2"
                onClick={() => setSearchInput('')}
              >
                <Icon icon="lucide:x" width="16" />
              </Button>
            )}
            <Button 
              type="submit" 
              className="btn-dark-solid px-4 font-semibold text-xs border-0"
              style={{ backgroundColor: 'var(--btn-dark)', color: '#FFFFFF' }}
            >
              Tìm kiếm
            </Button>
          </InputGroup>
        </Col>

        {/* Quartile Dropdown */}
        <Col lg={2.5} md={4} sm={6} xs={12}>
          <Form.Select
            value={quartile}
            onChange={(e) => setQuartile(e.target.value)}
            className="text-main shadow-none py-2.5"
            style={{ 
              borderRadius: '10px', 
              border: '1px solid var(--border)', 
              backgroundColor: 'var(--bg-card)',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">Tất cả quartile</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </Form.Select>
        </Col>

        {/* Access Dropdown */}
        <Col lg={2.5} md={4} sm={6} xs={12}>
          <Form.Select
            value={isOpenAccess}
            onChange={(e) => setIsOpenAccess(e.target.value)}
            className="text-main shadow-none py-2.5"
            style={{ 
              borderRadius: '10px', 
              border: '1px solid var(--border)', 
              backgroundColor: 'var(--bg-card)',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">Tất cả truy cập</option>
            <option value="oa">Open Access (OA)</option>
            <option value="subscription">Subscription</option>
          </Form.Select>
        </Col>

        {/* Clear Button */}
        <Col lg={1} md={4} sm={12} xs={12} className="text-md-end text-center">
          <Button
            variant="link"
            className="text-muted-custom hover:text-danger text-decoration-none font-semibold text-xs py-2"
            onClick={onClear}
            style={{ minWidth: '80px' }}
          >
            <Icon icon="lucide:refresh-cw" className="me-1" />
            Reset
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
