/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const dictionary = {
  vi: {
    // Header
    'search': 'Tìm kiếm',
    'trends': 'Xu hướng',
    'geography': 'Địa lý',
    'authors': 'Tác giả',
    'signIn': 'Đăng nhập',
    'signUp': 'Đăng ký miễn phí',
    'langName': 'Tiếng Việt',
    
    // Hero
    'badgeText': 'Dữ liệu từ OpenAlex · 200M+ bài báo',
    'headingPrefix': 'Khám phá xu hướng nghiên cứu khoa học ',
    'headingHighlight': 'theo thời gian thực',
    'subheading': 'Tìm kiếm bài báo, phân tích keyword đang nổi, theo dõi lĩnh vực bạn quan tâm — tất cả trong một nơi.',
    'ctaSearch': 'Bắt đầu tìm kiếm',
    'ctaTrends': 'Xem xu hướng',
    
    // Stats
    'papersValue': '2,400,000+',
    'papersLabel': 'BÀI BÁO (70+ TỈ)',
    'periodValue': '2019–2024',
    'periodLabel': '10 THÁNG / 5 NĂM',
    'keywordsValue': '48,000+',
    'keywordsLabel': 'KEYWORDS THEO DÕI',
    'freeValue': 'Miễn phí',
    'freeLabel': 'KHÔNG CẦN THÈ TÍN DỤNG',

    // Sandbox
    'sandboxTitle': 'THỨ TÌM KIẾM NGAY',
    'sandboxPlaceholder': 'Nhập keyword, tên tác giả, journal...',
    'searchBtn': 'Tìm',
    'tryNowLabel': 'THỬ NGAY:',
    'publications': 'Số bài báo',
    'growth': 'Tăng trưởng hàng năm',
    'topCenter': 'Trung tâm hàng đầu',
    'realData': 'Kết nối BE',
    'mockData': 'Dữ liệu mô phỏng',

    // Features Section
    'featuresSubtitle': 'TÍNH NĂNG',
    'featuresTitle': 'Tại sao dùng ResearchPulse?',
    'feature1Title': 'Tìm kiếm thông minh',
    'feature1Desc': 'Tìm kiếm nhanh chóng, lọc chính xác theo keyword, tác giả, và tạp chí hàng đầu toàn cầu.',
    'feature2Title': 'Phân tích xu hướng',
    'feature2Desc': 'Trực quan hoá tần suất nghiên cứu qua các biểu đồ, nhận diện các đề tài đang nóng.',
    'feature3Title': 'Giám sát & Cảnh báo',
    'feature3Desc': 'Theo dõi từ khoá yêu thích và nhận thông báo ngay khi có bài báo mới xuất bản.',
    'feature4Title': 'Thư viện cá nhân',
    'feature4Desc': 'Lưu trữ các bài báo, phân loại theo dự án, truy cập nhanh chóng mọi lúc mọi nơi.',
    'feature5Title': 'Báo cáo & Xuất dữ liệu',
    'feature5Desc': 'Trích xuất báo cáo phân tích, biểu đồ và trích dẫn theo nhiều định dạng chuẩn.',
    'feature6Title': 'Hoàn toàn miễn phí',
    'feature6Desc': 'Trải nghiệm đầy đủ tính năng cốt lõi của ResearchPulse mà không mất phí.',

    // How To Use
    'howToUseSubtitle': 'HƯỚNG DẪN',
    'howToUseTitle': 'Cách sử dụng',
    'howToUseDesc': 'Bốn bước để có insight về lĩnh vực nghiên cứu của bạn',
    'step1Title': 'Nhập keyword',
    'step1Desc': 'Gõ tên keyword muốn nghiên cứu — ví dụ "LLM", "computer vision"',
    'step2Title': 'Xem tổng quan',
    'step2Desc': 'Hệ thống vẽ trend chart, và danh sách bài báo liên tục cập nhật',
    'step3Title': 'Phân tích sâu',
    'step3Desc': 'So sánh keyword, xem paper detail, khám phá related topics',
    'step4Title': 'Lưu & theo dõi',
    'step4Desc': 'Bookmark bài hay, follow keyword, nhận thông báo bài mới',

    // Footer CTA
    'ctaHeading': 'Bắt đầu nghiên cứu thông minh hơn hôm nay',
    'ctaSubheading': 'Miễn phí, không cần thẻ tín dụng, có thể dùng ngay không cần đăng ký',
    'ctaTryNowBtn': 'Thử tìm kiếm ngay',
    'ctaCreateAccountBtn': 'Tạo tài khoản miễn phí',

    // Footer
    'footerCredit': 'Dữ liệu từ OpenAlex · SInt2801 Project · FPT University 2025',
    'aboutUs': 'Về chúng tôi',
    'api': 'API',
    'policy': 'Chính sách',
    'contact': 'Liên hệ',
  },
  en: {
    // Header
    'search': 'Search',
    'trends': 'Trends',
    'geography': 'Geography',
    'authors': 'Authors',
    'signIn': 'Sign In',
    'signUp': 'Sign Up Free',
    'langName': 'English',

    // Hero
    'badgeText': 'Data from OpenAlex · 250M+ papers',
    'headingPrefix': 'Discover Scientific Research Trends ',
    'headingHighlight': 'in Real-Time',
    'subheading': 'Search papers, analyze trending keywords, and track research areas — all in one place.',
    'ctaSearch': 'Start Searching',
    'ctaTrends': 'View Trends',

    // Stats
    'papersValue': '2.4M+',
    'papersLabel': '214M Papers',
    'periodValue': '2019–2024',
    'periodLabel': 'Time Period',
    'keywordsValue': '48K+',
    'keywordsLabel': 'Keywords Indexed',
    'freeValue': 'Free',
    'freeLabel': 'No Credit Card Required',

    // Sandbox
    'sandboxTitle': 'TRY SEARCHING NOW',
    'sandboxPlaceholder': 'Enter keyword, author name, journal...',
    'searchBtn': 'Search',
    'tryNowLabel': 'TRY NOW:',
    'publications': 'Publications',
    'growth': 'Annual Growth',
    'topCenter': 'Top Center',
    'realData': 'Live Backend',
    'mockData': 'Simulated',

    // Features Section
    'featuresSubtitle': 'FEATURES',
    'featuresTitle': 'Why use ResearchPulse?',
    'feature1Title': 'Smart Search',
    'feature1Desc': 'Quickly search, filter accurately by keywords, authors, and top journals worldwide.',
    'feature2Title': 'Trend Analysis',
    'feature2Desc': 'Visualize research frequencies with charts, identifying trending topics.',
    'feature3Title': 'Monitor & Alerts',
    'feature3Desc': 'Track favorite keywords and get notified immediately when new papers are published.',
    'feature4Title': 'Personal Library',
    'feature4Desc': 'Store papers, categorize by projects, and access quickly anytime, anywhere.',
    'feature5Title': 'Reports & Export',
    'feature5Desc': 'Extract analysis reports, charts, and citations in multiple standard formats.',
    'feature6Title': 'Completely Free',
    'feature6Desc': 'Experience all core ResearchPulse features without any subscription fee.',

    // How To Use
    'howToUseSubtitle': 'HOW TO USE',
    'howToUseTitle': 'How to Use',
    'howToUseDesc': 'Four steps to gain insight into your research area',
    'step1Title': 'Enter Keyword',
    'step1Desc': 'Type keyword you want to study — e.g. "LLM", "computer vision"',
    'step2Title': 'Overview',
    'step2Desc': 'System draws trend charts, and continuously updates paper lists',
    'step3Title': 'Deep Analysis',
    'step3Desc': 'Compare keywords, view paper details, discover related topics',
    'step4Title': 'Save & Track',
    'step4Desc': 'Bookmark great papers, follow keywords, receive new paper alerts',

    // Footer CTA
    'ctaHeading': 'Start researching smarter today',
    'ctaSubheading': 'Free, no credit card required, use it now without registration',
    'ctaTryNowBtn': 'Try searching now',
    'ctaCreateAccountBtn': 'Create free account',

    // Footer
    'footerCredit': 'Data from OpenAlex · SInt2801 Project · FPT University 2025',
    'aboutUs': 'About Us',
    'api': 'API',
    'policy': 'Policy',
    'contact': 'Contact',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('researchpulse_lang') || 'vi';
  });

  useEffect(() => {
    localStorage.setItem('researchpulse_lang', language);
  }, [language]);

  const t = (key) => {
    return dictionary[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
