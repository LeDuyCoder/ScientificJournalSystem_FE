# FRONTEND STRUCTURE REVIEW GUIDE

> Dành cho team Frontend dự án **Scientific Journal Publication Trend Tracking System**.  
> Sau khi mỗi thành viên vibe code xong một feature, hãy dùng file này để tự check cấu trúc trước, sau đó đưa file này kèm code cho AI agent review lại.

---

## 1. Mục đích của file này

File này dùng để thống nhất cách tổ chức code Frontend, tránh tình trạng mỗi thành viên code một kiểu.

Sau khi code xong, thành viên cần dùng file này để kiểm tra:

- File có đặt đúng thư mục không.
- Component có bị quá dài hoặc ôm quá nhiều logic không.
- API/service/hook/page có tách đúng vai trò không.
- Code có dùng chung được không hay bị lặp lại.
- Có làm sai cấu trúc chuẩn của dự án không.
- Có thể nhờ AI agent review lại dựa trên checklist này.

---

## 2. Cấu trúc chuẩn của dự án

Cấu trúc đề xuất:

```txt
src/
├── app/
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── routePaths.js
│   │
│   ├── providers/
│   │   └── AppProvider.jsx
│   │
│   └── store/
│       └── authStore.js
│
├── features/
│   ├── auth/
│   ├── journals/
│   ├── publishers/
│   ├── subject-areas/
│   ├── subject-categories/
│   ├── articles/
│   ├── rankings/
│   └── users/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   └── utils/
│
├── assets/
├── App.jsx
├── main.jsx
├── App.css
└── index.css
```

---

## 3. Ý nghĩa từng thư mục

### 3.1. `src/app/`

Thư mục `app` chứa phần khung lõi của toàn bộ ứng dụng.

Dùng cho:

- Layout tổng.
- Router chính.
- Protected route.
- Provider tổng.
- Global store như auth store.
- Cấu hình cấp app.

Không dùng `app` để chứa:

- Component riêng của một feature.
- API riêng của một feature.
- Form CRUD của một module cụ thể.
- Logic nghiệp vụ của Journal, Article, Subject Area...

Ví dụ đúng:

```txt
src/app/routes/AppRoutes.jsx
src/app/routes/ProtectedRoute.jsx
src/app/layouts/AdminLayout.jsx
src/app/store/authStore.js
```

Ví dụ sai:

```txt
src/app/SubjectAreaTable.jsx
src/app/journalApi.js
src/app/LoginForm.jsx
```

---

### 3.2. `src/features/`

Thư mục `features` chứa các chức năng chính của hệ thống.

Mỗi module nghiệp vụ nên có một folder riêng:

```txt
features/
├── auth/
├── journals/
├── publishers/
├── subject-areas/
├── subject-categories/
├── articles/
├── rankings/
└── users/
```

Mỗi feature nên có cấu trúc thống nhất:

```txt
features/ten-feature/
├── api/
│   └── featureApi.js
├── components/
│   ├── FeatureForm.jsx
│   └── FeatureTable.jsx
├── hooks/
│   └── useFeatures.js
├── pages/
│   ├── FeatureListPage.jsx
│   ├── FeatureCreatePage.jsx
│   └── FeatureEditPage.jsx
├── services/
│   └── featureService.js
├── validations/
│   └── featureValidation.js
└── index.js
```

Không phải feature nào cũng bắt buộc có đủ tất cả thư mục. Nhưng nếu có phần nào thì nên đặt đúng vai trò.

---

### 3.3. `src/shared/`

Thư mục `shared` chứa code dùng chung cho nhiều feature.

Dùng cho:

- Button, Input, Modal, Table, Pagination.
- Loading, EmptyState, ConfirmDialog.
- Axios client.
- Format ngày tháng, format số liệu.
- Custom hook dùng chung.
- Style dùng chung.

Ví dụ:

```txt
shared/components/Button/Button.jsx
shared/components/Table/DataTable.jsx
shared/components/Loading/LoadingSpinner.jsx
shared/services/httpClient.js
shared/utils/formatDate.js
shared/hooks/useDebounce.js
```

Không dùng `shared` để chứa logic quá riêng của một feature.

Ví dụ sai:

```txt
shared/components/SubjectAreaForm.jsx
shared/services/journalRankingService.js
shared/utils/validateLoginPassword.js
```

Nếu một file chỉ dùng cho `subject-areas`, hãy để trong `features/subject-areas/`.

