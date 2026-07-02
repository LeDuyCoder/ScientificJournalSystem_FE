/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared\components\Button\PrimaryButton.jsx
 */
import { Button } from 'react-bootstrap';
import Icon from '../Icon';
import './PrimaryButton.css';

/**
 * Reusable Primary Button component with a unified styling system.
 * Based on the design template of the primary search button.
 *
 * @param {React.ReactNode} children - Button text or inner elements
 * @param {string} [icon] - Optional Iconify icon name (e.g. 'lucide:search')
 * @param {string} [className] - Optional extra CSS classes
 * @param {string} [type='button'] - Button type (button, submit, reset)
 * @returns {JSX.Element}
 */
export default function PrimaryButton({
  children,
  icon = '',
  className = '',
  type = 'button',
  variant = 'primary', // 'primary' | 'outline' | 'destructive'
  ...props
}) {
  return (
    <Button
      type={type}
      className={`btn-unified btn-variant-${variant} ${className}`}
      {...props}
    >
      {icon && <Icon icon={icon} width="15" className="btn-icon-unified" />}
      {children}
    </Button>
  );
}
