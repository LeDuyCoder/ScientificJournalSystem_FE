/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\volume\api\volume.httpClient.js
 */
import httpClient from '../../../shared/services/httpClient';

/**
 * Create a new volume record
 * @param {Object} data - Volume entry data
 * @returns {Promise} Axios promise
 */
export const createVolumeApi = (data) => {
  return httpClient.post('/volumes', data);
};

/**
 * Get volumes list, with pagination, query search, and filters
 * @param {Object} params - Query filters
 * @returns {Promise} Axios promise
 */
export const getVolumesApi = (params) => {
  return httpClient.get('/volumes', { params });
};

/**
 * Get detailed volume details by ID
 * @param {number|string} id - Volume ID
 * @returns {Promise} Axios promise
 */
export const getVolumeByIdApi = (id) => {
  return httpClient.get(`/volumes/${id}`);
};

/**
 * Update volume record by ID
 * @param {number|string} id - Volume ID
 * @param {Object} data - Updated volume fields
 * @returns {Promise} Axios promise
 */
export const updateVolumeApi = (id, data) => {
  return httpClient.put(`/volumes/${id}`, data);
};

/**
 * Soft delete a volume entry by ID
 * @param {number|string} id - Volume ID
 * @returns {Promise} Axios promise
 */
export const deleteVolumeApi = (id) => {
  return httpClient.delete(`/volumes/${id}`);
};

/**
 * Restore a soft-deleted volume entry by ID
 * @param {number|string} id - Volume ID
 * @returns {Promise} Axios promise
 */
export const restoreVolumeApi = (id) => {
  return httpClient.patch(`/volumes/${id}/restore`);
};
