export const homeAbout = [
  {
    id: 1,
    cover: "https://img.icons8.com/dotty/80/000000/storytelling.png",
    title: "Khóa Học Chuyên Biệt",
    desc: "Nội dung được biên soạn dành riêng cho người khiếm thính, tích hợp ngôn ngữ ký hiệu và phụ đề chi tiết.",
  },
  {
    id: 1,
    cover: "https://img.icons8.com/ios/80/000000/diploma.png",
    title: "Chứng Chỉ Uy Tín",
    desc: "Nhận chứng chỉ sau khi hoàn thành khóa học, mở ra nhiều cơ hội việc làm và phát triển bản thân.",
  },
  {
    id: 1,
    cover: "https://img.icons8.com/ios/80/000000/athlete.png",
    title: "Giảng Viên Đồng Hành",
    desc: "Học hỏi từ các chuyên gia đầu ngành, những người luôn thấu hiểu và sẵn sàng hỗ trợ bạn trên con đường học vấn.",
  },
]
export const awrapper = [
  {
    cover: "https://img.icons8.com/external-yogi-aprelliyanto-basic-outline-yogi-aprelliyanto/80/ffffff/external-graduation-education-yogi-aprelliyanto-basic-outline-yogi-aprelliyanto.png",
    data: "100+",
    title: "HỌC VIÊN ĐÁNH GIÁ TỐT",
  },

  {
    cover: "https://img.icons8.com/ios/80/ffffff/athlete.png",
    data: "15+",
    title: "GIẢNG VIÊN TẬN TÂM",
  },
  {
    cover: "https://img.icons8.com/external-outline-icons-maxicons/80/ffffff/external-calender-insurance-outline-outline-icons-maxicons.png",
    data: "200+",
    title: "BÀI GIẢNG CHUYÊN SÂU",
  },
  {
    cover: "https://img.icons8.com/ios/80/ffffff/macbook-idea--v3.png",
    data: "30+",
    title: "KHÓA HỌC ĐA DẠNG",
  },
]
export const courses = [
  {
    id: 1,
    cover: "/images/courses/c1.png",
    name: "Ngôn ngữ Ký hiệu Cho Người Mới Bắt Đầu",
    totalLectures: 20,
    totalTime: 30,
    trainerName: "Trần Minh Anh",
    trainerJob: "Chuyên gia Ngôn ngữ Ký hiệu",
    tcover: "/images/team/t1.webp",
    priceAll: 500000,
    pricePer: "Toàn khóa",
    categorySlug: "ngon-ngu",
    description: "Khóa học này cung cấp một nền tảng vững chắc về Ngôn ngữ Ký hiệu, bao gồm các ký hiệu cơ bản, cấu trúc ngữ pháp và kỹ năng giao tiếp trong các tình huống hàng ngày. Học viên sẽ được thực hành qua các bài tập tương tác và video hướng dẫn chi tiết.",
    rating: 4.8,
    defaultEnrolled: true,
    reviews: [
      {
        id: 1,
        name: "NGUYỄN VĂN AN",
        post: "Học viên",
        desc: "Khóa học rất hữu ích! Giảng viên nhiệt tình và nội dung dễ hiểu. Tôi đã tự tin hơn rất nhiều khi giao tiếp bằng ngôn ngữ ký hiệu.",
        cover: "/images/testo/t1.webp",
        rating: 5,
      },
      {
        id: 2,
        name: "TRẦN THỊ BÌNH",
        post: "Học viên",
        desc: "Một trải nghiệm học tập tuyệt vời. Tôi đặc biệt thích các bài tập thực hành, chúng giúp tôi nhớ ký hiệu nhanh hơn.",
        cover: "/images/testo/t2.webp",
        rating: 4.5,
      },
    ],
    sections: [
      {
        title: "Chương 1: Giới thiệu",
        lectures: [
          {
            title: "Bài 1: Bảng chữ cái ký hiệu",
            videoUrl: "https://www.youtube.com/embed/0kKvhyjhrN4?si=aix9PY9rfebJYQit",
            assignment: {
              id: 1,
              title: "Bài tập: Thực hành bảng chữ cái ký hiệu",
              description: "Quay một video ngắn (1-3 phút) trong đó bạn trình bày trọn vẹn bảng chữ cái ký hiệu. Hãy đảm bảo video rõ nét và nhìn thấy toàn bộ cử chỉ tay.",
              dueDate: "2024-07-31",
              maxScore: 10,
              submissions: [], // Danh sách bài nộp của học viên
              comments: [], // Bình luận của học viên
              score: null, // Điểm sẽ được giáo viên cập nhật
              attachments: [
                {
                  name: "Sample_decision_table_test.xlsx",
                  url: "#"
                },
                {
                  name: "Sample_Test Cases.xlsx",
                  url: "#"
                }
              ]
            }
          },
          { title: "Bài 2: Các câu chào hỏi thông dụng", videoUrl: "https://www.youtube.com/embed/GZWQ6I-4x2s?si=ETpZgfyk0MU2isy4" }
        ]
      },
      {
        title: "Chương 2: Giao tiếp cơ bản",
        lectures: [
          { title: "Bài 3: Giới thiệu bản thân", videoUrl: "https://www.youtube.com/embed/S2tovL9-eng" },
          { title: "Bài 4: Đặt câu hỏi đơn giản", videoUrl: "https://www.youtube.com/embed/S2tovL9-eng" }
        ]
      }
    ]
  },
  {
    id: 2,
    cover: "/images/courses/c2.png",
    name: "Giao tiếp Chuyên nghiệp Nơi Công sở",
    totalLectures: 15,
    totalTime: 25,
    trainerName: "Nguyễn Thu Hà",
    trainerJob: "Chuyên gia Kỹ năng mềm",
    tcover: "/images/team/t2.webp",
    priceAll: 450000,
    pricePer: "Toàn khóa",
    categorySlug: "ky-nang-mem",
    description: "Phát triển kỹ năng giao tiếp hiệu quả trong môi trường làm việc chuyên nghiệp. Khóa học tập trung vào cách trình bày ý tưởng, lắng nghe tích cực và xây dựng mối quan hệ tốt với đồng nghiệp thông qua các phương pháp phù hợp với người khiếm thính.",
    rating: 4.7,
    defaultEnrolled: true,
    sections: [
      {
        title: "Chương 1: Kỹ năng lắng nghe",
        lectures: [
          { title: "Bài 1: Lắng nghe chủ động", videoUrl: "https://www.youtube.com/embed/S2tovL9-eng" }
        ]
      }
    ]
  },
  {
    id: 3,
    cover: "/images/courses/c3.png",
    name: "Tin học Văn phòng Toàn diện",
    totalLectures: 30,
    totalTime: 40,
    trainerName: "Lê Văn Đức",
    trainerJob: "Giảng viên Tin học",
    tcover: "/images/team/t3.webp",
    priceAll: 600000,
    pricePer: "Toàn khóa",
    categorySlug: "cong-nghe-thong-tin",
    description: "Nắm vững các công cụ tin học văn phòng thiết yếu như Word, Excel, PowerPoint với các bài giảng có phụ đề và hướng dẫn trực quan, giúp bạn tự tin xử lý các công việc văn phòng hàng ngày.",
    rating: 4.9,
    sections: [
      {
        title: "Chương 1: Microsoft Word",
        lectures: [
          { title: "Bài 1: Định dạng văn bản", videoUrl: "https://www.youtube.com/embed/S2tovL9-eng" }
        ]
      }
    ]
  },
  {
    id: 4,
    cover: "/images/courses/c4.png",
    name: "Nhập môn Lập trình Web (HTML, CSS, JS)",
    totalLectures: 40,
    totalTime: 60,
    trainerName: "Phạm Hồng Phúc",
    trainerJob: "Lập trình viên Full-stack",
    tcover: "/images/team/t4.webp",
    priceAll: 800000,
    pricePer: "Toàn khóa",
    categorySlug: "thiet-ke-ui-ux",
    description: "Khóa học này được thiết kế đặc biệt để giới thiệu về thế giới lập trình web cho người khiếm thính. Bạn sẽ học các khái niệm cơ bản về HTML, CSS và JavaScript qua các ví dụ thực tế và dự án nhỏ.",
    rating: 3.3,
    isFavorite: true,
    sections: [
      {
        title: "Chương 1: Giới thiệu HTML",
        lectures: [
          { title: "Bài 1: Cấu trúc cơ bản", videoUrl: "https://www.youtube.com/embed/S2tovL9-eng" },
          { title: "Bài 2: Các thẻ thông dụng", videoUrl: "https://www.youtube.com/embed/S2tovL9-eng" }
        ]
      }
    ]
  },
  {
    id: 5,
    cover: "/images/courses/c5.png",
    name: "Xây dựng Thương hiệu trên Mạng xã hội",
    totalLectures: 25,
    totalTime: 35,
    trainerName: "Vũ Ngọc Mai",
    trainerJob: "Chuyên gia Marketing",
    tcover: "/images/team/t5.webp",
    priceAll: 700000,
    pricePer: "Toàn khóa",
    categorySlug: "marketing",
    description: "Học cách xây dựng và phát triển thương hiệu cá nhân hoặc doanh nghiệp trên các nền tảng mạng xã hội. Khóa học bao gồm các kỹ thuật sản xuất nội dung hình ảnh và video hấp dẫn, có phụ đề để tiếp cận rộng rãi.",
    rating: 4.6,
    sections: [
      {
        title: "Chương 1: Xây dựng thương hiệu",
        lectures: [
          { title: "Bài 1: Xác định đối tượng", videoUrl: "https://www.youtube.com/embed/S2tovL9-eng" }
        ]
      }
    ]
  },
  {
    id: 6,
    cover: "/images/courses/c6.png",
    name: "Nhiếp ảnh Cơ bản cho Người mới",
    totalLectures: 18,
    totalTime: 28,
    trainerName: "Hoàng Minh Tuấn",
    trainerJob: "Nhiếp ảnh gia",
    tcover: "/images/team/t6.webp",
    priceAll: 550000,
    pricePer: "Toàn khóa",
    categorySlug: "my-thuat-thiet-ke",
    description: "Khám phá các nguyên tắc cơ bản của nhiếp ảnh, từ bố cục, ánh sáng đến kỹ thuật chụp và hậu kỳ. Các bài giảng tập trung vào hướng dẫn bằng hình ảnh và ví dụ thực tế, giúp bạn dễ dàng nắm bắt.",
    rating: 4.8,
    sections: [
      {
        title: "Chương 1: Nguyên tắc cơ bản",
        lectures: [
          { title: "Bài 1: Bố cục và ánh sáng", videoUrl: "https://www.youtube.com/embed/S2tovL9-eng" }
        ]
      }
    ]
  },
  {
    id: 7,
    cover: "/images/courses/c7.png",
    name: "Quản lý Tài chính Cá nhân Thông minh",
    totalLectures: 12,
    totalTime: 20,
    trainerName: "Đặng Thị Lan",
    trainerJob: "Chuyên gia Tài chính",
    tcover: "/images/team/t7.webp",
    priceAll: 400000,
    pricePer: "Toàn khóa",
    categorySlug: "kinh-doanh",
    description: "Trang bị kiến thức và công cụ cần thiết để quản lý tài chính cá nhân một cách hiệu quả. Khóa học bao gồm cách lập ngân sách, tiết kiệm, đầu tư và lập kế hoạch cho tương lai tài chính của bạn.",
    rating: 4.9,
    sections: [
      {
        title: "Chương 1: Lập ngân sách",
        lectures: [
          { title: "Bài 1: Theo dõi chi tiêu", videoUrl: "https://www.youtube.com/embed/S2tovL9-eng" }
        ]
      }
    ]
  },
  {
    id: 8,
    cover: "/images/courses/c8.png",
    name: "Thiết kế UI/UX cho Sản phẩm Số",
    totalLectures: 35,
    totalTime: 55,
    trainerName: "Bùi Anh Dũng",
    trainerJob: "UI/UX Designer",
    tcover: "/images/team/t8.webp",
    priceAll: 900000,
    pricePer: "Toàn khóa",
    categorySlug: "thiet-ke-ui-ux",
    description: "Học cách tạo ra các sản phẩm kỹ thuật số đẹp mắt và dễ sử dụng. Khóa học này sẽ hướng dẫn bạn qua quy trình thiết kế UI/UX, từ nghiên cứu người dùng, tạo wireframe đến thiết kế giao diện hoàn chỉnh.",
    rating: 5.0,
    isFavorite: true,
    sections: [
      {
        title: "Chương 1: Giới thiệu UI/UX",
        lectures: [
          { title: "Bài 1: Quy trình thiết kế", videoUrl: "https://www.youtube.com/embed/S2tovL9-eng" }
        ]
      }
    ]
  },
  {
    id: 9,
    cover: "/images/courses/c9.png",
    name: "Khởi nghiệp Kinh doanh Online từ A-Z",
    totalLectures: 30,
    totalTime: 50,
    trainerName: "Ngô Thanh Trúc",
    trainerJob: "Doanh nhân",
    tcover: "/images/team/t1.webp",
    priceAll: 850000,
    pricePer: "Toàn khóa",
    categorySlug: "kinh-doanh",
    description: "Bắt đầu hành trình kinh doanh trực tuyến của riêng bạn. Khóa học cung cấp kiến thức toàn diện về việc lựa chọn sản phẩm, xây dựng cửa hàng, marketing và quản lý đơn hàng hiệu quả.",
    rating: 4.7,
    defaultEnrolled: true,
    sections: [
      {
        title: "Chương 1: Bắt đầu",
        lectures: [
          { title: "Bài 1: Lựa chọn sản phẩm", videoUrl: "https://www.youtube.com/embed/S2tovL9-eng" }
        ]
      }
    ]
  },
]
export const categories = [
  {
    cover: "/images/courses/online/o1.png",
    hoverCover: "/images/courses/online/o1.1.png",
    name: "Thiết Kế UI/UX",
    courseCount: "25 Khóa học",
    slug: "thiet-ke-ui-ux",
  },
  {
    cover: "/images/courses/online/o2.png",
    hoverCover: "/images/courses/online/o2.1.png",
    name: "Mỹ thuật & Thiết kế",
    courseCount: "25 Khóa học",
    slug: "my-thuat-thiet-ke",
  },
  {
    cover: "/images/courses/online/o3.png",
    hoverCover: "/images/courses/online/o3.1.png",
    name: "Khoa Học Máy Tính",
    courseCount: "10 Khóa học",
    slug: "khoa-hoc-may-tinh",
  },
  {
    cover: "/images/courses/online/o4.png",
    hoverCover: "/images/courses/online/o4.1.png",
    name: "Kỹ năng mềm",
    courseCount: "15 Khóa học",
    slug: "ky-nang-mem",
  },
  {
    cover: "/images/courses/online/o5.png",
    hoverCover: "/images/courses/online/o5.1.png",
    name: "Kỹ thuật phần mềm",
    courseCount: "30 Khóa học",
    slug: "ky-thuat-phan-mem",
  },
  {
    cover: "/images/courses/online/o6.png",
    hoverCover: "/images/courses/online/o6.1.png",
    name: "Công nghệ thông tin",
    courseCount: "60 Khóa học",
    slug: "cong-nghe-thong-tin",
  },
  {
    cover: "/images/courses/online/o7.png",
    hoverCover: "/images/courses/online/o7.1.png",
    name: "Sức Khỏe & Thể Chất",
    courseCount: "10 Khóa học",
    slug: "suc-khoe-the-chat",
  },
  {
    cover: "/images/courses/online/o8.png",
    hoverCover: "/images/courses/online/o8.1.png",
    name: "Marketing",
    courseCount: "30 Khóa học",
    slug: "marketing",
  },
  {
    cover: "/images/courses/online/o9.png",
    hoverCover: "/images/courses/online/o9.1.png",
    name: "Thiết kế đồ họa",
    courseCount: "80 Khóa học",
    slug: "thiet-ke-do-hoa",
  },
  {
    cover: "/images/courses/online/o10.png",
    hoverCover: "/images/courses/online/o10.1.png",
    name: "Âm Nhạc",
    courseCount: "120 Khóa học",
    slug: "am-nhac",
  },
  {
    cover: "/images/courses/online/o11.png",
    hoverCover: "/images/courses/online/o11.1.png",
    name: "Kinh doanh",
    courseCount: "17 Khóa học",
    slug: "kinh-doanh",
  },
  {
    cover: "/images/courses/online/o12.png",
    hoverCover: "/images/courses/online/o12.1.png",
    name: "Ngôn ngữ",
    courseCount: "17 Khóa học",
    slug: "ngon-ngu",
  },
]
export const testimonal = [
  {
    id: 1,
    name: "TRẦN MINH QUANG",
    post: "HỌC VIÊN KHÓA THIẾT KẾ ĐỒ HỌA",
    desc: "Nhờ có Eduseen, mình đã tự tin theo đuổi đam mê thiết kế. Các bài giảng có phụ đề chi tiết và giáo viên luôn hỗ trợ nhiệt tình, giúp mình vượt qua mọi khó khăn.",
    cover: "/images/testo/t1.webp",
    rating: 5,
  },
  {
    id: 2,
    name: "ĐOÀN QUANG HUY",
    post: "HỌC VIÊN KHÓA LẬP TRÌNH WEB",
    desc: "Nền tảng học tập tuyệt vời! Giao diện thân thiện, dễ sử dụng và đặc biệt là các khóa học được thiết kế rất trực quan, giúp người khiếm thính như mình tiếp thu dễ dàng.",
    cover: "/images/testo/t2.webp",
    rating: 5,
  },
  {
    id: 3,
    name: "LÊ HOÀNG PHÚC",
    post: "HỌC VIÊN KHÓA NGÔN NGỮ KÝ HIỆU",
    desc: "Eduseen đã kết nối mình với cộng đồng những người bạn tuyệt vời. Mình không chỉ học được kiến thức mà còn tìm thấy sự đồng cảm và sẻ chia.",
    cover: "/images/testo/t3.webp",
    rating: 4.5,
  },
]
export const blog = [
  {
    id: 1,
    type: "admin",
    date: "JUL. 16, 2025",
    title: "Tạo cơ hội sống độc lập cho người khiếm thính",
    desc: "Khám phá những cơ hội nghề nghiệp rộng mở sau khi hoàn thành các khóa học tại nền tảng của chúng tôi.",
    cover: "https://doanhnghiepvadautu.info.vn/Data/upload/images/khiemthinh1.jpg",
    url: "http://doanhnghiepvadautu.info.vn/tao-co-hoi-song-doc-lap-cho-nguoi-khiem-thinh.html",
  },
  {
    id: 2,
    type: "admin",
    date: "JUL. 25, 2025",
    title: "Deaf International Exchange Opportunities",
    desc: "Looking for an international experience that focuses on Deaf culture and/or sign language?",
    cover: "https://miusa.org/wp-content/uploads/2015/07/resize-HK-hero-image-two-people-signing-1-1024x320.jpg",
    url: "https://miusa.org/resource/tip-sheets/deafexchange/",
  },
  {
    id: 3,
    type: "user",
    date: "JUL. 15, 2025",
    title: "Câu Chuyện Truyền Cảm Hứng Từ Cựu Học Viên",
    desc: "Lắng nghe những chia sẻ chân thực từ các học viên đã thành công trên con đường sự nghiệp của riêng mình.",
    cover: "https://imagevietnam.vnanet.vn//MediaUpload/Org/2025/04/28/128-15-17-24.jpg",
    url: "https://vietnam.vnanet.vn/vietnamese/long-form/the-rieng-co-hoi-viec-lam-cho-nguoi-khiem-thinh-396604.html",
  },
]