---

### 3.4. `src/assets/`

Dùng để chứa tài nguyên tĩnh:

```txt
assets/
├── images/
├── icons/
├── logos/
└── illustrations/
```

Không nên để ảnh lung tung ở root hoặc trong `src/` nếu ảnh đó là tài nguyên tĩnh dùng lâu dài.

---

## 4. Quy tắc đặt tên file

### 4.1. Component

Component dùng PascalCase:

```txt
LoginForm.jsx
SubjectAreaTable.jsx
JournalCard.jsx
AdminSidebar.jsx
```

Không dùng:

```txt
loginform.jsx
subject_area_table.jsx
journal-card.jsx
```

---

### 4.2. Hook

Custom hook bắt đầu bằng `use`:

```txt
useAuth.js
useSubjectAreas.js
useDebounce.js
useJournals.js
```

---

### 4.3. API file

File gọi API đặt theo tên feature:

```txt
authApi.js
subjectAreaApi.js
journalApi.js
publisherApi.js
```

---

### 4.4. Service file

Service xử lý logic nghiệp vụ nhẹ, format dữ liệu, điều phối API:

```txt
authService.js
subjectAreaService.js
journalService.js
```

---

### 4.5. Page

Page là màn hình được route tới:

```txt
LoginPage.jsx
DashboardPage.jsx
SubjectAreaListPage.jsx
SubjectAreaCreatePage.jsx
SubjectAreaEditPage.jsx
```

Không đặt page quá chung chung:

```txt
List.jsx
Create.jsx
Edit.jsx
Page.jsx
```

---

## 5. Quy tắc tách vai trò file

### 5.1. Page làm gì?

Page dùng để ghép layout của một màn hình.

Page được phép:

- Gọi custom hook.
- Render component chính.
- Truyền props xuống component con.
- Điều hướng bằng router.
- Hiển thị loading/error ở cấp page.

Page không nên:

- Viết quá nhiều JSX chi tiết.
- Gọi Axios trực tiếp.
- Chứa logic validate form phức tạp.
- Chứa nhiều hàm xử lý dữ liệu dài.

Ví dụ đúng:

```jsx
import SubjectAreaTable from "../components/SubjectAreaTable";
import { useSubjectAreas } from "../hooks/useSubjectAreas";

export default function SubjectAreaListPage() {
  const { subjectAreas, loading, error } = useSubjectAreas();

  return (
    <SubjectAreaTable
      data={subjectAreas}
      loading={loading}
      error={error}
    />
  );
}
```

---

### 5.2. Component làm gì?

Component dùng để hiển thị UI hoặc nhận input từ người dùng.

Component được phép:

- Nhận props.
- Hiển thị dữ liệu.
- Gọi event handler từ props.
- Quản lý state nhỏ chỉ phục vụ UI.

Component không nên:

- Gọi API trực tiếp.
- Biết quá nhiều về route.
- Biết token/user global nếu không cần.
- Chứa logic nghiệp vụ dài.

Ví dụ đúng:

```jsx
export default function SubjectAreaTable({ data, loading, onEdit, onDelete }) {
  if (loading) return <p>Loading...</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.subject_area_id}>
            <td>{item.display_name}</td>
            <td>{item.description}</td>
            <td>
              <button onClick={() => onEdit(item)}>Edit</button>
              <button onClick={() => onDelete(item.subject_area_id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### 5.3. Hook làm gì?

Hook dùng để gom logic React của một feature.

Hook được phép:

- Gọi service.
- Quản lý loading/error/data.
- Gom logic fetch data.
- Gom logic submit form.
- Dùng `useEffect`, `useState`, `useNavigate`.

Ví dụ:

```jsx
import { useEffect, useState } from "react";
import subjectAreaService from "../services/subjectAreaService";

