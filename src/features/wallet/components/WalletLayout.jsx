import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useCallback } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '../../landing/components/Header';
import ROUTES from '../../../app/routes/routePaths';
import './WalletLayout.css';
const NAV_ITEMS = [{
  label: t("landing.viCuaToi"),
  icon: 'lucide:wallet',
  path: ROUTES.WALLET
}, {
  label: t("wallet.napCoin"),
  icon: 'lucide:badge-plus',
  path: ROUTES.WALLET_TOP_UP
}, {
  label: t("wallet.lichSuGiaoDich"),
  icon: 'lucide:history',
  path: ROUTES.WALLET_TRANSACTIONS
}];
export default function WalletLayout({
  children
}) {
  const location = useLocation();

  /**
   * Kiểm tra xem một mục menu có đang active hay không.
   * Sử dụng useCallback để tránh tạo lại hàm mỗi lần render.
   */
  const getActiveClassName = useCallback(({
    isActive
  }) => {
    // `isActive` là prop được NavLink cung cấp
    return `wallet-sidebar__item ${isActive ? 'active' : ''}`;
  }, [] // Không có dependency, hàm chỉ được tạo một lần
  );
  return <div className="wallet-layout-page">
      <Header />
      <div className="wallet-body">
        <aside className="wallet-sidebar">
          <nav className="wallet-sidebar__nav">
            {NAV_ITEMS.map(item =>
          // Sử dụng NavLink để xử lý active state và điều hướng tự động
          <NavLink key={item.path} to={item.path} className={getActiveClassName} end={item.path === ROUTES.WALLET}>
                <Icon icon={item.icon} width={18} className="admin-sidebar__item-icon" />
                <span>{item.label}</span>
              </NavLink>)}
          </nav>
        </aside>
        <main className="wallet-content">{children || <Outlet />}</main>
      </div>
    </div>;
}