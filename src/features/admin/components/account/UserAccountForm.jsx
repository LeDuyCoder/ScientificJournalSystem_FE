import { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Icon from '../../../../shared/components/Icon';
import { SYSTEM_ROLES } from '../../../../shared/constants/systemConstants';

/**
 * UserAccountForm Component
 * Unified form for adding new user accounts or updating profile details.
 * Styled in high-fidelity to match the mockup.
 */
export default function UserAccountForm({
  initialData = {},
  isEdit = false,
  onSubmit,
  onCancel,
  submitting = false
}) {
  // Form fields states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState(isEdit ? 'RESEARCHER' : '');
  const [status, setStatus] = useState('Active'); // Active, Inactive
  
  // Passwords states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Validation / status feedback
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(initialData.avatar || '');

  // Load initialData if editing
  useEffect(() => {
    if (isEdit && initialData) {
      setFirstName(initialData.first_name || '');
      setLastName(initialData.last_name || '');
      setFullName(initialData.name || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setInstitution(initialData.institution || '');
      setRole(initialData.role || 'RESEARCHER');
      setStatus(initialData.status || 'Active');
      if (initialData.avatar) {
        setProfileImage(initialData.avatar);
      }
    }
  }, [isEdit, initialData]);

  /**
   * Handle form submit with clientside validation.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Common validations
    if (!email.trim() || !role) {
      setError('Vui lÃ²ng Ä‘iá»n Ä‘áº§y Ä‘á»§ cÃ¡c trÆ°á»ng thÃ´ng tin báº¯t buá»™c.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Äá»‹a chá»‰ email khÃ´ng há»£p lá»‡.');
      return;
    }

    // Name validations
    if (isEdit) {
      if (!fullName.trim()) {
        setError('Há» vÃ  tÃªn lÃ  báº¯t buá»™c.');
        return;
      }
    } else {
      if (!firstName.trim() || !lastName.trim()) {
        setError('Há» vÃ  TÃªn lÃ  báº¯t buá»™c.');
        return;
      }
    }

    // Password validation (only if added or if new password was keyed during edit)
    if (!isEdit || newPassword || confirmPassword) {
      if (!isEdit && !newPassword) {
        setError('Máº­t kháº©u lÃ  báº¯t buá»™c.');
        return;
      }

      if (newPassword.length < 8) {
        setError('Máº­t kháº©u pháº£i chá»©a Ã­t nháº¥t 8 kÃ½ tá»±.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Máº­t kháº©u xÃ¡c nháº­n khÃ´ng khá»›p.');
        return;
      }
    }

    // Construct request payload
    const payload = {
      email: email.trim(),
      phone: phone.trim(),
      institution: institution.trim(),
      role,
      status,
      avatar: profileImage
    };

    if (isEdit) {
      const names = fullName.trim().split(' ');
      payload.first_name = names[0] || '';
      payload.last_name = names.slice(1).join(' ') || '';
      payload.name = fullName.trim();
      if (newPassword) {
        payload.password = newPassword;
      }
    } else {
      payload.first_name = firstName.trim();
      payload.last_name = lastName.trim();
      payload.name = `${firstName.trim()} ${lastName.trim()}`;
      payload.password = newPassword;
    }

    // Bubble up to parent
    onSubmit(payload);
  };

  const handlePhotoUpload = () => {
    setError('Chưa có API upload ảnh đại diện user. Đã xóa dữ liệu mock khỏi khu vực này.');
  };

  const handlePhotoRemove = () => {
    setProfileImage('');
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
      {error && (
        <div className="alert alert-danger py-2.5 px-3.5 small border-0 rounded-3">
          {error}
        </div>
      )}

      {/* Profile Image upload section - Page 13 specific */}
      {isEdit && (
        <div className="d-flex align-items-center gap-4 py-3 border-bottom">
          <div 
            className="rounded-4 overflow-hidden position-relative"
            style={{ width: '80px', height: '80px', backgroundColor: 'var(--bg-section)' }}
          >
            <img 
              src={profileImage} 
              alt="Profile avatar" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <div className="fw-bold text-main mb-1" style={{ fontSize: '1rem' }}>{fullName || 'Chưa có tên người dùng'}</div>
            <div className="text-muted-custom small mb-2">Chưa có API ngày tham gia user. Đã xóa dữ liệu mock khỏi khu vực này.</div>
            <div className="d-flex gap-2.5">
              <Button 
                type="button" 
                variant="outline-secondary" 
                size="sm" 
                onClick={handlePhotoUpload}
                className="px-3 border"
                style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}
              >
                Change Photo
              </Button>
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                onClick={handlePhotoRemove}
                className="text-decoration-none text-danger p-0 fw-semibold"
                style={{ fontSize: '0.8rem' }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Personal Information */}
      <div>
        <h6 className="fw-bold d-flex align-items-center gap-2 mb-3.5 tracking-wider text-uppercase" style={{ fontSize: '0.85rem', color: '#ea580c', letterSpacing: '0.03em' }}>
          <Icon icon="lucide:user" width="16" style={{ color: '#ea580c' }} />
          THÃ”NG TIN CÃ NHÃ‚N
        </h6>
        
        <Row className="g-3">
          {isEdit ? (
            // Full Name input for edit screen
            <Col xs={12} md={6}>
              <Form.Group controlId="fullName">
                <Form.Label className="account-form-label">
                  Há» vÃ  tÃªn <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="VÃ­ dá»¥: Nguyá»…n VÄƒn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="account-form-input"
                />
              </Form.Group>
            </Col>
          ) : (
            // First/Last Name inputs for add screen (mockup 50% each)
            <>
              <Col xs={12} md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label className="account-form-label">
                    Há» <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="VÃ­ dá»¥: Nguyá»…n"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="account-form-input"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label className="account-form-label">
                    TÃªn <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="VÃ­ dá»¥: VÄƒn A"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="account-form-input"
                  />
                </Form.Group>
              </Col>
            </>
          )}

          {/* Email field */}
          <Col xs={12} md={6}>
            <Form.Group controlId="emailAddress">
              <Form.Label className="account-form-label">
                Äá»‹a chá»‰ Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="name@university.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="account-form-input"
              />
            </Form.Group>
          </Col>

          {/* Phone field */}
          <Col xs={12} md={6}>
            <Form.Group controlId="phoneNumber">
              <Form.Label className="account-form-label">
                Sá»‘ Ä‘iá»‡n thoáº¡i
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="090 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="account-form-input"
              />
            </Form.Group>
          </Col>

          {/* Institution field (Only visible on Edit Profile) */}
          {isEdit && (
            <Col xs={12} md={6}>
              <Form.Group controlId="institution">
                <Form.Label className="account-form-label">
                  ÄÆ¡n vá»‹ / TrÆ°á»ng Ä‘áº¡i há»c
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Oxford University Press"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="account-form-input"
                />
              </Form.Group>
            </Col>
          )}
        </Row>
      </div>

      {/* Section 2: Role & Status */}
      <div className="py-3 border-top">
        <h6 className="fw-bold d-flex align-items-center gap-2 mb-3.5 tracking-wider text-uppercase" style={{ fontSize: '0.85rem', color: '#ea580c', letterSpacing: '0.03em' }}>
          <Icon icon="lucide:shield" width="16" style={{ color: '#ea580c' }} />
          VAI TRÃ’ & TRáº NG THÃI
        </h6>

        <Row className="g-3 align-items-center">
          {/* Role select */}
          <Col xs={12} md={6}>
            <Form.Group controlId="platformRole">
              <Form.Label className="account-form-label">
                Vai trÃ² trÃªn ná»n táº£ng <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="account-form-input"
                style={{ cursor: 'pointer' }}
                required
              >
                <option value="" disabled hidden>Chá»n vai trÃ²...</option>
                {SYSTEM_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Status switch toggle container - mockup high fidelity styling */}
          <Col xs={12} md={6}>
            <div 
              className="d-flex align-items-center justify-content-between px-3 rounded-3" 
              style={{ 
                height: '46px', 
                backgroundColor: '#f1f5f9',
                marginTop: '28px' // Align vertical alignment with label spacing
              }}
            >
              <span className="small fw-semibold text-muted-custom" style={{ fontSize: '0.85rem' }}>Tráº¡ng thÃ¡i tÃ i khoáº£n</span>
              <div className="d-flex align-items-center gap-2.5 orange-switch-toggle">
                <Form.Check 
                  type="switch"
                  id="status-toggle"
                  checked={status === 'Active'}
                  onChange={(e) => setStatus(e.target.checked ? 'Active' : 'Inactive')}
                />
                <span className="small fw-bold text-main" style={{ fontSize: '0.85rem' }}>{status === 'Active' ? 'Hoáº¡t Ä‘á»™ng' : 'VÃ´ hiá»‡u hÃ³a'}</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Section 3: Identity & Password */}
      <div className="py-3 border-top">
        <h6 className="fw-bold d-flex align-items-center gap-2 mb-3.5 tracking-wider text-uppercase" style={{ fontSize: '0.85rem', color: '#ea580c', letterSpacing: '0.03em' }}>
          <Icon icon="lucide:lock" width="16" style={{ color: '#ea580c' }} />
          THÃ”NG TIN ÄÄ‚NG NHáº¬P
        </h6>
        
        <Row className="g-3">
          {/* Current Password - Only required for updating existing profile */}
          {isEdit && (
            <Col xs={12} md={4}>
              <Form.Group controlId="currentPassword">
                <Form.Label className="account-form-label">
                  Máº­t kháº©u hiá»‡n táº¡i
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="account-form-input"
                />
              </Form.Group>
            </Col>
          )}

          {/* New Password field */}
          <Col xs={12} md={isEdit ? 4 : 6}>
            <Form.Group controlId="newPassword">
              <Form.Label className="account-form-label">
                {isEdit ? 'Máº­t kháº©u má»›i' : 'Máº­t kháº©u má»›i *'}
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="........"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required={!isEdit}
                className="account-form-input"
              />
            </Form.Group>
          </Col>

          {/* Confirm password field */}
          <Col xs={12} md={isEdit ? 4 : 6}>
            <Form.Group controlId="confirmPassword">
              <Form.Label className="account-form-label">
                {isEdit ? 'XÃ¡c nháº­n máº­t kháº©u' : 'XÃ¡c nháº­n máº­t kháº©u *'}
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="........"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isEdit}
                className="account-form-input"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Password complexity helper note */}
        <div className="form-text text-muted-custom mt-2.5 small" style={{ fontSize: '0.78rem' }}>
          Máº­t kháº©u pháº£i chá»©a Ã­t nháº¥t 8 kÃ½ tá»±, bao gá»“m cáº£ chá»¯ hoa, chá»¯ thÆ°á»ng vÃ  chá»¯ sá»‘.
        </div>
      </div>

      {/* Form Action buttons */}
      <div className="d-flex justify-content-end gap-3 pt-3.5 border-top">
        <Button 
          type="button" 
          onClick={onCancel}
          className="bg-transparent border rounded-pill px-4 py-2 text-muted-custom fw-semibold"
          style={{ borderColor: '#cbd5e1', color: '#64748b', fontSize: '0.88rem' }}
        >
          Há»§y
        </Button>
        
        <Button 
          type="submit" 
          className="btn-primary-glow border-0 rounded-pill px-4 py-2 d-flex align-items-center gap-2"
          style={{ fontSize: '0.88rem' }}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Icon icon="lucide:loader-2" width="16" />
              <span>Äang xá»­ lÃ½...</span>
            </>
          ) : isEdit ? (
            <>
              <Icon icon="lucide:save" width="16" />
              <span>LÆ°u thay Ä‘á»•i</span>
            </>
          ) : (
            <>
              <Icon icon="lucide:user-plus" width="16" />
              <span>ThÃªm tÃ i khoáº£n</span>
            </>
          )}
        </Button>
      </div>
    </Form>
  );
}
