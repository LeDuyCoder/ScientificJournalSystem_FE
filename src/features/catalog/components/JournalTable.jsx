import { Table, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function JournalTable({ journals = [], followedJournals = {}, onFollow }) {
  const navigate = useNavigate();

  const renderAccessBadge = (journal) => (
    <span
      className="px-2 py-1 fw-medium"
      style={{
        fontSize: '0.78rem',
        color: 'var(--text-main, #111)',
      }}
    >
      {journal.is_open_access ? '🔓 Open Access' : 'Subscription'}
    </span>
  );

  return (
    <div
      className="journal-dark-card overflow-hidden"
      style={{
        borderRadius: '20px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)'
      }}
    >
      <div className="table-responsive">
        <Table hover className="align-middle mb-0 text-start">
          <thead>
            <tr>
              <th className="px-4 py-3 text-muted-custom text-uppercase" style={{ fontSize: '0.72rem' }}>Journal</th>
              <th className="px-3 py-3 text-muted-custom text-uppercase" style={{ fontSize: '0.72rem' }}>ISSN</th>
              <th className="px-3 py-3 text-muted-custom text-uppercase" style={{ fontSize: '0.72rem' }}>Publisher</th>
              <th className="px-3 py-3 text-muted-custom text-uppercase" style={{ fontSize: '0.72rem' }}>Country</th>
              <th className="px-3 py-3 text-muted-custom text-uppercase" style={{ fontSize: '0.72rem' }}>Quartile</th>
              <th className="px-3 py-3 text-muted-custom text-uppercase" style={{ fontSize: '0.72rem' }}>Metric</th>
              <th className="px-3 py-3 text-muted-custom text-uppercase" style={{ fontSize: '0.72rem' }}>Year</th>
              <th className="px-3 py-3 text-muted-custom text-uppercase" style={{ fontSize: '0.72rem' }}>Access</th>
              <th className="px-4 py-3 text-muted-custom text-uppercase text-end" style={{ fontSize: '0.72rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {journals.map((journal) => {
              const id = journal.id || journal.journal_id;
              const isFollowed = !!followedJournals[id];

              return (
                <tr key={id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/journals/${id}`)}>
                  <td className="px-4 py-3">
                    <div className="fw-semibold text-main">{journal.display_name}</div>
                  </td>
                  <td className="px-3 py-3 text-muted-custom font-monospace">{journal.issn || '—'}</td>
                  <td className="px-3 py-3 text-main">{journal.publisher || '—'}</td>
                  <td className="px-3 py-3 text-main">{journal.country || '—'}</td>
                  <td className="px-3 py-3">
                    {journal.quartile ? (
                      <Badge className="px-2 py-1 fw-semibold" style={{
                        borderRadius: '6px',
                        backgroundColor: 'rgba(0,0,0,0.07)',
                        color: 'var(--text-main, #111)',
                        border: '1px solid rgba(0,0,0,0.10)',
                        fontSize: '0.73rem'
                      }}>
                        {journal.quartile}
                      </Badge>
                    ) : '—'}
                  </td>
                  <td className="px-3 py-3 fw-bold" style={{ color: 'var(--text-main, #111)', fontVariantNumeric: 'tabular-nums' }}>{journal.metric_value ?? '—'}</td>
                  <td className="px-3 py-3 text-main">{journal.metric_year || '—'}</td>
                  <td className="px-3 py-3">{renderAccessBadge(journal)}</td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-inline-flex align-items-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onFollow(id);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 14px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            backgroundColor: 'transparent',
                            color: isFollowed ? '#555' : '#111',
                            border: isFollowed ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(0,0,0,0.15)',
                          }}
                        >
                          <Icon icon={isFollowed ? 'lucide:check' : 'lucide:plus'} width="13" />
                          <span>{isFollowed ? 'Đã theo dõi' : 'Theo dõi'}</span>
                        </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
