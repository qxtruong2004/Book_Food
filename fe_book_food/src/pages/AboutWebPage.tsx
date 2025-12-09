import { Link } from "react-router-dom";

const AboutWebPage : React.FC = () => {
    return (
        <section className="about-us py-5" style={{ background: "#f8f9fa" }}>
          <div className="container">
            <div className="row align-items-center">
              {/* Image */}
              <div className="col-lg-6 mb-4 mb-lg-0">
                <img
                  src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                  className="img-fluid rounded shadow"
                  alt="About us"
                  style={{ transition: "transform 0.4s ease" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              </div>
    
              {/* Text Content */}
              <div className="col-lg-6">
                <h2 className="fw-bold mb-3" style={{ color: "#ff6f3c" }}>
                  About Us
                </h2>
                <p className="text-muted">
                  Chào mừng bạn đến với <strong>Q.Trường Store</strong> – nền tảng đặt đồ ăn nhanh chóng,
                  tiện lợi và uy tín. Chúng tôi mang đến trải nghiệm đặt món dễ dàng chỉ với vài thao tác,
                  giúp bạn thưởng thức những bữa ăn ngon miệng từ những nhà hàng chất lượng nhất trong khu vực.
                </p>
    
                <p className="text-muted">
                  Với đội ngũ giao hàng chuyên nghiệp, hệ thống theo dõi đơn hàng thời gian thực,
                  cùng hàng trăm lựa chọn món ăn đa dạng, <strong>Q.Trường Store</strong> tự hào là cầu nối
                  giữa khách hàng và những bữa ăn tuyệt vời.
                </p>
    
                <ul className="list-unstyled">
                  <li className="mb-2">
                    ✔ <strong>Giao hàng siêu tốc</strong> – nóng hổi trong từng phút.
                  </li>
                  <li className="mb-2">
                    ✔ <strong>Đa dạng món ăn</strong> – từ đồ ăn nhanh, cơm, lẩu, đến đồ uống.
                  </li>
                  <li className="mb-2">
                    ✔ <strong>Giá cả minh bạch</strong> – không phí ẩn, không phát sinh.
                  </li>
                </ul>
    
                <Link to="/" className="btn btn-warning px-4 mt-2">
                  Đặt món ngay
                </Link>
              </div>
            </div>
          </div>
        </section>
      );
}
export default AboutWebPage;