# [FE] Build Keyword Feature - Keyword List & Related Articles

## Mô tả

Xây dựng feature **Keyword** cho hệ thống ResearchPulse / Scientific Journal System.

Feature này cho phép người dùng xem danh sách keyword, tìm kiếm keyword, xem mức độ phổ biến của keyword và truy cập danh sách bài báo liên quan đến từng keyword.

Keyword sẽ được dùng để hỗ trợ người dùng khám phá xu hướng nghiên cứu theo chủ đề/từ khóa.

---

## Route đề xuất

### Public routes

```txt
/keywords
/keywords/:keywordId/articles
```

### Admin routes nếu cần CRUD

```txt
/admin/keywords
/admin/keywords/create
/admin/keywords/:keywordId/edit
```

---

## UI chính

Trang Keyword gồm các khu vực:

1. Header / Navbar
2. Breadcrumb
3. Page title
4. Search keyword input
5. Keyword filter/sort
6. Keyword list hoặc keyword cloud
7. Pagination
8. Related articles page theo keyword

---

## Yêu cầu chức năng

### 1. Hiển thị danh sách Keyword

Hiển thị danh sách keyword trong hệ thống.

Mỗi keyword cần có:

- Keyword name
- Total articles nếu backend hỗ trợ
- Topic/Sub-topic nếu có mapping
- Button hoặc link xem bài báo liên quan

Ví dụ:

```txt
Artificial Intelligence
125 articles

[View related articles]
```

---

### 2. Search Keyword

Người dùng có thể tìm kiếm keyword theo tên.

Placeholder:

```txt
Tìm keyword...
```

Khi người dùng nhập từ khóa và bấm tìm kiếm, FE gọi API để lấy danh sách keyword phù hợp.

---

### 3. Default sorting

Danh sách keyword mặc định nên sắp xếp theo **số lượng bài báo liên quan cao nhất**.

Default query đề xuất:

```txt
sortBy=article_count
sortOrder=desc
```

Nếu backend chưa có `article_count`, có thể dùng:

```txt
sortBy=display_name
sortOrder=asc
```

Tuy nhiên ưu tiên backend hỗ trợ sort theo độ phổ biến của keyword.

---

### 4. Sort option

Dropdown sort đề xuất:

```txt
Phổ biến nhất
Tên A-Z
Tên Z-A
Mới nhất
```

Mapping gợi ý:

```js
const KEYWORD_SORT_OPTIONS = [
  {
    label: "Phổ biến nhất",
    value: "article_count_desc",
    sortBy: "article_count",
    sortOrder: "desc",
  },
  {
    label: "Tên A-Z",
    value: "display_name_asc",
    sortBy: "display_name",
    sortOrder: "asc",
  },
  {
    label: "Tên Z-A",
    value: "display_name_desc",
    sortBy: "display_name",
    sortOrder: "desc",
  },
];
```

---

### 5. Xem articles theo keyword

Khi người dùng click vào một keyword, điều hướng đến trang:

```txt
/keywords/:keywordId/articles
```

Trang này hiển thị danh sách bài báo có gắn keyword đó.

Thông tin article cần hiển thị:

- Article title
- Journal name nếu có
- Publication year
- DOI nếu có
- Authors nếu backend hỗ trợ
- Citations count nếu có
- Button xem chi tiết article

---

## API đề xuất

### Get keyword list

```http
GET /api/v1/keywords
```

Query params:

```txt
keyword=
page=
limit=
sortBy=
sortOrder=
```

Request mặc định:

```http
GET /api/v1/keywords?page=1&limit=20&sortBy=article_count&sortOrder=desc
```

---

### Get keyword detail

```http
GET /api/v1/keywords/:keywordId
```

---

### Get articles by keyword

```http
GET /api/v1/keywords/:keywordId/articles
```

Query params:

```txt
page=
limit=
sortBy=
sortOrder=
```

Request ví dụ:

```http
GET /api/v1/keywords/1/articles?page=1&limit=10&sortBy=publication_year&sortOrder=desc
```

---

## Cấu trúc file đề xuất

```txt
src/features/keywords/
├── api/
│   └── keywordApi.js
├── components/
│   ├── KeywordSearchBar.jsx
│   ├── KeywordSortDropdown.jsx
│   ├── KeywordList.jsx
│   ├── KeywordListItem.jsx
│   ├── KeywordCloud.jsx
│   ├── KeywordArticleList.jsx
│   └── KeywordArticleItem.jsx
├── hooks/
│   ├── useKeywords.js
│   └── useKeywordArticles.js
├── pages/
│   ├── KeywordListPage.jsx
│   └── KeywordArticlesPage.jsx
├── services/
│   └── keywordService.js
├── store/
│   └── keywordFilterStore.js
└── index.js
```

