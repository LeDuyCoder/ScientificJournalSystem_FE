/**
 * type -> dot color:
 * - 'published' -> orange (--primary)  : main, positive event
 * - 'revision'  -> light blue          : routine update
 * - 'reviewer'  -> gray (--text-muted) : secondary, informational
 * - 'overdue'   -> red                 : needs urgent attention
 *
 * Colors not present in design tokens (light blue, warning red) are
 * declared here for activity-type classification only, similar to how
 * admin-header uses a separate red for the notification badge.
 */
export const ACTIVITY_DOT_COLOR = {
  published: 'var(--primary)',
  revision: '#3b82f6',
  reviewer: 'var(--text-muted)',
  overdue: '#e63946',
};