export function useSubjectAreas() {
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchSubjectAreas() {
    try {
      setLoading(true);
      const data = await subjectAreaService.getAll();
      setSubjectAreas(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to load subject areas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubjectAreas();
  }, []);

  return {
    subjectAreas,
    loading,
    error,
    refetch: fetchSubjectAreas,
  };
}
```

---

### 5.4. API file làm gì?

API file chỉ nên gọi HTTP, không xử lý UI.

Ví dụ:

```js
import httpClient from "../../../shared/services/httpClient";

const subjectAreaApi = {
  getAll(params) {
    return httpClient.get("/subject-areas", { params });
  },

  getById(id) {
    return httpClient.get(`/subject-areas/${id}`);
  },

  create(payload) {
    return httpClient.post("/subject-areas", payload);
  },

  update(id, payload) {
    return httpClient.put(`/subject-areas/${id}`, payload);
  },

  remove(id) {
    return httpClient.delete(`/subject-areas/${id}`);
  },
};

export default subjectAreaApi;
```

Không viết kiểu này trong component:

```jsx
axios.get("http://localhost:8082/api/v1/subject-areas");
```

---

### 5.5. Service làm gì?

Service xử lý logic nhẹ giữa API và UI.

Ví dụ:

```js
import subjectAreaApi from "../api/subjectAreaApi";

const subjectAreaService = {
  async getAll(params) {
    const response = await subjectAreaApi.getAll(params);
    return response.data.data;
  },

  async create(payload) {
    const response = await subjectAreaApi.create(payload);
    return response.data.data;
  },
};

export default subjectAreaService;
```

Không để service chứa JSX hoặc logic giao diện.

---

## 6. Chuẩn gọi API

Tất cả API phải đi qua `shared/services/httpClient.js`.

Ví dụ:

```js
import axios from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default httpClient;
```

File `.env.example` nên có:

```env
VITE_API_BASE_URL=http://localhost:8082/api/v1
```

Quy tắc:

- Không hard-code base URL trong từng component.
- Không commit file `.env`.
- Có thể commit `.env.example`.
- Token nên được gắn ở interceptor.
- Nếu API trả lỗi thống nhất từ BE, nên xử lý lỗi ở service hoặc hook.

---

## 7. Chuẩn route

Route chính nên đặt trong:

```txt
src/app/routes/AppRoutes.jsx
```

Ví dụ:

```jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage";
import SubjectAreaListPage from "../../features/subject-areas/pages/SubjectAreaListPage";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="subject-areas" element={<SubjectAreaListPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/subject-areas" replace />} />
    </Routes>
  );
}
```

`App.jsx` chỉ nên gọn:

```jsx
import AppRoutes from "./app/routes/AppRoutes";

export default function App() {
  return <AppRoutes />;
}
```

Không nên nhét toàn bộ route, layout, page và logic vào `App.jsx`.

---

## 8. Chuẩn Auth

Auth nên gồm:

```txt
features/auth/
├── api/
│   └── authApi.js
├── components/
│   └── LoginForm.jsx
├── hooks/
│   └── useAuth.js
├── pages/
│   └── LoginPage.jsx
├── services/
│   └── authService.js
└── validations/
    └── authValidation.js
```

Global auth store nên để:

```txt
src/app/store/authStore.js
```

Ví dụ store:

```js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),

  loginSuccess: ({ user, accessToken }) => {
    localStorage.setItem("accessToken", accessToken);

    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));
```

---

## 9. Chuẩn cho feature CRUD

Khi làm một CRUD mới, ví dụ `Subject Area`, nên tạo cấu trúc:

```txt
features/subject-areas/
├── api/
│   └── subjectAreaApi.js
├── components/
│   ├── SubjectAreaForm.jsx
│   └── SubjectAreaTable.jsx
├── hooks/
│   ├── useSubjectAreas.js
│   └── useSubjectAreaForm.js
├── pages/
│   ├── SubjectAreaListPage.jsx
│   ├── SubjectAreaCreatePage.jsx
│   └── SubjectAreaEditPage.jsx
├── services/
│   └── subjectAreaService.js
├── validations/
│   └── subjectAreaValidation.js
└── index.js
```

Luồng đúng:

```txt
Page
 ↓
Hook
 ↓
Service
 ↓
API
 ↓
httpClient
 ↓
Backend
```

Không đi tắt kiểu:

```txt
Page
 ↓
Axios trực tiếp
 ↓
