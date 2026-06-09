# [FE] Build Search Page - Journal Catalog & Search

## Mô tả

Xây dựng trang **Danh mục & Tìm kiếm** cho hệ thống ResearchPulse / Scientific Journal System.

Trang này cho phép người dùng tìm kiếm journal theo từ khóa, lọc theo lĩnh vực, danh mục, khu vực, loại truy cập và quartile. Kết quả journal sẽ hiển thị dạng danh sách hoặc dạng bảng.

Mặc định, danh sách journal cần được sắp xếp theo **metric cao nhất** để những journal có chỉ số tốt nhất hiển thị trước.

---

## Route

```txt
/search
```

---

## UI tham khảo

Trang gồm các khu vực chính:

1. Header / Navbar
2. Breadcrumb
3. Page title
4. Search bar
5. Filter panel
6. Result summary
7. Sort dropdown
8. Toggle view: list / table
9. Journal result list

---

## Yêu cầu chức năng

### 1. Search bar

Người dùng có thể tìm kiếm journal theo:

- Tên journal
- Tác giả
- ISSN
- Từ khóa liên quan nếu backend hỗ trợ

Placeholder:

```txt
Tìm journal, tác giả, ISSN...
```

Khi người dùng bấm nút **Tìm kiếm**, FE gọi API để lấy danh sách journal phù hợp.

---

### 2. Filter panel

Cần có các bộ lọc sau:

#### Dropdown filters

- Subject Area
- Subject Category
- Zone
- Access Type
- Quartile

Ví dụ label:

```txt
All subject areas
All subject categories
zone
All access types
All quartiles
```

#### Toggle filters

- Only Open Access Journals
- Only Q1 Journals
- Only Q2 Journals
- Only Q3 Journals
- Only Q4 Journals

#### Clear filters

Có nút:

```txt
Clear filters
```

Khi bấm, tất cả filter trở về trạng thái mặc định.

---

### 3. Result summary

Hiển thị tổng số journal tìm được và trang hiện tại.

Ví dụ:

```txt
Tìm thấy 10000 journals · Trang 1 / 1000
```

Dữ liệu cần lấy từ response pagination của backend.

---

### 4. Default sorting

Danh sách journal mặc định phải sắp xếp theo **metric cao nhất**.

Mặc định khi vào trang `/search`, query sort nên là:

```txt
sortBy=metric
sortOrder=desc
```

Hoặc nếu backend dùng tên khác thì thống nhất lại với BE.

Nếu hệ thống có nhiều loại metric, thứ tự ưu tiên đề xuất:

```txt
1. Ranking score / SJR score / metric score mới nhất
2. Quartile tốt nhất, Q1 ưu tiên cao nhất
3. H-index cao hơn
4. Citations cao hơn
5. Tên journal A-Z nếu các chỉ số bằng nhau
```

Lưu ý: FE không tự sort nếu backend đã hỗ trợ sort. FE chỉ truyền params và render kết quả từ backend.

---

### 5. Sort dropdown

Có dropdown sắp xếp, mặc định là:

```txt
Mặc định
```

Các option đề xuất:

```txt
Mặc định - Metric cao nhất
Metric cao nhất
Tên A-Z
Tên Z-A
Năm mới nhất
Quartile tốt nhất
```

Mapping gợi ý:

```js
const SORT_OPTIONS = [
  {
    label: "Mặc định - Metric cao nhất",
    value: "metric_desc",
    sortBy: "metric",
    sortOrder: "desc",
  },
  {
    label: "Tên A-Z",
    value: "name_asc",
    sortBy: "display_name",
    sortOrder: "asc",
  },
  {
    label: "Tên Z-A",
    value: "name_desc",
    sortBy: "display_name",
    sortOrder: "desc",
  },
  {
    label: "Quartile tốt nhất",
    value: "quartile_asc",
    sortBy: "quartile",
    sortOrder: "asc",
  },
];
```

---

### 6. View mode

