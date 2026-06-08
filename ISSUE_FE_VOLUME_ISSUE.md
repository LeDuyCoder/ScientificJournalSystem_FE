# [FE] Build Journal Detail - Volumes & Issues Section

## Mô tả

Xây dựng phần **Volumes & Issues** trong trang chi tiết journal.

Trang này cho phép người dùng xem danh sách volume của một journal, mở từng volume để xem các issue bên trong, sau đó có thể đi tiếp đến danh sách bài báo thuộc từng issue.

Phần này nằm trong trang chi tiết journal, ví dụ:

```txt
/journals/:journalId
```

---

## UI tham khảo

Dựa theo giao diện journal detail hiện tại:

- Phần trên hiển thị thông tin tổng quan của journal.
- Bên dưới có tab hoặc section **Volumes & Issues**.
- Danh sách volume hiển thị dạng accordion.
- Mỗi volume có thể mở/đóng.
- Khi mở volume, hiển thị danh sách issue thuộc volume đó.

---

## Yêu cầu chức năng

### 1. Hiển thị danh sách Volume

Mỗi journal cần hiển thị danh sách volume theo journal ID.

Thông tin volume cần có:

- Volume number
- Year
- Total issues nếu backend hỗ trợ
- Trạng thái mở/đóng accordion

Ví dụ:

```txt
Volume 2025
Volume 2024
Volume 2023
Volume 2022
```

Mặc định sắp xếp:

```txt
year DESC
volume_number DESC
```

Tức là volume mới nhất hiển thị trước.

---

### 2. Mở Volume để xem Issue

Khi người dùng click vào một volume, FE hiển thị danh sách issue thuộc volume đó.

Có thể xử lý theo 1 trong 2 cách:

#### Cách 1: Load issues ngay từ đầu

Backend trả về volume kèm issues.

Phù hợp nếu dữ liệu ít.

#### Cách 2: Lazy load issues khi mở volume

Chỉ gọi API lấy issues khi người dùng mở volume.

Phù hợp hơn nếu journal có nhiều năm/volume.

Ưu tiên dùng cách 2 để tối ưu performance.

---

### 3. Hiển thị danh sách Issue

Mỗi issue cần hiển thị:

- Issue number
- Year
- Month nếu có
- Total articles nếu backend hỗ trợ
- Button hoặc link xem bài báo trong issue

Ví dụ:

```txt
Issue 1 · January 2025 · 25 articles
Issue 2 · February 2025 · 18 articles
Issue 3 · March 2025 · 31 articles
```

Mặc định sắp xếp issue:

```txt
year DESC
month DESC
issue_number DESC
```

---

### 4. Điều hướng đến danh sách Article theo Issue

Khi người dùng chọn một issue, điều hướng đến trang danh sách bài báo của issue đó.

Route đề xuất:

```txt
/journals/:journalId/issues/:issueId/articles
```

Hoặc nếu project đã có route article khác thì thống nhất lại với team.

---

## API đề xuất

### Get volumes by journal

```http
GET /api/v1/journals/:journalId/volumes
```

Query params:

```txt
page=
limit=
sortBy=
sortOrder=
```

Request mặc định:

```http
GET /api/v1/journals/:journalId/volumes?page=1&limit=20&sortBy=year&sortOrder=desc
```

---

### Get issues by volume

```http
GET /api/v1/volumes/:volumeId/issues
```

Query params:

```txt
page=
limit=
sortBy=
sortOrder=
```

Request mặc định:

```http
GET /api/v1/volumes/:volumeId/issues?page=1&limit=50&sortBy=issue_number&sortOrder=desc
```

---

### Get articles by issue

```http
GET /api/v1/issues/:issueId/articles
```

Query params:

```txt
page=
limit=
sortBy=
sortOrder=
```

---

## Cấu trúc file đề xuất

```txt
src/features/journal-detail/
├── api/
│   └── journalDetailApi.js
├── components/
│   ├── JournalHeader.jsx
│   ├── JournalTabs.jsx
│   ├── VolumeIssueSection.jsx
│   ├── VolumeAccordion.jsx
│   ├── VolumeAccordionItem.jsx
│   ├── IssueList.jsx
│   └── IssueListItem.jsx
├── hooks/
│   ├── useJournalDetail.js
│   ├── useJournalVolumes.js
│   └── useVolumeIssues.js
├── pages/
│   └── JournalDetailPage.jsx
├── services/
│   └── journalDetailService.js
├── store/
│   └── journalDetailStore.js
└── index.js
```

