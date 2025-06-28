import React, { useState } from "react";
import { FaFilter, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Button, Table, Form, Row, Col, InputGroup } from "react-bootstrap";

const sampleVouchers = [
  {
    id: 1,
    code: "DGG008",
    name: "Test",
    value: "50%",
    start: "08:54:00 17/01/2025",
    end: "08:53:00 18/01/2025",
    status: "Đã kết thúc",
  },
  {
    id: 2,
    code: "DGG007",
    name: "Khuyến mãi đặc biệt mùa đông",
    value: "15%",
    start: "08:43:00 17/01/2025",
    end: "08:43:00 18/01/2025",
    status: "Đã kết thúc",
  },
  {
    id: 3,
    code: "DGG006",
    name: "Promotion Mùa Xuân",
    value: "13%",
    start: "07:59:00 17/01/2025",
    end: "07:59:00 18/01/2025",
    status: "Đã kết thúc",
  },
];

const statusColor = {
  "Đã kết thúc": "danger",
  "Đang diễn ra": "success",
  "Sắp diễn ra": "warning",
};

const Vouchers = () => {
  const [filter, setFilter] = useState({
    search: "",
    start: "",
    end: "",
    status: "Tất cả",
    value: "Tất cả",
  });
  const [data] = useState(sampleVouchers);

  return (
    <div style={{ padding: 24 }}>
      {/* Bộ lọc */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px #0001",
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 20,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FaFilter style={{ color: "#6c63ff" }} /> Bộ lọc
        </div>
        <Form>
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Label>Tìm kiếm theo tên/mã/giá trị</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Nhập tên, mã hoặc giá trị giảm"
                  value={filter.search}
                  onChange={(e) =>
                    setFilter((f) => ({ ...f, search: e.target.value }))
                  }
                />
                <Button variant="primary">
                  <i className="fa fa-search" />
                </Button>
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Label>Ngày bắt đầu</Form.Label>
              <Form.Control
                type="date"
                value={filter.start}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, start: e.target.value }))
                }
              />
            </Col>
            <Col md={2}>
              <Form.Label>Ngày kết thúc</Form.Label>
              <Form.Control
                type="date"
                value={filter.end}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, end: e.target.value }))
                }
              />
            </Col>
            <Col md={2}>
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={filter.status}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option>Tất cả</option>
                <option>Đã kết thúc</option>
                <option>Đang diễn ra</option>
                <option>Sắp diễn ra</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>Giá trị giảm</Form.Label>
              <Form.Select
                value={filter.value}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, value: e.target.value }))
                }
              >
                <option>Tất cả</option>
                <option>5%</option>
                <option>10%</option>
                <option>15%</option>
                <option>20%</option>
                <option>50%</option>
              </Form.Select>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Danh sách voucher */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px #0001",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <i className="fa fa-list" /> Danh sách đợt giảm giá
          </div>
          <Button
            variant="primary"
            style={{ borderRadius: 8, fontWeight: 600, padding: "8px 20px" }}
          >
            <FaPlus style={{ marginRight: 6 }} /> Thêm mới
          </Button>
        </div>
        <Table
          bordered
          hover
          responsive
          style={{ background: "#fff", borderRadius: 8, overflow: "hidden" }}
        >
          <thead style={{ background: "#f5f6fa" }}>
            <tr>
              <th>STT</th>
              <th>Mã đợt giảm giá</th>
              <th>Tên đợt giảm giá</th>
              <th>Giá trị</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((v, idx) => (
              <tr key={v.id}>
                <td>{idx + 1}</td>
                <td>{v.code}</td>
                <td>{v.name}</td>
                <td>{v.value}</td>
                <td>{v.start}</td>
                <td>{v.end}</td>
                <td>
                  <Button
                    size="sm"
                    variant={statusColor[v.status] || "secondary"}
                    style={{ pointerEvents: "none", fontWeight: 500 }}
                  >
                    {v.status}
                  </Button>
                </td>
                <td>
                  <Button size="sm" variant="info" style={{ marginRight: 8 }}>
                    <FaEdit />
                  </Button>
                  <Button size="sm" variant="danger">
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Vouchers;
