import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateSignUpForm, isFormValid } from '../validations/signUpValidation'
import authService from '../services/authService' // ✅ Gọi qua service thay vì api trực tiếp

const useSignUp = () => {
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
    const validationErrors = validateSignUpForm(formData, t)
    if (!isFormValid(validationErrors)) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    setApiError(null)
    try {
      // ✅ Gọi qua authService thay vì registerApi trực tiếp
      await authService.register(formData)
      setIsSuccess(true)
    } catch (error) {
      if (error.status === 409) {
        setErrors((prev) => ({ ...prev, email: t('validation.emailExists') }))
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