export const notifications = [
  {
    id: 1,
    type: "assignment",
    title: "Bài tập mới được giao",
    message: "Bạn có bài tập mới trong khóa 'Ngôn ngữ Ký hiệu Cho Người Mới Bắt Đầu'",
    courseId: 1,
    courseName: "Ngôn ngữ Ký hiệu Cho Người Mới Bắt Đầu",
    timestamp: "2024-01-15T10:30:00Z",
    isRead: false,
    icon: "fa-clipboard-list",
    priority: "high"
  },
  {
    id: 2,
    type: "grade",
    title: "Điểm bài tập đã được cập nhật",
    message: "Bài tập 'Thực hành bảng chữ cái ký hiệu' đã được chấm điểm: 9/10",
    courseId: 1,
    courseName: "Ngôn ngữ Ký hiệu Cho Người Mới Bắt Đầu",
    timestamp: "2024-01-14T14:20:00Z",
    isRead: false,
    icon: "fa-star",
    priority: "medium",
    score: 9,
    maxScore: 10
  },
  {
    id: 3,
    type: "comment",
    title: "Bình luận mới từ giảng viên",
    message: "Trần Minh Anh đã trả lời bình luận của bạn trong bài 'Bảng chữ cái ký hiệu'",
    courseId: 1,
    courseName: "Ngôn ngữ Ký hiệu Cho Người Mới Bắt Đầu",
    timestamp: "2024-01-13T16:45:00Z",
    isRead: true,
    icon: "fa-comment",
    priority: "low",
    author: "Trần Minh Anh"
  },
  {
    id: 4,
    type: "course",
    title: "Khóa học mới được thêm",
    message: "Khóa học 'Thiết kế UI/UX nâng cao' đã được thêm vào danh sách của bạn",
    courseId: 8,
    courseName: "Thiết kế UI/UX cho Sản phẩm Số",
    timestamp: "2024-01-12T09:15:00Z",
    isRead: true,
    icon: "fa-book",
    priority: "medium"
  },
  {
    id: 5,
    type: "reminder",
    title: "Nhắc nhở hạn nộp bài",
    message: "Bài tập 'Thực hành bảng chữ cái ký hiệu' sẽ hết hạn vào ngày mai",
    courseId: 1,
    courseName: "Ngôn ngữ Ký hiệu Cho Người Mới Bắt Đầu",
    timestamp: "2024-01-11T08:00:00Z",
    isRead: false,
    icon: "fa-clock",
    priority: "high",
    dueDate: "2024-01-16T23:59:00Z"
  },
  {
    id: 6,
    type: "system",
    title: "Cập nhật hệ thống",
    message: "Hệ thống đã được cập nhật với các tính năng mới. Hãy khám phá ngay!",
    timestamp: "2024-01-10T12:00:00Z",
    isRead: true,
    icon: "fa-cog",
    priority: "low"
  }
]