Nếu project đã có feature `journals`, có thể đặt trong:

```txt
src/features/journals/
├── components/
│   ├── VolumeIssueSection.jsx
│   ├── VolumeAccordion.jsx
│   └── IssueList.jsx
├── hooks/
│   ├── useJournalVolumes.js
│   └── useVolumeIssues.js
├── api/
│   └── journalApi.js
└── services/
    └── journalService.js
```

Team thống nhất chọn 1 cách, không tạo trùng 2 feature.

---

## Zustand store yêu cầu

Sử dụng Zustand nếu trạng thái volume/issue cần dùng chung giữa nhiều component trong trang detail.

Store đề xuất:

```txt
src/features/journal-detail/store/journalDetailStore.js
```

State gợi ý:

```js
{
  activeTab: "overview",
  expandedVolumeIds: [],
  selectedVolumeId: null,
  selectedIssueId: null
}
```

Action cần có:

- `setActiveTab`
- `toggleVolume`
- `setSelectedVolume`
- `setSelectedIssue`
- `resetJournalDetailState`

Tất cả function trong store phải có comment.

Ví dụ:

```js
import { create } from "zustand";

/**
 * Store quản lý trạng thái UI của trang chi tiết journal.
 */
export const useJournalDetailStore = create((set) => ({
  activeTab: "overview",
  expandedVolumeIds: [],
  selectedVolumeId: null,
  selectedIssueId: null,

  /**
   * Cập nhật tab đang được chọn trong trang journal detail.
   *
   * @param {string} tab - Tên tab cần hiển thị.
   */
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  /**
   * Mở hoặc đóng một volume trong danh sách accordion.
   *
   * @param {string|number} volumeId - ID của volume cần toggle.
   */
  toggleVolume: (volumeId) => {
    set((state) => {
      const isExpanded = state.expandedVolumeIds.includes(volumeId);

      return {
        expandedVolumeIds: isExpanded
          ? state.expandedVolumeIds.filter((id) => id !== volumeId)
          : [...state.expandedVolumeIds, volumeId],
      };
    });
  },

  /**
   * Reset trạng thái trang journal detail khi rời trang hoặc đổi journal.
   */
  resetJournalDetailState: () => {
    set({
      activeTab: "overview",
      expandedVolumeIds: [],
      selectedVolumeId: null,
      selectedIssueId: null,
    });
  },
}));
```

Lưu ý:

- Không cần lưu volume/issue vào localStorage.
- Không lưu dữ liệu journal detail vào storage.
- Chỉ dùng Zustand cho state UI cần chia sẻ giữa nhiều component.
- Nếu chỉ mở/đóng accordion trong một component nhỏ thì có thể dùng `useState`.

---

## Quy tắc code

- Không gọi `axios` trực tiếp trong component/page.
- Tất cả API phải đi qua `shared/services/httpClient.js`.
- Không hard-code base URL.
- Component chỉ xử lý UI.
- Hook xử lý fetch data, loading, error.
- Service xử lý response data từ API.
- API file chỉ gọi endpoint.
- Function quan trọng phải có comment.
- Không lưu volume/issue vào localStorage.
- Không duplicate logic fetch issue ở nhiều component.

---

## Loading / Empty / Error state

### Loading volumes

Khi đang tải danh sách volume:

```txt
Đang tải danh sách volumes...
```

### Empty volumes

Khi journal chưa có volume:

```txt
Journal này chưa có volume.
```

### Error volumes

Khi API lấy volume lỗi:

```txt
Không thể tải danh sách volumes. Vui lòng thử lại.
```

### Loading issues

Khi đang mở volume và tải issue:

```txt
Đang tải issues...
```

### Empty issues

Khi volume không có issue:

```txt
Volume này chưa có issue.
```

### Error issues

Khi API lấy issue lỗi:

```txt
Không thể tải danh sách issues. Vui lòng thử lại.
```

---

## Acceptance Criteria