Có 2 chế độ hiển thị:

- List view
- Table view

Mặc định: `list`

Người dùng có thể chuyển giữa 2 chế độ bằng icon button.

---

## Yêu cầu hiển thị journal item

Mỗi journal trong list nên hiển thị các thông tin chính:

- Journal name
- ISSN
- Publisher
- Country / Zone
- Subject Area / Subject Category
- Access type
- Quartile
- Metric score
- Ranking year
- Button xem chi tiết

Ví dụ card:

```txt
Journal Name
ISSN: xxxx-xxxx
Publisher: Elsevier
Country: United Kingdom
Subject: Medicine
Quartile: Q1
Metric: 12.45
Year: 2025

[Xem chi tiết]
```

---

## API đề xuất

### Get journal search list

```http
GET /api/v1/journals/search
```

Query params đề xuất:

```txt
keyword=
subjectAreaId=
subjectCategoryId=
zoneId=
accessType=
quartile=
isOpenAccess=
page=
limit=
sortBy=
sortOrder=
```

Ví dụ request mặc định:

```http
GET /api/v1/journals/search?page=1&limit=10&sortBy=metric&sortOrder=desc
```

Ví dụ khi search + filter:

```http
GET /api/v1/journals/search?keyword=nature&subjectAreaId=1&quartile=Q1&isOpenAccess=true&page=1&limit=10&sortBy=metric&sortOrder=desc
```

---

## Cấu trúc file đề xuất

```txt
src/features/search/
├── api/
│   └── searchApi.js
├── components/
│   ├── SearchBar.jsx
│   ├── SearchFilterPanel.jsx
│   ├── SearchResultSummary.jsx
│   ├── SearchSortDropdown.jsx
│   ├── SearchViewToggle.jsx
│   ├── JournalList.jsx
│   ├── JournalListItem.jsx
│   └── JournalTable.jsx
├── hooks/
│   └── useJournalSearch.js
├── pages/
│   └── SearchPage.jsx
├── services/
│   └── searchService.js
├── store/
│   └── searchFilterStore.js
└── index.js
```

---

## Zustand store yêu cầu

Sử dụng Zustand để quản lý state dùng chung của trang search.

Store đề xuất:

```txt
src/features/search/store/searchFilterStore.js
```

State cần quản lý:

```js
{
  keyword,
  subjectAreaId,
  subjectCategoryId,
  zoneId,
  accessType,
  quartile,
  isOpenAccess,
  onlyQ1,
  onlyQ2,
  onlyQ3,
  onlyQ4,
  page,
  limit,
  sortBy,
  sortOrder,
  viewMode
}
```

Giá trị mặc định:

```js
{
  keyword: "",
  subjectAreaId: "",
  subjectCategoryId: "",
  zoneId: "",
  accessType: "",
  quartile: "",
  isOpenAccess: false,
  onlyQ1: false,
  onlyQ2: false,
  onlyQ3: false,
  onlyQ4: false,
  page: 1,
  limit: 10,
  sortBy: "metric",
  sortOrder: "desc",
  viewMode: "list",
}
```

Các action cần có:

- `setKeyword`
- `setFilter`
- `setQuartile`
- `setPage`
- `setSort`
- `setViewMode`
- `clearFilters`

Tất cả function trong store phải có comment.

---

## Quy tắc code

- Không gọi `axios` trực tiếp trong component/page.
- Tất cả API phải đi qua `shared/services/httpClient.js`.
- Không hard-code base URL.
- Không lưu dữ liệu search nhạy cảm vào localStorage.
- Không cần persist filter vào localStorage ở version đầu.
- Component chỉ xử lý UI, không xử lý logic API.
- Hook xử lý fetch data, loading, error.
- Service xử lý response data từ API.
- API file chỉ gọi endpoint.
- Hàm quan trọng phải có comment.

---

## Loading / Empty / Error state

Cần xử lý đủ các trạng thái:

### Loading

Khi đang gọi API, hiển thị loading skeleton hoặc loading text.

