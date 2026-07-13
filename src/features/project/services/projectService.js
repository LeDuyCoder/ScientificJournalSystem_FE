import * as projectApi from '../api/project.api';

/**
 * Service xử lý logic nghiệp vụ cho Project
 */
const projectService = {
  /**
   * Lấy danh sách dự án
   * @returns {Promise<Array>} Danh sách dự án
   */
  async getAllProjects() {
    const res = await projectApi.getProjectsApi();
    return res.data?.data || [];
  },

  /**
   * Tạo dự án mới
   * @param {Object} data - Payload tạo dự án
   * @returns {Promise<Object>} Dữ liệu trả về từ backend
   */
  async createProject(data) {
    const res = await projectApi.createProjectApi(data);
    return res.data;
  },

  /**
   * Lấy chi tiết dự án
   * @param {number|string} id - ID dự án
   * @returns {Promise<Object>} Chi tiết dự án
   */
  async getProjectById(id) {
    const res = await projectApi.getProjectByIdApi(id);
    return res.data;
  },

  /**
   * Lấy dữ liệu tổng quan và biểu đồ của dự án
   * @param {number|string} id - ID dự án
   * @returns {Promise<Object>} Dữ liệu overview
   */
  async getProjectOverview(id) {
    const res = await projectApi.getProjectOverviewApi(id);
    return res.data?.data || res.data;
  },

  /**
   * Cập nhật dự án
   * @param {number|string} id - ID dự án
   * @param {Object} data - Dữ liệu cập nhật
   * @returns {Promise<Object>} Dữ liệu trả về
   */
  async updateProject(id, data) {
    const res = await projectApi.updateProjectApi(id, data);
    return res.data;
  },

  /**
   * Xóa dự án
   * @param {number|string} id - ID dự án
   * @returns {Promise<Object>} Dữ liệu trả về
   */
  async deleteProject(id) {
    const res = await projectApi.deleteProjectApi(id);
    return res.data;
  },

  /**
   * Khôi phục dự án
   * @param {number|string} id - ID dự án
   * @returns {Promise<Object>} Dữ liệu trả về
   */
  async restoreProject(id) {
    const res = await projectApi.restoreProjectApi(id);
    return res.data;
  },

  /**
   * Lấy danh sách thành viên dự án
   */
  async getProjectMembers(projectId) {
    const res = await projectApi.getProjectMembersApi(projectId);
    return res.data?.data || [];
  },

  /**
   * Mời thành viên vào dự án
   */
  async inviteProjectMember(projectId, email, role) {
    const res = await projectApi.inviteProjectMemberApi(projectId, email, role);
    return res.data;
  },

  /**
   * Cập nhật quyền của thành viên
   */
  async updateProjectMemberRole(projectId, userId, role) {
    const res = await projectApi.updateProjectMemberRoleApi(projectId, userId, role);
    return res.data;
  },

  /**
   * Xóa thành viên hoặc hủy lời mời
   */
  async removeProjectMember(projectId, userId) {
    const res = await projectApi.removeProjectMemberApi(projectId, userId);
    return res.data;
  },

  /**
   * Xác nhận lời mời bằng token
   */
  async acceptProjectInvite(token) {
    const res = await projectApi.acceptProjectInviteApi(token);
    return res.data;
  }
};

export default projectService;