- [ ] Trang journal detail có section/tab **Volumes & Issues**.
- [ ] FE gọi API lấy danh sách volume theo `journalId`.
- [ ] Volume được sắp xếp mặc định theo năm mới nhất trước.
- [ ] Danh sách volume hiển thị dạng accordion.
- [ ] Người dùng có thể mở/đóng từng volume.
- [ ] Khi mở volume, FE hiển thị danh sách issue thuộc volume đó.
- [ ] Issue được sắp xếp theo issue mới nhất trước.
- [ ] Mỗi issue hiển thị được issue number, year, month nếu có.
- [ ] Có link/button để xem danh sách bài báo thuộc issue.
- [ ] Có loading state cho volume.
- [ ] Có empty state cho volume.
- [ ] Có error state cho volume.
- [ ] Có loading state cho issue.
- [ ] Có empty state cho issue.
- [ ] Có error state cho issue.
- [ ] Không gọi API trực tiếp trong component/page.
- [ ] API đi qua `httpClient`.
- [ ] Không hard-code API URL.
- [ ] Không lưu volume/issue vào localStorage.
- [ ] Nếu dùng Zustand, các function trong store phải có comment.
- [ ] Chạy được `npm run dev`.
- [ ] Chạy được `npm run build`.
- [ ] Không có lỗi lint nghiêm trọng.

---

## Gợi ý chia task nhỏ

### Task 1: Setup section Volumes & Issues

- Tạo `VolumeIssueSection.jsx`
- Gắn vào `JournalDetailPage.jsx`
- Hiển thị layout cơ bản

### Task 2: Build API/service cho volume

- Tạo API get volumes by journal
- Tạo service xử lý response
- Đảm bảo default sort theo `year desc`

### Task 3: Build hook `useJournalVolumes`

- Fetch volumes theo `journalId`
- Xử lý loading/error/empty
- Trả data cho component

### Task 4: Build accordion volume

- Tạo `VolumeAccordion.jsx`
- Tạo `VolumeAccordionItem.jsx`
- Hiển thị volume theo thứ tự mới nhất trước

### Task 5: Build API/service cho issue

- Tạo API get issues by volume
- Tạo service xử lý response
- Đảm bảo sort issue mới nhất trước

### Task 6: Build hook `useVolumeIssues`

- Fetch issues theo `volumeId`
- Có thể lazy load khi mở volume
- Xử lý loading/error/empty

### Task 7: Build issue list

- Tạo `IssueList.jsx`
- Tạo `IssueListItem.jsx`
- Hiển thị issue number, year, month, total articles nếu có
- Thêm button/link xem articles

### Task 8: Review & refactor

- Check theo `FRONTEND_STRUCTURE_REVIEW_GUIDE.md`
- Đưa code cho AI agent review
- Sửa lỗi Critical/Major trước khi merge

---

## Notes cho Backend

FE cần BE hỗ trợ:

- Lấy danh sách volume theo journal ID.
- Lấy danh sách issue theo volume ID.
- Sort volume theo year/volume number.
- Sort issue theo issue number/year/month.
- Pagination nếu dữ liệu nhiều.
- Trả về total issues hoặc total articles nếu có.

Response volume đề xuất:

```json
{
  "success": true,
  "message": "Get journal volumes successfully",
  "data": {
    "items": [
      {
        "volume_id": 1,
        "journal_id": 1,
        "volume_number": "2025",
        "year": 2025,
        "total_issues": 12
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

Response issue đề xuất:

```json
{
  "success": true,
  "message": "Get volume issues successfully",
  "data": {
    "items": [
      {
        "issue_id": 1,
        "journal_id": 1,
        "volume_id": 1,
        "issue_number": "1",
        "year": 2025,
        "month": 1,
        "total_articles": 25
      }
    ]
  }
}
```

---

## Branch gợi ý

```txt
feature/journal-volume-issue
```

---

## Commit gợi ý

```txt
feat(journals): build volume and issue section in journal detail
```

---

## Ghi chú quan trọng

Phần volume/issue cần ưu tiên trải nghiệm đọc dữ liệu dài.

Vì một journal có thể có rất nhiều volume và issue, nên nên dùng accordion và lazy load issues khi mở volume để tránh tải quá nhiều dữ liệu ngay từ đầu.
