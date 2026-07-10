import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Icon from '../../../../shared/components/Icon';
import PrimaryButton from '../../../../shared/components/Button/PrimaryButton';
import { SYSTEM_ROLES } from '../../../../shared/constants/systemConstants';
const getUserInitial = (name = '', email = '') => {
  const source = String(name || email || 'U').trim();
  return source.charAt(0).toUpperCase() || 'U';
};

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
  const { t: _t } = useTranslation();
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
    }
  }, [isEdit, initialData]);

  /**
   * Handle form submit with client-side validation.
   */
  const handleSubmit = e => {
    e.preventDefault();
    setError('');

    // Common validations
    if (!email.trim() || !role) {
      setError(t("admin.vuiLongDienDayDuCacTruongThong"));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("admin.diaChiEmailKhongHopLe"));
      return;
    }

    // Name validations
    if (isEdit) {
      if (!fullName.trim()) {
        setError(t("admin.hoVaTenLaBatBuoc"));
        return;
      }
    } else {
      if (!firstName.trim() || !lastName.trim()) {
        setError(t("admin.hoVaTenLaBatBuoc1"));
        return;
      }
    }

    // Password validation (only if added or if new password was keyed during edit)
    if (!isEdit || newPassword || confirmPassword) {
      if (!isEdit && !newPassword) {
        setError(t("admin.matKhauLaBatBuoc"));
        return;
      }
      if (newPassword.length < 8) {
        setError(t("admin.matKhauPhaiChuaItNhat8KyTu"));
        return;
      }
      if (newPassword !== confirmPassword) {
        setError(t("admin.matKhauXacNhanKhongKhop"));
        return;
      }
    }

    // Construct request payload
    const payload = {
      email: email.trim(),
      phone: phone.trim(),
      institution: institution.trim(),
      role,
      status
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
  const displayName = isEdit ? fullName : `${firstName} ${lastName}`.trim();
  const avatarInitial = getUserInitial(displayName, email);
  return <Form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
      {error && <div className="alert alert-danger py-2.5 px-3.5 small border-0 rounded-3">
          {error}
        </div>}

      {/* Profile identity section */}
      {isEdit && <div className="d-flex align-items-center gap-4 py-3 border-bottom">
          <div className="rounded-4 d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0" style={{
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
        fontSize: '2rem',
        boxShadow: '0 12px 24px rgba(234, 88, 12, 0.18)'
      }} aria-label={`Avatar chữ cái đầu của ${displayName || email || t("admin.nguoiDung")}`}>
            {avatarInitial}
          </div>
          <div>
            <div className="fw-bold text-main mb-1" style={{
          fontSize: '1rem'
        }}>{fullName || t("admin.chuaCoTenNguoiDung")}</div>
            <div className="text-muted-custom small mb-0">{t("admin.hienThiAvatarBangChuCaiDauCuaN")}</div>
          </div>
        </div>}

      {/* Section 1: Personal Information */}
      <div>
        <h6 className="fw-bold d-flex align-items-center gap-2 mb-3.5 tracking-wider text-uppercase" style={{
        fontSize: '0.85rem',
        color: '#ea580c',
        letterSpacing: '0.03em'
      }}>
          <Icon icon="lucide:user" width="16" style={{
          color: '#ea580c'
        }} />{t("admin.thongTinCaNhan")}</h6>
        
        <Row className="g-3">
          {isEdit ?
        // Full Name input for edit screen
        <Col xs={12} md={6}>
              <Form.Group controlId="fullName">
                <Form.Label className="account-form-label">{t("admin.hoVaTen")}<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control type="text" placeholder={t("admin.viDuNguyenVanA")} value={fullName} onChange={e => setFullName(e.target.value)} required className="account-form-input" />
              </Form.Group>
            </Col> :
        // First/Last Name inputs for add screen (mockup 50% each)
        <>
              <Col xs={12} md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label className="account-form-label">{t("admin.ho")}<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control type="text" placeholder={t("admin.viDuNguyen")} value={firstName} onChange={e => setFirstName(e.target.value)} required className="account-form-input" />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label className="account-form-label">{t("admin.ten")}<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control type="text" placeholder={t("admin.viDuVanA")} value={lastName} onChange={e => setLastName(e.target.value)} required className="account-form-input" />
                </Form.Group>
              </Col>
            </>}

          {/* Email field */}
          <Col xs={12} md={6}>
            <Form.Group controlId="emailAddress">
              <Form.Label className="account-form-label">{t("admin.diaChiEmail")}<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control type="email" placeholder={t("admin.nameuniversityeduvn")} value={email} onChange={e => setEmail(e.target.value)} required className="account-form-input" />
            </Form.Group>
          </Col>

          {/* Phone field */}
          <Col xs={12} md={6}>
            <Form.Group controlId="phoneNumber">
              <Form.Label className="account-form-label">{t("admin.soDienThoai")}</Form.Label>
              <Form.Control type="text" placeholder={t("admin.0901234567")} value={phone} onChange={e => setPhone(e.target.value)} className="account-form-input" />
            </Form.Group>
          </Col>

          {/* Institution field (Only visible on Edit Profile) */}
          {isEdit && <Col xs={12} md={6}>
              <Form.Group controlId="institution">
                <Form.Label className="account-form-label">{t("admin.donViTruongDaiHoc")}</Form.Label>
                <Form.Control type="text" placeholder={t("admin.oxfordUniversityPress")} value={institution} onChange={e => setInstitution(e.target.value)} className="account-form-input" />
              </Form.Group>
            </Col>}
        </Row>
      </div>

      {/* Section 2: Role & Status */}
      <div className="py-3 border-top">
        <h6 className="fw-bold d-flex align-items-center gap-2 mb-3.5 tracking-wider text-uppercase" style={{
        fontSize: '0.85rem',
        color: '#ea580c',
        letterSpacing: '0.03em'
      }}>
          <Icon icon="lucide:shield" width="16" style={{
          color: '#ea580c'
        }} />{t("admin.vaiTroTrangThai")}</h6>

        <Row className="g-3 align-items-center">
          {/* Role select */}
          <Col xs={12} md={6}>
            <Form.Group controlId="platformRole">
              <Form.Label className="account-form-label">{t("admin.vaiTroTrenNenTang")}<span className="text-danger">*</span>
              </Form.Label>
              <Form.Select value={role} onChange={e => setRole(e.target.value)} className="account-form-input" style={{
              cursor: 'pointer'
            }} required>
                <option value="" disabled hidden>{t("admin.chonVaiTro")}</option>
                {SYSTEM_ROLES.map(r => <option key={r.value} value={r.value}>
                    {r.label}
                  </option>)}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Status switch toggle container - mockup high fidelity styling */}
          <Col xs={12} md={6}>
            <div className="d-flex align-items-center justify-content-between px-3 rounded-3" style={{
            height: '46px',
            backgroundColor: '#f1f5f9',
            marginTop: '28px' // Align vertical alignment with label spacing
          }}>
              <span className="small fw-semibold text-muted-custom" style={{
              fontSize: '0.85rem'
            }}>{t("admin.trangThaiTaiKhoan")}</span>
              <div className="d-flex align-items-center gap-2.5 orange-switch-toggle">
                <Form.Check type="switch" id="status-toggle" checked={status === 'Active'} onChange={e => setStatus(e.target.checked ? 'Active' : 'Inactive')} />
                <span className="small fw-bold text-main" style={{
                fontSize: '0.85rem'
              }}>{status === 'Active' ? t("admin.hoatDong") : t("admin.voHieuHoa")}</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Section 3: Identity & Password */}
      <div className="py-3 border-top">
        <h6 className="fw-bold d-flex align-items-center gap-2 mb-3.5 tracking-wider text-uppercase" style={{
        fontSize: '0.85rem',
        color: '#ea580c',
        letterSpacing: '0.03em'
      }}>
          <Icon icon="lucide:lock" width="16" style={{
          color: '#ea580c'
        }} />{t("admin.thongTinDangNhap")}</h6>
        
        <Row className="g-3">
          {/* Current Password - Only required for updating existing profile */}
          {isEdit && <Col xs={12} md={4}>
              <Form.Group controlId="currentPassword">
                <Form.Label className="account-form-label">{t("admin.matKhauHienTai")}</Form.Label>
                <Form.Control type="password" placeholder={t("admin.key")} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="account-form-input" />
              </Form.Group>
            </Col>}

          {/* New Password field */}
          <Col xs={12} md={isEdit ? 4 : 6}>
            <Form.Group controlId="newPassword">
              <Form.Label className="account-form-label">
                {isEdit ? t("admin.matKhauMoi") : t("admin.matKhauMoi1")}
              </Form.Label>
              <Form.Control type="password" placeholder={t("admin.key1")} value={newPassword} onChange={e => setNewPassword(e.target.value)} required={!isEdit} className="account-form-input" />
            </Form.Group>
          </Col>

          {/* Confirm password field */}
          <Col xs={12} md={isEdit ? 4 : 6}>
            <Form.Group controlId="confirmPassword">
              <Form.Label className="account-form-label">
                {isEdit ? t("admin.xacNhanMatKhau") : t("admin.xacNhanMatKhau1")}
              </Form.Label>
              <Form.Control type="password" placeholder={t("admin.key1")} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required={!isEdit} className="account-form-input" />
            </Form.Group>
          </Col>
        </Row>

        {/* Password complexity helper note */}
        <div className="form-text text-muted-custom mt-2.5 small" style={{
        fontSize: '0.78rem'
      }}>{t("admin.matKhauPhaiChuaItNhat8KyTuBaoG")}</div>
      </div>

      {/* Form Action buttons */}
      <div className="d-flex justify-content-end gap-3 pt-3.5 border-top">
        <PrimaryButton type="button" variant="outline" onClick={onCancel} className="px-4 py-2" style={{
        fontSize: '0.88rem'
      }}>{t("admin.huy")}</PrimaryButton>
        
        <PrimaryButton type="submit" className="px-4 py-2" style={{
        fontSize: '0.88rem'
      }} disabled={submitting}>
          {submitting ? <>
              <Icon icon="lucide:loader-2" width="16" />
              <span>{t("admin.dangXuLy")}</span>
            </> : isEdit ? <>
              <Icon icon="lucide:save" width="16" />
              <span>{t("admin.luuThayDoi")}</span>
            </> : <>
              <Icon icon="lucide:user-plus" width="16" />
              <span>{t("admin.themTaiKhoan")}</span>
            </>}
        </PrimaryButton>
      </div>
    </Form>;
}