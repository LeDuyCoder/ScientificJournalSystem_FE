export const LOGIN_ERROR_CODES = {
  EMAIL_REQUIRED: "EMAIL_REQUIRED",
  INVALID_EMAIL_FORMAT: "INVALID_EMAIL_FORMAT",
  PASSWORD_REQUIRED: "PASSWORD_REQUIRED",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
};

export const LOGIN_ERROR_MESSAGES = {
  [LOGIN_ERROR_CODES.EMAIL_REQUIRED]: "Email không được để trống",
  [LOGIN_ERROR_CODES.INVALID_EMAIL_FORMAT]: "Email không đúng định dạng",
  [LOGIN_ERROR_CODES.PASSWORD_REQUIRED]: "Password không được để trống",
  [LOGIN_ERROR_CODES.LOGIN_SUCCESS]: "Đăng nhập thành công",
};

export const getLoginErrorMessage = (codeOrMessage) => {
  if (!codeOrMessage) {
    return "Đã có lỗi xảy ra. Vui lòng thử lại.";
  }

  return LOGIN_ERROR_MESSAGES[codeOrMessage] || codeOrMessage;
};