Backend
```

---

## 10. Checklist tự review sau khi vibe code

Sau khi code xong, thành viên tự tick checklist này.

### 10.1. Cấu trúc thư mục

- [ ] Feature mới nằm trong `src/features/ten-feature/`.
- [ ] Page nằm trong `pages/`.
- [ ] Component riêng của feature nằm trong `components/`.
- [ ] API nằm trong `api/`.
- [ ] Service nằm trong `services/`.
- [ ] Hook nằm trong `hooks/`.
- [ ] Validation nằm trong `validations/` nếu có.
- [ ] Component dùng chung mới đưa vào `shared/components/`.
- [ ] Không tạo file lung tung trực tiếp trong `src/` nếu không cần.

---

### 10.2. Component

- [ ] Component có tên PascalCase.
- [ ] Component không gọi API trực tiếp.
- [ ] Component không quá dài.
- [ ] Component nhận dữ liệu qua props.
- [ ] Component không chứa quá nhiều logic nghiệp vụ.
- [ ] Component có xử lý trạng thái rỗng/loading/error nếu cần.

---

### 10.3. Page

- [ ] Page chỉ đóng vai trò ghép màn hình.
- [ ] Page không chứa quá nhiều JSX chi tiết.
- [ ] Page không gọi Axios trực tiếp.
- [ ] Page dùng hook/service phù hợp.
- [ ] Tên page rõ nghĩa, ví dụ `JournalListPage.jsx`.

---

### 10.4. API và Service

- [ ] API file chỉ gọi HTTP.
- [ ] API dùng `httpClient`, không dùng `axios` trực tiếp.
- [ ] Không hard-code `localhost` trong API file.
- [ ] Service xử lý dữ liệu trả về từ API.
- [ ] Service không chứa JSX.
- [ ] Các endpoint đúng với BE đã thống nhất.

---

### 10.5. Hook

- [ ] Hook bắt đầu bằng `use`.
- [ ] Hook gom logic fetch/submit rõ ràng.
- [ ] Hook có xử lý `loading`.
- [ ] Hook có xử lý `error`.
- [ ] Hook không bị quá dài.
- [ ] Hook không làm thay vai trò của service.

---

### 10.6. Route

- [ ] Route được khai báo trong `app/routes/`.
- [ ] Page mới đã được add route.
- [ ] Route cần đăng nhập đã bọc `ProtectedRoute`.
- [ ] Không nhét toàn bộ route vào `App.jsx`.
- [ ] Path đặt rõ nghĩa và nhất quán.

---

### 10.7. Env và bảo mật

- [ ] Không commit file `.env`.
- [ ] Có `.env.example`.
- [ ] API base URL lấy từ `import.meta.env.VITE_API_BASE_URL`.
- [ ] Không hard-code token.
- [ ] Không commit tài khoản, mật khẩu, secret.
- [ ] Không log token/user nhạy cảm ra console.

---

### 10.8. Code quality

- [ ] Chạy được `npm run dev`.
- [ ] Chạy được `npm run build`.
- [ ] Chạy được `npm run lint` nếu project có script lint.
- [ ] Không còn console.log debug thừa.
- [ ] Không còn import không dùng.
- [ ] Không còn file rỗng không cần thiết.
- [ ] Không duplicate component/service quá nhiều.
- [ ] Không đặt tên file/tên biến mơ hồ.

---

## 11. Checklist cho AI agent review

Khi dùng AI agent để review, yêu cầu AI kiểm tra theo các nhóm sau:

- Cấu trúc folder.
- Cách đặt tên file.
- Vai trò của Page/Component/Hook/Service/API.
- Luồng gọi API.
- Cách dùng route.
- Cách dùng store.
- Cách xử lý loading/error.
- Có hard-code API URL/token không.
- Có duplicate code không.
- Có file nào nên chuyển sang `shared/` không.
- Có file nào đang đặt sai feature không.
- Có nguy cơ conflict với BE API không.
- Có điểm nào nên refactor trước khi merge không.

---

## 12. Prompt mẫu để đưa cho AI agent review toàn bộ code

Copy prompt này vào AI agent:

```txt
Bạn là Senior Frontend Reviewer cho dự án React + Vite tên Scientific Journal Publication Trend Tracking System.

Hãy review code hiện tại dựa trên file FRONTEND_STRUCTURE_REVIEW_GUIDE.md này.

Yêu cầu review:
1. Kiểm tra cấu trúc thư mục có đúng chuẩn không.
2. Kiểm tra file nào đang đặt sai vị trí.
3. Kiểm tra Page, Component, Hook, Service, API đã đúng vai trò chưa.
4. Kiểm tra có component nào gọi API trực tiếp không.
5. Kiểm tra có hard-code API URL, token, secret, localhost không.
6. Kiểm tra route có được tách đúng trong app/routes không.
7. Kiểm tra auth/protected route/store có hợp lý không.
8. Kiểm tra code có duplicate hoặc quá dài không.
9. Kiểm tra naming convention.
10. Đề xuất refactor cụ thể theo từng file.

