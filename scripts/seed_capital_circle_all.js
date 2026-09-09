require("dotenv").config();
const mongoose = require("mongoose");
const News = require("../models/news.model");
const redis = require("../config/redis");

const articles = [
  {
    postTitle: "Kỷ luật là lợi thế lớn nhất của nhà đầu tư cá nhân",
    slug: "ky-luat-la-loi-the-lon-nhat-cua-nha-dau-tu-ca-nhan",
    category: "TƯ DUY ĐẦU TƯ",
    postHeading: "Trong một thế giới đầy biến động, không phải ai dự đoán đúng thị trường mới thành công, mà là người kiên trì với nguyên tắc của mình.",
    postAuthor: "Capital Circle",
    postDate: "07 Tháng 9, 2026",
    views: 15200,
    postImage: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80",
    postContent: `
      <h2>Kỷ luật: Vũ khí tối thượng của nhà đầu tư nhỏ lẻ</h2>
      <p>Thị trường tài chính luôn tràn ngập những thông tin gây nhiễu, biến động giá chóng mặt và những lời mời chào làm giàu nhanh chóng. Tuy nhiên, qua hàng thế kỷ phát triển của các thị trường từ chứng khoán, vàng đến crypto, một chân lý vẫn luôn đúng:</p>
      <blockquote>"Sự kiên nhẫn và kỷ luật tuân thủ hệ thống đầu tư là thứ tạo nên 90% thành công lâu dài, chứ không phải tài tiên tri hay may mắn nhất thời."</blockquote>
      
      <h3>3 nguyên tắc vàng xây dựng kỷ luật:</h3>
      <ul>
        <li><b>1. Định rõ quy tắc vào lệnh và chốt lời/cắt lỗ:</b> Đừng bao giờ mua một tài sản mà không biết trước mình sẽ làm gì nếu giá giảm 10% hay tăng 50%.</li>
        <li><b>2. Quản trị quy mô vị thế (Position Sizing):</b> Không bao giờ đặt cược quá 5-10% tổng tài sản vào một cơ hội rủi ro cao.</li>
        <li><b>3. Tách biệt cảm xúc khỏi quyết định:</b> Lập kế hoạch khi tâm trí bình tĩnh và thực thi đúng kế hoạch khi thị trường hoảng loạn hoặc hưng phấn cực độ.</li>
      </ul>
      
      <p>Nhà đầu tư cá nhân có một lợi thế khổng lồ so với các quỹ phòng hộ lớn: <i>chúng ta không phải chịu áp lực báo cáo hiệu suất theo từng quý</i>. Chúng ta hoàn toàn có thể kiên nhẫn chờ đợi bóng tròn lăn đúng vùng giá mục tiêu trước khi tung cú swing quyết định.</p>
    `
  },
  {
    postTitle: "Bitcoin có thể đạt 150,000 USD trong năm 2026?",
    slug: "bitcoin-co-the-dat-150000-usd-trong-nam-2026",
    category: "CRYPTO",
    postHeading: "Phân tích chu kỳ halving, dòng vốn từ các quỹ ETF giao ngay và tác động của chính sách tiền tệ toàn cầu đến giá trị Bitcoin.",
    postAuthor: "Ban Phân Tích Capital Circle",
    postDate: "07/09/2026",
    views: 18450,
    postImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Triển vọng Bitcoin trong chu kỳ tài chính mới</h2>
      <p>Sau đợt halving gần nhất, nguồn cung Bitcoin mới phát hành mỗi ngày đã giảm một nửa, trong khi nhu cầu hấp thụ từ các định chế tài chính thông qua các quỹ ETF giao ngay tiếp tục duy trì ở mức cao kỷ lục.</p>
      <blockquote>"Sự khan hiếm tuyệt đối trong thế giới kỹ thuật số đang biến Bitcoin thành tài sản lưu trữ giá trị đáng tin cậy nhất trong thời đại lạm phát tiền tệ fiat."</blockquote>
      <h3>Các động lực thúc đẩy chính:</h3>
      <ul>
        <li><b>Dòng vốn tổ chức:</b> Các quỹ hưu trí và quỹ phòng hộ hàng đầu thế giới đang tăng tỷ trọng nắm giữ tài sản số lên 2-5% tổng danh mục.</li>
        <li><b>Chính sách nới lỏng tiền tệ:</b> Dự báo Fed tiếp tục cắt giảm lãi suất sẽ thúc đẩy thanh khoản quay trở lại thị trường tài sản rủi ro.</li>
        <li><b>Khung pháp lý minh bạch:</b> Việc hoàn thiện luật pháp tại Mỹ, EU và các trung tâm tài chính châu Á tạo niềm tin vững chắc cho nhà đầu tư tổ chức.</li>
      </ul>
    `
  },
  {
    postTitle: "Những nhóm ngành đáng chú ý trong quý 4/2026",
    slug: "nhung-nhom-nganh-dang-chu-y-trong-quy-4-2026",
    category: "CHỨNG KHOÁN",
    postHeading: "Đánh giá triển vọng các nhóm cổ phiếu công nghệ, ngân hàng và bán lẻ trong giai đoạn phục hồi mạnh mẽ của nền kinh tế.",
    postAuthor: "Chuyên gia Minh Tuấn",
    postDate: "06/09/2026",
    views: 14200,
    postImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Tâm điểm đầu tư quý 4/2026</h2>
      <p>Quý cuối năm thường là thời điểm các doanh nghiệp đẩy mạnh doanh thu và hoàn thành kế hoạch lợi nhuận năm. Dưới đây là những nhóm ngành sở hữu câu chuyện tăng trưởng rõ ràng nhất:</p>
      <ul>
        <li><b>Nhóm Ngân hàng:</b> Tăng trưởng tín dụng khả quan kết hợp cùng chi phí vốn giảm giúp biên lãi ròng (NIM) tiếp tục cải thiện.</li>
        <li><b>Nhóm Công nghệ & Bán dẫn:</b> Hưởng lợi lớn từ làn sóng đầu tư vào trí tuệ nhân tạo và chuyển đổi hạ tầng đám mây.</li>
        <li><b>Nhóm Bán lẻ tiêu dùng:</b> Sức mua nội địa phục hồi nhờ các gói kích cầu và mùa mua sắm cuối năm.</li>
      </ul>
    `
  },
  {
    postTitle: "Giá vàng sẽ đi về đâu khi Fed hạ lãi suất?",
    slug: "gia-vang-se-di-ve-dau-khi-fed-ha-lai-suat",
    category: "VÀNG",
    postHeading: "Tương quan giữa lợi suất thực tế, sức mạnh đồng USD và xu hướng tích trữ vàng vật chất của các ngân hàng trung ương.",
    postAuthor: "Capital Circle Research",
    postDate: "05/09/2026",
    views: 11900,
    postImage: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Vàng trong chu kỳ cắt giảm lãi suất</h2>
      <p>Lịch sử 50 năm qua cho thấy: mỗi khi Cục Dự trữ Liên bang Mỹ (Fed) bắt đầu chu kỳ nới lỏng tiền tệ, giá vàng thế giới bình quân tăng từ 15% đến 25% trong vòng 12 tháng kế tiếp.</p>
      <blockquote>"Vàng không sinh ra lợi tức hàng năm, nhưng khi lãi suất thực giảm xuống mức âm, chi phí cơ hội nắm giữ vàng gần như bằng không."</blockquote>
    `
  },
  {
    postTitle: "Hành trình từ người mới đến nhà đầu tư có kỷ luật",
    slug: "hanh-trinh-tu-nguoi-moi-den-nha-dau-tu-co-ky-luat",
    category: "TƯ DUY ĐẦU TƯ",
    postHeading: "Những bài học xương máu giúp bạn xây dựng tư duy quản trị tài chính vững vàng, tránh xa bẫy FOMO và thua lỗ.",
    postAuthor: "Hoàng Nam",
    postDate: "04/09/2026",
    views: 9800,
    postImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Xây dựng hệ thống đầu tư cho riêng bạn</h2>
      <p>Khác biệt giữa một người đánh bạc và một nhà đầu tư thực thụ nằm ở việc họ có một hệ thống quy tắc rõ ràng và tuân thủ nó một cách máy móc, bất chấp cảm xúc cá nhân.</p>
      <ul>
        <li>Không bao giờ đầu tư vào thứ bạn không hiểu rõ mô hình kinh doanh.</li>
        <li>Luôn duy trì quỹ dự phòng khẩn cấp tối thiểu 6 tháng chi phí sinh hoạt.</li>
        <li>Chấp nhận cắt lỗ sớm khi luận điểm đầu tư ban đầu không còn đúng.</li>
      </ul>
    `
  },
  {
    postTitle: "Quản trị rủi ro – bài học không bao giờ cũ",
    slug: "quan-tri-rui-ro-bai-hoc-khong-bao-gio-cu",
    category: "KIẾN THỨC",
    postHeading: "Tại sao bảo toàn vốn luôn là mục tiêu tối thượng trước khi nghĩ đến việc tìm kiếm lợi nhuận trên thị trường?",
    postAuthor: "Capital Circle",
    postDate: "03/09/2026",
    views: 13400,
    postImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Quy tắc số 1: Đừng để mất tiền</h2>
      <p>Nhà đầu tư huyền thoại Warren Buffett từng đưa ra 2 quy tắc vàng: Quy tắc số 1: Không bao giờ để mất tiền. Quy tắc số 2: Không bao giờ quên quy tắc số 1. Khi bạn mất 50% vốn, bạn cần sinh lời 100% chỉ để hòa vốn ban đầu.</p>
    `
  },
  {
    postTitle: "Đầu tư không chỉ là tiền, mà còn là chính mình",
    slug: "dau-tu-khong-chi-la-tien-ma-con-la-chinh-minh",
    category: "CUỘC SỐNG",
    postHeading: "Nâng cao năng lực cá nhân, sức khỏe tinh thần và trải nghiệm sống chính là khoản đầu tư mang lại tỷ suất sinh lời vô hạn.",
    postAuthor: "Đội ngũ Capital Circle",
    postDate: "02/09/2026",
    views: 16800,
    postImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Khoản đầu tư tốt nhất bạn từng thực hiện</h2>
      <p>Tiền bạc chỉ là công cụ để phục vụ cuộc sống tự do và an yên. Đừng đánh đổi sức khỏe, các mối quan hệ quý giá hay sự bình an nội tâm chỉ vì những biến động xanh đỏ ngắn hạn trên biểu đồ giá.</p>
    `
  },
  {
    postTitle: "10 nguyên tắc đầu tư của Warren Buffett",
    slug: "10-nguyen-tac-dau-tu-cua-warren-buffett",
    category: "KIẾN THỨC ĐẦU TƯ",
    postHeading: "Tổng hợp 10 bài học kinh điển từ nhà hiền triết xứ Omaha dành cho mọi nhà đầu tư giá trị.",
    postAuthor: "Capital Circle",
    postDate: "01/09/2026",
    views: 12500,
    postImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>10 bài học từ Warren Buffett</h2>
      <ol>
        <li>Đầu tư vào những gì bạn hiểu.</li>
        <li>Tìm kiếm hào lũy kinh tế (Economic Moats).</li>
        <li>Mua cổ phiếu như mua toàn bộ doanh nghiệp.</li>
        <li>Kiên nhẫn là chìa khóa.</li>
        <li>Hãy sợ hãi khi người khác tham lam và tham lam khi người khác sợ hãi.</li>
      </ol>
    `
  },
  {
    postTitle: "Stablecoin và cơ hội cho Việt Nam",
    slug: "stablecoin-va-co-hoi-cho-viet-nam",
    category: "TÀI CHÍNH SỐ",
    postHeading: "Tiềm năng ứng dụng stablecoin trong thanh toán xuyên biên giới và thúc đẩy bao phủ tài chính tại Việt Nam.",
    postAuthor: "Capital Circle Research",
    postDate: "30/08/2026",
    views: 8300,
    postImage: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Stablecoin: Cầu nối tài chính thế hệ mới</h2>
      <p>Việt Nam liên tục nằm trong top đầu thế giới về tỷ lệ tiếp nhận tài sản số. Stablecoin mang đến cơ hội đột phá trong thanh toán thương mại điện tử quốc tế và kiều hối chi phí thấp.</p>
    `
  },
  {
    postTitle: "So sánh vàng, chứng khoán và Bitcoin",
    slug: "so-sanh-vang-chung-khoan-va-bitcoin",
    category: "PHÂN TÍCH",
    postHeading: "Phân tích định lượng về tương quan lợi nhuận, mức độ biến động và khả năng phòng hộ lạm phát giữa 3 kênh tài sản.",
    postAuthor: "Ban Phân Tích Capital Circle",
    postDate: "28/08/2026",
    views: 7100,
    postImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>So sánh 3 kênh tài sản trụ cột</h2>
      <p>Một danh mục cân bằng giữa Vàng (bảo toàn), Chứng khoán (tăng trưởng dòng tiền) và Bitcoin (tăng trưởng bất đối xứng) mang lại hiệu quả Sharpe tối ưu nhất cho thập kỷ tới.</p>
    `
  },
  {
    postTitle: "Làm sao để bắt đầu đầu tư với 10 triệu?",
    slug: "lam-sao-de-bat-dau-dau-tu-voi-10-trieu",
    category: "TƯ DUY ĐẦU TƯ",
    postHeading: "Chiến lược phân bổ vốn thông minh cho người mới với số vốn khởi điểm nhỏ nhưng mục tiêu dài hạn lớn.",
    postAuthor: "Capital Circle",
    postDate: "26/08/2026",
    views: 6800,
    postImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Khởi đầu hành trình đầu tư từ số vốn nhỏ</h2>
      <p>Số tiền bạn bắt đầu không quan trọng bằng thói quen bạn xây dựng. 10 triệu là phòng thí nghiệm hoàn hảo để bạn rèn luyện tâm lý thị trường mà không phải trả giá quá đắt.</p>
    `
  },
  {
    postTitle: "Tư duy dài hạn trong một thế giới ngắn hạn",
    slug: "tu-duy-dai-han-trong-mot-the-gioi-ngan-han",
    category: "TƯ DUY ĐẦU TƯ",
    postHeading: "Nghệ thuật phớt lờ những tiếng ồn xung quanh để kiên định đi theo tầm nhìn 5 đến 10 năm.",
    postAuthor: "Capital Circle",
    postDate: "24/08/2026",
    views: 5900,
    postImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    postContent: `
      <h2>Tư duy dài hạn: Lợi thế cạnh tranh lớn nhất</h2>
      <p>Khi hầu hết mọi người chỉ quan tâm đến ngày mai hoặc tuần tới, bất kỳ ai có thể kiên định với tầm nhìn 10 năm đều đang chơi một trò chơi hoàn toàn khác mà đối thủ không thể bắt chước.</p>
    `
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB Atlas.");

    for (const art of articles) {
      await News.findOneAndUpdate(
        { slug: art.slug },
        { $set: { ...art, status: true } },
        { upsert: true, new: true }
      );
      console.log(`✓ Seeded/Updated: ${art.postTitle}`);
    }

    try {
      await redis.del("allNews");
      await redis.del("allPublishedNews");
      console.log("✓ Invalided redis news caches.");
    } catch (e) {
      console.log("Redis cache invalidation skipped:", e.message);
    }

    console.log("Seeding completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
