/**
 * - show:    controls modal visibility (state in parent page).
 * - onClose: close handler (close button or click outside).
 * - items:   activity list (mockAllActivity).
 */
import { Modal } from 'react-bootstrap';
import Icon from '../../../shared/components/Icon';
import { ACTIVITY_DOT_COLOR } from '../constants/activityType';

export default function AllActivityModal({ show, onClose, items }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      scrollable
      backdrop
      backdropClassName="admin-activity-modal-backdrop"
      dialogClassName="admin-activity-modal"
      contentClassName="admin-activity-modal__content"
    >
      <Modal.Header className="admin-activity-modal__header">
        <Modal.Title className="admin-card__title">Recent Activity</Modal.Title>

        <button
          type="button"
          className="admin-activity-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <Icon icon="lucide:x" />
        </button>
      </Modal.Header>

      <Modal.Body className="admin-activity-modal__body">
        <ul className="admin-activity-list">
          {items.map((item) => {
            const dotColor =
              ACTIVITY_DOT_COLOR[item.type] || ACTIVITY_DOT_COLOR.reviewer;

            return (
              <li key={item.id} className="admin-activity-item">
                <span
                  className="admin-activity-item__dot"
                  style={{ backgroundColor: dotColor }}
                />

                <div className="admin-activity-item__content">
                  <p className="admin-activity-item__title">{item.title}</p>
                  <p className="admin-activity-item__description">
                    {item.description}
                  </p>
                  <span className="admin-activity-item__time">{item.time}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </Modal.Body>
    </Modal>
  );
}