Output mong muốn:
- Tổng quan: Đạt / Chưa đạt.
- Danh sách vấn đề theo mức độ: Critical, Major, Minor.
- Với mỗi vấn đề, ghi rõ:
  - File liên quan.
  - Vấn đề là gì.
  - Vì sao sai hoặc chưa tối ưu.
  - Cách sửa cụ thể.
- Cuối cùng cho checklist những việc cần sửa trước khi merge.
```

---

## 13. Prompt mẫu để review một feature cụ thể

Dùng khi một thành viên vừa code xong một feature, ví dụ `subject-areas`.

```txt
Bạn là Senior Frontend Reviewer.

Hãy review riêng feature sau: src/features/subject-areas

Dựa trên file FRONTEND_STRUCTURE_REVIEW_GUIDE.md, hãy kiểm tra:
1. Cấu trúc feature có đúng không.
2. API, service, hook, page, component có tách đúng vai trò không.
3. Có gọi API trực tiếp trong component/page không.
4. Có hard-code URL không.
5. Có xử lý loading/error/empty state không.
6. Có duplicate code không.
7. Có file nào nên chuyển sang shared không.
8. Có vấn đề gì khi tích hợp với Backend API không.

Output:
- Feature này đạt bao nhiêu phần trăm so với chuẩn.
- Những điểm đúng.
- Những điểm cần sửa.
- Đề xuất cấu trúc file sau khi refactor.
- Đưa ra patch hoặc code mẫu nếu cần.
```

---

## 14. Prompt mẫu để review trước khi tạo Pull Request

```txt
Bạn là Senior Frontend Reviewer.

Tôi chuẩn bị tạo Pull Request. Hãy review toàn bộ thay đổi hiện tại theo checklist sau:

1. Có file nào đặt sai thư mục không?
2. Có phá vỡ cấu trúc app/features/shared không?
3. Có hard-code API URL, token, secret không?
4. Có import thừa hoặc file rỗng không?
5. Có component/page quá dài không?
6. Có duplicate code không?
7. Có route nào sai hoặc thiếu ProtectedRoute không?
8. Có dùng đúng httpClient không?
9. Có ảnh hưởng đến các feature khác không?
10. Có cần cập nhật README hoặc .env.example không?

Hãy trả lời theo format:
- Có thể merge không: Có / Không.
- Lý do.
- Danh sách lỗi bắt buộc sửa trước khi merge.
- Danh sách góp ý có thể sửa sau.
```

---

## 15. Quy tắc khi thêm feature mới

Khi thêm feature mới, ví dụ `journals`, làm theo thứ tự:

### Bước 1: Tạo folder feature

```txt
features/journals/
├── api/
├── components/
├── hooks/
├── pages/
├── services/
├── validations/
└── index.js
```

### Bước 2: Tạo API file

```txt
features/journals/api/journalApi.js
```

### Bước 3: Tạo service

```txt
features/journals/services/journalService.js
```

### Bước 4: Tạo hook

```txt
features/journals/hooks/useJournals.js
```

### Bước 5: Tạo component

```txt
features/journals/components/JournalTable.jsx
features/journals/components/JournalForm.jsx
```

### Bước 6: Tạo page

```txt
features/journals/pages/JournalListPage.jsx
features/journals/pages/JournalCreatePage.jsx
features/journals/pages/JournalEditPage.jsx
```

### Bước 7: Add route

```txt
app/routes/AppRoutes.jsx
```

### Bước 8: Chạy kiểm tra

```bash
npm run dev
npm run build
npm run lint
```

---

## 16. Quy tắc import

Nên import theo hướng từ ngoài vào trong:

```txt
page -> hook -> service -> api -> httpClient
```

Không nên để feature này import sâu vào feature khác.

Ví dụ không nên:

```js
import JournalForm from "../../journals/components/JournalForm";
```

Nếu cần dùng chung, chuyển component đó vào `shared/components/`.

---

## 17. Quy tắc tránh duplicate code

Nếu cùng một đoạn code xuất hiện từ 2 lần trở lên, cân nhắc đưa vào:

- `shared/components/` nếu là UI.
- `shared/hooks/` nếu là hook.
- `shared/utils/` nếu là hàm xử lý dữ liệu.
- `shared/services/` nếu là service nền tảng như HTTP client.

Ví dụ nên đưa vào shared:

```txt
Pagination
SearchInput
ConfirmDeleteModal
LoadingSpinner
EmptyState
formatDate
formatNumber
useDebounce
```

Không nên mỗi feature tự viết lại một bản `Pagination`.

---

## 18. Quy tắc style

Tạm thời ưu tiên:

- CSS module hoặc CSS thường theo component.
- Không viết style inline quá nhiều.
- Không để class name quá mơ hồ.
- Không copy CSS trùng lặp giữa nhiều component.
- Style global để trong `shared/styles/` hoặc `index.css`.

Ví dụ:

```txt
shared/styles/variables.css
shared/styles/global.css
features/subject-areas/components/SubjectAreaTable.css
```

---

## 19. Những lỗi thường gặp sau khi vibe code

### Lỗi 1: Code hết vào `App.jsx`

Sai vì `App.jsx` chỉ nên là entry component.

Nên sửa:

```jsx
import AppRoutes from "./app/routes/AppRoutes";