---

## Zustand store yêu cầu

Sử dụng Zustand để quản lý state filter/sort/pagination của trang keyword.

Store đề xuất:

```txt
src/features/keywords/store/keywordFilterStore.js
```

State gợi ý:

```js
{
  keyword: "",
  page: 1,
  limit: 20,
  sortBy: "article_count",
  sortOrder: "desc",
  viewMode: "list"
}
```

Actions cần có:

- `setKeyword`
- `setPage`
- `setLimit`
- `setSort`
- `setViewMode`
- `clearFilters`

Tất cả function trong store phải có comment.

Ví dụ:

```js
import { create } from "zustand";

/**
 * Store quản lý filter, sort và pagination của trang Keywords.
 */
export const useKeywordFilterStore = create((set) => ({
  keyword: "",
  page: 1,
  limit: 20,
  sortBy: "article_count",
  sortOrder: "desc",
  viewMode: "list",

  /**
   * Cập nhật keyword tìm kiếm và reset về trang đầu tiên.
   *
   * @param {string} keyword - Từ khóa người dùng nhập.
   */
  setKeyword: (keyword) => {
    set({
      keyword,
      page: 1,
    });
  },

  /**
   * Cập nhật trang hiện tại.
   *
   * @param {number} page - Trang cần hiển thị.
   */
  setPage: (page) => {
    set({ page });
  },

  /**
   * Cập nhật số lượng item trên mỗi trang.
   *
   * @param {number} limit - Số lượng keyword trên mỗi trang.
   */
  setLimit: (limit) => {
    set({
      limit,
      page: 1,
    });
  },

  /**
   * Cập nhật cách sắp xếp danh sách keyword.
   *
   * @param {string} sortBy - Field dùng để sort.
   * @param {string} sortOrder - Thứ tự sort: asc hoặc desc.
   */
  setSort: (sortBy, sortOrder) => {
    set({
      sortBy,
      sortOrder,
      page: 1,
    });
  },

  /**
   * Cập nhật kiểu hiển thị keyword list.
   *
   * @param {string} viewMode - Kiểu hiển thị, ví dụ list hoặc cloud.
   */
  setViewMode: (viewMode) => {
    set({ viewMode });
  },

  /**
   * Reset filter về trạng thái mặc định.
   */
  clearFilters: () => {
    set({
      keyword: "",
      page: 1,
      limit: 20,
      sortBy: "article_count",
      sortOrder: "desc",
      viewMode: "list",
    });
  },
}));
```

---

## API file yêu cầu

```txt
src/features/keywords/api/keywordApi.js
```

Ví dụ:

```js
import httpClient from "../../../shared/services/httpClient";

/**
 * API làm việc với Keyword.
 * Tất cả request phải đi qua httpClient.
 */
const keywordApi = {
  /**
   * Lấy danh sách keyword có hỗ trợ search, sort và pagination.
   *
   * @param {Object} params - Query params gửi lên backend.
   * @returns {Promise} Axios response từ backend.
   */
  getKeywords(params) {
    return httpClient.get("/keywords", { params });
  },

  /**
   * Lấy chi tiết keyword theo ID.
   *
   * @param {string|number} keywordId - ID của keyword.
   * @returns {Promise} Axios response từ backend.
   */
  getKeywordById(keywordId) {
    return httpClient.get(`/keywords/${keywordId}`);
  },

  /**
   * Lấy danh sách bài báo liên quan đến một keyword.
   *
   * @param {string|number} keywordId - ID của keyword.
   * @param {Object} params - Query params phân trang/sắp xếp.
   * @returns {Promise} Axios response từ backend.
   */
  getArticlesByKeyword(keywordId, params) {
    return httpClient.get(`/keywords/${keywordId}/articles`, { params });
  },
};

export default keywordApi;
```

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
- Không lưu keyword filter vào localStorage ở version đầu.
- Không duplicate logic fetch keyword ở nhiều component.

---

## Loading / Empty / Error state

### Loading keywords

```txt
Đang tải danh sách keywords...
```

### Empty keywords

```txt
Không tìm thấy keyword phù hợp.
```

### Error keywords

```txt
Không thể tải danh sách keywords. Vui lòng thử lại.
```

### Loading articles by keyword

```txt
Đang tải danh sách bài báo liên quan...
```

### Empty articles by keyword

```txt
Keyword này chưa có bài báo liên quan.
```