```txt
Đang tải danh sách journals...
```

### Empty

Khi không có kết quả:

```txt
Không tìm thấy journal phù hợp.
```

### Error

Khi API lỗi:

```txt
Không thể tải danh sách journals. Vui lòng thử lại.
```

---

## Acceptance Criteria

- [ ] Có route `/search`.
- [ ] Trang search render đúng layout theo UI tham khảo.
- [ ] Có search bar.
- [ ] Có filter panel gồm subject area, subject category, zone, access type, quartile.
- [ ] Có toggle Only Open Access Journals.
- [ ] Có toggle Only Q1/Q2/Q3/Q4 Journals.
- [ ] Có nút Clear filters.
- [ ] Có result summary hiển thị tổng số journal và trang hiện tại.
- [ ] Có dropdown sort.
- [ ] Default sort là metric cao nhất.
- [ ] Request mặc định gửi `sortBy=metric&sortOrder=desc`.
- [ ] Có list view.
- [ ] Có table view.
- [ ] Có thể đổi view mode giữa list/table.
- [ ] Có pagination.
- [ ] Có loading state.
- [ ] Có empty state.
- [ ] Có error state.
- [ ] Không gọi API trực tiếp trong component/page.
- [ ] Có sử dụng Zustand cho search filter state.
- [ ] Các function trong Zustand store có comment.
- [ ] API đi qua `httpClient`.
- [ ] Không hard-code API URL.
- [ ] Chạy được `npm run dev`.
- [ ] Chạy được `npm run build`.
- [ ] Không có lỗi lint nghiêm trọng.

---

## Gợi ý chia task nhỏ

### Task 1: Setup route và page

- Tạo `SearchPage.jsx`
- Add route `/search`
- Render layout cơ bản

### Task 2: Build search store bằng Zustand

- Tạo `searchFilterStore.js`
- Tạo state mặc định
- Tạo action update filter
- Tạo action clear filters
- Tạo action update sort/view mode

### Task 3: Build API/service/hook

- Tạo `searchApi.js`
- Tạo `searchService.js`
- Tạo `useJournalSearch.js`
- Gọi API với query params từ Zustand store

### Task 4: Build UI filter

- Tạo `SearchBar.jsx`
- Tạo `SearchFilterPanel.jsx`
- Tạo dropdown filters
- Tạo toggle filters
- Tạo Clear filters

### Task 5: Build result list

- Tạo `JournalList.jsx`
- Tạo `JournalListItem.jsx`
- Hiển thị journal card
- Default render theo metric cao nhất

### Task 6: Build table view

- Tạo `JournalTable.jsx`
- Hiển thị dữ liệu dạng bảng
- Đồng bộ với view mode

### Task 7: Build sort + pagination

- Tạo `SearchSortDropdown.jsx`
- Tạo pagination hoặc dùng component shared nếu có
- Đổi sort thì reset page về 1

### Task 8: Review & Refactor

- Check lại theo `FRONTEND_STRUCTURE_REVIEW_GUIDE.md`
- Đưa code cho AI agent review
- Sửa lỗi Critical/Major trước khi merge

---

## Notes cho Backend

FE cần BE hỗ trợ:

- Search journals
- Filter theo subject area
- Filter theo subject category
- Filter theo zone
- Filter theo access type
- Filter theo quartile
- Sort theo metric cao nhất
- Pagination

Nếu BE chưa có endpoint chính thức, FE tạm mock data nhưng phải giữ đúng service/api structure để sau này thay endpoint dễ dàng.

---

## Branch gợi ý

```txt
feature/search-page
```

---

## Commit gợi ý

```txt
feat(search): build journal search page with filters and metric sorting
```

---

## Ghi chú quan trọng

Điểm quan trọng nhất của issue này là chỗ **default sort**.

Ngay từ lần load đầu tiên của `/search`, list phải gửi params sort theo metric giảm dần, không để BE trả ngẫu nhiên.
