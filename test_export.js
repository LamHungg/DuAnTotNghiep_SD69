// Script test chức năng export Excel và PDF
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testExport = async () => {
  console.log("📤 Test Chức Năng Export...\n");

  try {
    // Test 1: Export Excel
    console.log("1️⃣ Test Export Excel...");
    const excelData = {
      filterType: "thang-nay",
      selectedDate: "2025-08-27",
      selectedMonth: 8,
      selectedYear: 2025,
      dateFrom: "2025-08-01",
      dateTo: "2025-08-27",
      kpiData: {
        doanhThuHomNay: 15000000,
        doanhThuThangNay: 4791000,
        doanhThuNamNay: 4791000,
        tongDonHang: 53,
        tongKhachHang: 10,
        tongSanPham: 7,
        khachHangMoi: 4,
        tyLeHuy: 2.27,
        tangTruongThang: 100,
        tangTruongNam: 100,
      },
      doanhThuChart: [
        { thoiGian: "19/08", doanhThu: 1588000 },
        { thoiGian: "24/08", doanhThu: 199000 },
        { thoiGian: "25/08", doanhThu: 819000 },
        { thoiGian: "27/08", doanhThu: 2185000 },
      ],
      doanhThuTheoDanhMuc: [
        { tenDanhMuc: "Áo thun", doanhThu: 2500000, mauSac: "#FF6384" },
        { tenDanhMuc: "Quần jean", doanhThu: 1800000, mauSac: "#36A2EB" },
        { tenDanhMuc: "Giày", doanhThu: 1200000, mauSac: "#FFCE56" },
      ],
      topSanPham: [
        {
          tenSanPham: "Men's Dri-FIT Running T-Shirt",
          soLuongBan: 5,
          doanhThu: 4295000,
        },
        { tenSanPham: "Áo thun nam", soLuongBan: 4, doanhThu: 796000 },
      ],
      topKhachHang: [
        { hoTen: "Lam Hung", soLuongDon: 1, tongChiTieu: 1838000 },
        { hoTen: "Lê Thị B", soLuongDon: 2, tongChiTieu: 398000 },
      ],
      donHangList: [
        {
          maDonHang: "DH001",
          khachHang: "Nguyễn Văn A",
          ngayDat: "2025-08-27",
          tongTien: 500000,
          trangThai: "Đã giao",
        },
        {
          maDonHang: "DH002",
          khachHang: "Trần Thị B",
          ngayDat: "2025-08-26",
          tongTien: 750000,
          trangThai: "Đang xử lý",
        },
      ],
    };

    const excelResponse = await fetch(
      "http://localhost:8080/zmen/export/thong-ke-excel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(excelData),
      }
    );

    if (excelResponse.ok) {
      console.log("✅ Export Excel thành công");
      const blob = await excelResponse.blob();
      console.log("📄 File Excel size:", blob.size, "bytes");

      // Tạo download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `thong-ke-excel-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } else {
      console.log("❌ Export Excel thất bại:", excelResponse.status);
    }

    // Test 2: Export PDF
    console.log("\n2️⃣ Test Export PDF...");
    const pdfResponse = await fetch(
      "http://localhost:8080/zmen/export/thong-ke-pdf",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(excelData),
      }
    );

    if (pdfResponse.ok) {
      console.log("✅ Export PDF thành công");
      const blob = await pdfResponse.blob();
      console.log("📄 File PDF size:", blob.size, "bytes");

      // Tạo download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `bao-cao-thong-ke-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } else {
      console.log("❌ Export PDF thất bại:", pdfResponse.status);
    }
  } catch (error) {
    console.log("❌ Lỗi test export:", error.message);
  }
};

// Test export từng bảng riêng biệt
const testTableExport = async (tableType) => {
  console.log(`📤 Test Export Bảng ${tableType}...`);

  try {
    let data = {};
    let fileName = "";

    switch (tableType) {
      case "san-pham":
        data = {
          filterType: "thang-nay",
          year: 2025,
          month: 8,
          topSanPham: [
            {
              tenSanPham: "Men's Dri-FIT Running T-Shirt",
              soLuongBan: 5,
              doanhThu: 4295000,
            },
            { tenSanPham: "Áo thun nam", soLuongBan: 4, doanhThu: 796000 },
          ],
        };
        fileName = `top-san-pham-${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        break;
      case "khach-hang":
        data = {
          filterType: "thang-nay",
          year: 2025,
          month: 8,
          topKhachHang: [
            { hoTen: "Lam Hung", soLuongDon: 1, tongChiTieu: 1838000 },
            { hoTen: "Lê Thị B", soLuongDon: 2, tongChiTieu: 398000 },
          ],
        };
        fileName = `top-khach-hang-${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        break;
      case "don-hang":
        data = {
          filterType: "thang-nay",
          year: 2025,
          month: 8,
          donHangList: [
            {
              maDonHang: "DH001",
              khachHang: "Nguyễn Văn A",
              ngayDat: "2025-08-27",
              tongTien: 500000,
              trangThai: "Đã giao",
            },
            {
              maDonHang: "DH002",
              khachHang: "Trần Thị B",
              ngayDat: "2025-08-26",
              tongTien: 750000,
              trangThai: "Đang xử lý",
            },
          ],
        };
        fileName = `danh-sach-don-hang-${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        break;
      default:
        throw new Error("Loại bảng không hợp lệ");
    }

    const response = await fetch(
      "http://localhost:8080/zmen/export/thong-ke-excel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      console.log(`✅ Export ${tableType} thành công`);
      const blob = await response.blob();
      console.log("📄 File size:", blob.size, "bytes");

      // Tạo download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } else {
      console.log(`❌ Export ${tableType} thất bại:`, response.status);
    }
  } catch (error) {
    console.log(`❌ Lỗi export ${tableType}:`, error.message);
  }
};

// Test click button export
const testClickExportButton = async (buttonText) => {
  console.log(`🖱️ Test click button: "${buttonText}"`);

  const buttons = Array.from(document.querySelectorAll(".btn"));
  const targetButton = buttons.find((btn) =>
    btn.textContent.trim().includes(buttonText)
  );

  if (targetButton) {
    console.log("✅ Tìm thấy button, thử click...");
    if (!targetButton.disabled) {
      targetButton.click();
      console.log("✅ Đã click button");

      // Đợi một chút để xem có download không
      setTimeout(() => {
        console.log("⏳ Kiểm tra download...");
      }, 2000);
    } else {
      console.log("❌ Button bị disabled");
    }
  } else {
    console.log("❌ Không tìm thấy button");
  }
};

// Chạy test
testExport();

// Export functions
window.testExport = testExport;
window.testTableExport = testTableExport;
window.testClickExportButton = testClickExportButton;