### Error articles by keyword

```txt
Không thể tải danh sách bài báo. Vui lòng thử lại.
```

---

## Acceptance Criteria

- [ ] Có route `/keywords`.
- [ ] Có route `/keywords/:keywordId/articles`.
- [ ] Trang keywords hiển thị danh sách keyword.
- [ ] Có search input để tìm keyword.
- [ ] Có sort dropdown.
- [ ] Default sort theo keyword phổ biến nhất.
- [ ] Request mặc định gửi `sortBy=article_count&sortOrder=desc`.
- [ ] Có pagination.
- [ ] Mỗi keyword hiển thị tên keyword.
- [ ] Mỗi keyword hiển thị số lượng article nếu backend hỗ trợ.
- [ ] Có link/button xem articles liên quan.
- [ ] Trang articles theo keyword hiển thị danh sách bài báo.
- [ ] Có loading state cho keyword list.
- [ ] Có empty state cho keyword list.
- [ ] Có error state cho keyword list.
- [ ] Có loading state cho articles by keyword.
- [ ] Có empty state cho articles by keyword.
- [ ] Có error state cho articles by keyword.
- [ ] Có sử dụng Zustand cho keyword filter/sort/pagination state.
- [ ] Các function trong Zustand store có comment.
- [ ] API đi qua `httpClient`.
- [ ] Không hard-code API URL.
- [ ] Không lưu keyword filter vào localStorage.
- [ ] Chạy được `npm run dev`.
- [ ] Chạy được `npm run build`.
- [ ] Không có lỗi lint nghiêm trọng.

---

## Gợi ý chia task nhỏ

### Task 1: Setup route và page

- Tạo `KeywordListPage.jsx`
- Tạo `KeywordArticlesPage.jsx`
- Add route `/keywords`
- Add route `/keywords/:keywordId/articles`

### Task 2: Build Zustand store

- Tạo `keywordFilterStore.js`
- Tạo state mặc định
- Tạo action update keyword
- Tạo action update sort
- Tạo action update page
- Tạo action clear filters

### Task 3: Build API/service

- Tạo `keywordApi.js`
- Tạo `keywordService.js`
- Tạo function get keywords
- Tạo function get articles by keyword

### Task 4: Build hooks

- Tạo `useKeywords.js`
- Tạo `useKeywordArticles.js`
- Xử lý loading/error/empty

### Task 5: Build keyword UI

- Tạo `KeywordSearchBar.jsx`
- Tạo `KeywordSortDropdown.jsx`
- Tạo `KeywordList.jsx`
- Tạo `KeywordListItem.jsx`

### Task 6: Build articles by keyword UI

- Tạo `KeywordArticleList.jsx`
- Tạo `KeywordArticleItem.jsx`
- Hiển thị danh sách bài báo liên quan đến keyword

### Task 7: Review & refactor

- Check theo `FRONTEND_STRUCTURE_REVIEW_GUIDE.md`
- Đưa code cho AI agent review
- Sửa lỗi Critical/Major trước khi merge

---

## Notes cho Backend

FE cần BE hỗ trợ:

- Lấy danh sách keyword.
- Search keyword theo tên.
- Sort keyword theo số lượng bài báo liên quan.
- Pagination keyword list.
- Lấy danh sách article theo keyword.
- Pagination article list.

Response keyword list đề xuất:

```json
{
  "success": true,
  "message": "Get keywords successfully",
  "data": {
    "items": [
      {
        "keyword_id": 1,
        "display_name": "Artificial Intelligence",
        "article_count": 125
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1000
    }
  }
}
```

Response articles by keyword đề xuất:

```json
{
  "success": true,
  "message": "Get articles by keyword successfully",
  "data": {
    "items": [
      {
        "article_id": 1,
        "title": "Artificial Intelligence in Scientific Research",
        "doi": "10.xxxx/example",
        "publication_year": 2025,
        "journal": {
          "journal_id": 1,
          "display_name": "Nature"
        },
        "citations_count": 120
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 125
    }
  }
}
```

---

## Branch gợi ý

```txt
feature/keyword-page
```

---

## Commit gợi ý

```txt
feat(keywords): build keyword list and related articles page
```

---

## Ghi chú quan trọng

Keyword không chỉ là CRUD dữ liệu đơn giản. Đây là một hướng khám phá nội dung nghiên cứu.

Vì vậy, danh sách keyword nên ưu tiên sort theo **độ phổ biến**, tức là số lượng article liên quan cao nhất, để người dùng dễ nhìn ra các xu hướng nghiên cứu nổi bật.
