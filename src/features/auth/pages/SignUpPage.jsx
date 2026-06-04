import AuthLayout from '../components/AuthLayout/AuthLayout'
import AuthBanner from '../components/AuthBanner/AuthBanner'
import SignUpForm from '../components/SignUpForm/SignUpForm'

const SignUpPage = () => {
  return (
    <AuthLayout
      banner={<AuthBanner />}
      form={<SignUpForm />}
    />
  )
}

export default SignUpPage