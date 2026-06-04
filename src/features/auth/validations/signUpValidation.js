// Validation nhận thêm tham số t (hàm dịch) từ hook useTranslation
// Để message lỗi cũng thay đổi theo ngôn ngữ

export const validateFirstName = (value, t) => {
  if (!value.trim()) return t('validation.firstNameRequired')
  return null
}

export const validateLastName = (value, t) => {
  if (!value.trim()) return t('validation.lastNameRequired')
  return null
}

export const validateEmail = (value, t) => {
  if (!value.trim()) return t('validation.emailRequired')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) return t('validation.emailInvalid')
  return null
}

export const validatePassword = (value, t) => {
  if (!value) return t('validation.passwordRequired')
  if (value.length < 8) return t('validation.passwordMinLength')
  return null
}

export const validateConfirmPassword = (value, password, t) => {
  if (!value) return t('validation.confirmPasswordRequired')
  if (value !== password) return t('validation.confirmPasswordMismatch')
  return null
}

export const validateTerms = (checked, t) => {
  if (!checked) return t('validation.termsRequired')
  return null
}

// Validate toàn bộ form, nhận thêm t để dịch message lỗi
export const validateSignUpForm = (formData, t) => {
  const errors = {}

  const firstNameError = validateFirstName(formData.firstName, t)
  if (firstNameError) errors.firstName = firstNameError

  const lastNameError = validateLastName(formData.lastName, t)
  if (lastNameError) errors.lastName = lastNameError

  const emailError = validateEmail(formData.email, t)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(formData.password, t)
  if (passwordError) errors.password = passwordError

  const confirmPasswordError = validateConfirmPassword(
    formData.confirmPassword,
    formData.password,
    t
  )
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError

  const termsError = validateTerms(formData.agreeTerms, t)
  if (termsError) errors.agreeTerms = termsError

  return errors
}

export const isFormValid = (errors) => Object.keys(errors).length === 0