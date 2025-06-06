import { Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function UsedItem({ used }) {
    const navigate = useNavigate();

    const getDateDiff = (date) => {
        const created = new Date(date);
        created.setHours(created.getHours() + 9);
        const now = new Date();
        const diffMs = now - created;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffDay > 0) return `${diffDay}일 전`;
        if (diffHour > 0) return `${diffHour}시간 전`;
        if (diffMin > 0) return `${diffMin}분 전`;
        return "방금 전";
    };

    const handleDetail = () => navigate(`${used.id}`);

    return (
        <Card
            className="h-100 shadow-sm border-0 rounded-4"
            style={{ width: "100%", maxWidth: 320, minHeight: 360, cursor: "pointer" }}
            onClick={handleDetail}
        >
            <div style={{ width: "100%", height: 180, overflow: "hidden", borderRadius: "1rem 1rem 0 0" }}>
                <Card.Img
                    variant="top"
                    src={used.main_img}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    alt="썸네일"
                />
            </div>
            <Card.Body className="p-3 d-flex flex-column justify-content-between" style={{ height: 180 }}>
                <div>
                    <div className="text-secondary small mb-1" style={{ height: 20, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        거래&gt;{used.categories?.name} 
                    </div>
                    <Card.Title className="fw-bold fs-6 mb-1" style={{ minHeight: 22, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {used.title}
                    </Card.Title>
                    <Card.Text className="mb-2 text-truncate" style={{ minHeight: 32 }}>
                        {used.content}
                    </Card.Text>
                </div>
                <div className="d-flex justify-content-between align-items-end mt-auto">
                    <span className="fw-bold fs-6">
                        {used.category_id === 5
                            ? <Badge bg="success">나눔</Badge>
                            : `${Number(used.price).toLocaleString()}원`
                        }
                    </span>
                    <span className="small text-muted">{used.location} · {getDateDiff(used.create_date)}</span>
                </div>
            </Card.Body>
        </Card>
    );
}
export default UsedItem;
