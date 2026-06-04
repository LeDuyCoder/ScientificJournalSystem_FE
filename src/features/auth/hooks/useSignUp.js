import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateSignUpForm, isFormValid } from '../validations/signUpValidation'
import { registerApi } from '../api/authApi'

const useSignUp = () => {
  // Lấy hàm t để truyền vào validation
  const { t } = useTranslation('auth')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (field) => (e) => {
    const value = field === 'agreeTerms' ? e.target.checked : e.target.value
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
    setApiError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Truyền t vào validate để message lỗi đúng ngôn ngữ
    const validationErrors = validateSignUpForm(formData, t)

    if (!isFormValid(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setApiError(null)

    try {
      await registerApi({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      })
      setIsSuccess(true)
    } catch (error) {
      if (error.status === 409) {
        // Lỗi email đã tồn tại cũng dịch theo ngôn ngữ
        setErrors((prev) => ({
          ...prev,
          email: t('validation.emailExists')
        }))
      } else {
        setApiError(t('error.general'))
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    errors,
    loading,
    apiError,
    isSuccess,
    handleChange,
    handleSubmit,
  }
}

export default useSignUp