export default function App() {
  return <AppRoutes />;
}
```

---

### Lỗi 2: Component gọi API trực tiếp

Sai:

```jsx
useEffect(() => {
  axios.get("http://localhost:8082/api/v1/subject-areas");
}, []);
```

Đúng:

```jsx
const { subjectAreas, loading, error } = useSubjectAreas();
```

---

### Lỗi 3: Hard-code base URL

Sai:

```js
axios.get("http://localhost:8082/api/v1/journals");
```

Đúng:

```js
httpClient.get("/journals");
```

---

### Lỗi 4: Mỗi feature tự viết lại Table

Nếu table có thể dùng chung, nên tạo:

```txt
shared/components/Table/DataTable.jsx
```

---

### Lỗi 5: Logic form quá dài trong Page

Nếu form dài, tách ra:

```txt
components/SubjectAreaForm.jsx
hooks/useSubjectAreaForm.js
validations/subjectAreaValidation.js
```

---

## 20. Definition of Done cho một feature

Một feature chỉ được xem là xong khi:

- [ ] Có cấu trúc đúng trong `src/features/`.
- [ ] Có API/service/hook/page/component tách rõ.
- [ ] Không gọi Axios trực tiếp trong component/page.
- [ ] Không hard-code API base URL.
- [ ] Có loading/error/empty state.
- [ ] Có route truy cập được.
- [ ] Có xử lý trường hợp API lỗi.
- [ ] Build không lỗi.
- [ ] Lint không lỗi nghiêm trọng.
- [ ] Đã dùng AI agent review theo prompt ở trên.
- [ ] Đã sửa các lỗi Critical và Major trước khi merge.

---

## 21. Gợi ý thứ tự làm cho team

Nên làm theo thứ tự:

```txt
1. shared/services/httpClient.js
2. app/routes/AppRoutes.jsx
3. app/routes/ProtectedRoute.jsx
4. app/layouts/AuthLayout.jsx
5. app/layouts/AdminLayout.jsx
6. features/auth
7. features/subject-areas
8. features/subject-categories
9. features/publishers
10. features/journals
11. features/rankings
12. features/articles
13. features/users
```

Lý do:

- Auth cần làm trước để có login/protected route.
- Subject Area đơn giản, phù hợp làm CRUD mẫu.
- Subject Category phụ thuộc Subject Area.
- Journal, Ranking, Article phức tạp hơn nên làm sau.
- User/role có thể làm sau khi auth ổn.

---

## 22. Ghi chú cho reviewer

Khi review code của thành viên khác, không chỉ xem giao diện chạy được hay không.

Cần kiểm tra thêm:

- Code có dễ bảo trì không.
- File có đúng vị trí không.
- Sau này thêm feature khác có bị rối không.
- Có làm sai kiến trúc chung không.
- Có làm ảnh hưởng đến thành viên khác không.
- Có tuân thủ luồng `Page -> Hook -> Service -> API -> httpClient` không.

---

## 23. Kết luận

Mục tiêu của cấu trúc này không phải làm project phức tạp hơn, mà là để team code nhanh nhưng vẫn kiểm soát được chất lượng.

Mỗi thành viên có thể vibe code, nhưng trước khi merge cần dùng file này để kéo code về đúng chuẩn chung.

Nguyên tắc quan trọng nhất:

```txt
Code chạy được là chưa đủ.
Code phải đúng cấu trúc để cả team còn phát triển tiếp được.
```
