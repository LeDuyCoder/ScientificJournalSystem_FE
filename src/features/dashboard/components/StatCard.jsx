/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\dashboard\components\StatCard.jsx
 */
import { StatCard as SharedStatCard } from '../../../shared/components/Card';

/**
 * Backward-compatible dashboard wrapper around the shared StatCard.
 * Keeps existing feature imports stable while using the shared card system.
 */
export default function StatCard(props) {
  return <SharedStatCard {...props} />;
}
