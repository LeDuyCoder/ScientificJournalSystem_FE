import { Icon } from "@iconify/react";

const SocialAuthButton = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      className="btn btn-social"
      onClick={onClick}
      disabled={disabled}
      aria-label="Tiếp tục với Google"
    >
      <Icon icon="logos:google-icon" width="18" height="18" />
      <span>Tiếp tục với Google</span>
    </button>
  );
};

export default SocialAuthButton;
