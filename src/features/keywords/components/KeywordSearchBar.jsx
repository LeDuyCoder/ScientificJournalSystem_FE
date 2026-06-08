import { useState, useEffect } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';

/**
 * Thanh tìm kiếm keyword với nút submit và reset.
 *
 * @param {Object} props
 * @param {string} props.value - Giá trị keyword hiện tại.
 * @param {Function} props.onSearch - Callback khi submit search.
 * @param {Function} props.onClear - Callback khi reset search.
 */
export default function KeywordSearchBar({ value = '', onSearch, onClear }) {
  const [input, setInput] = useState(value);

  // Sync local input when parent resets via onClear or external value change
  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(input.trim());
  };

  const handleClear = () => {
    setInput('');
    if (onClear) onClear();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroup.Text
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRight: 'none',
            color: 'var(--text-muted)',
          }}
        >
          <Icon icon="lucide:search" width="18" />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Tìm keyword..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderLeft: 'none',
            borderRight: 'none',
            color: 'var(--text-main)',
            fontSize: '0.95rem',
          }}
        />
        {input && (
          <Button
            variant="link"
            onClick={handleClear}
            style={{ color: 'var(--text-muted)', textDecoration: 'none', border: '1px solid var(--border)', borderLeft: 'none', borderRight: 'none', backgroundColor: 'var(--bg-card)' }}
          >
            <Icon icon="lucide:x" width="16" />
          </Button>
        )}
        <Button
          type="submit"
          style={{
            backgroundColor: '#111',
            color: '#fff',
            border: '1px solid #111',
            fontWeight: 600,
            fontSize: '0.9rem',
            padding: '0 20px',
          }}
        >
          Tìm kiếm
        </Button>
      </InputGroup>
    </Form>
  );
}
