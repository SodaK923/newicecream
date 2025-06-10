import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabase";
// import { Carousel } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useUserTable } from "../hooks/useUserTable";
import { Carousel, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import { FaRegHeart } from "react-icons/fa";
import { Likes } from "./Likes";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



export function UsedDetail() {
    const { item } = useParams();
    const navigate = useNavigate();
    const now = new Date().toISOString();
    


    const [detail, setDetail] = useState(null);
    // 로그인한 사람의 정보
    const { info: userInfo } = useUserTable();


        useEffect(() => {
        const fetchLikes = async () => {
            const { count, error: likeCountError } = await supabase
                    .from('likes')
                    .select('*', { count: 'exact', head: true })
                    .eq('category_id', used.category_id)
                    .eq('table_id', used.id);

                if (!likeCountError) {
                    setLikesCount(count);
                } else {
                    console.error('좋아요 수 불러오기 실패', likeCountError);
                }

                await supabase.rpc('increment_view_count', { trade_id: parseInt(item) });
        }
        fetchLikes();
    }, [item]);


    // 아이템 가져옴
    useEffect(() => {
        const fetchDetails = async () => {
            // 조회수 가져옴
            if (!item) return;
            const { data: prevData, error: prevError } = await supabase
                .from('trades')
                .select('cnt')
                .eq('id', item)
                .single();
            if (prevError) {
                console.log('cnterror: ', prevError);
            }

            // 조회수 증가
            await supabase
                .from('trades')
                .update({ cnt: prevData.cnt + 1 })
                .eq('id', item)

            // 조회수 증가반영된 아이템 가져옴
            const { data, error } = await supabase
                .from('trades')
                .select('*, categories(*), users(id, name)')
                .eq('id', item)
                .single();
            console.log(data);
            if (error) {
                console.log('error: ', error);
            }
            if (data) {
                setDetail(data);
            }   
        };
        fetchDetails();
    }, [item]);


    // 조회수 증가
    // useEffect(() => {
    //     if (!item) return;
    //     const increaseView = async () => {
    //         const { data, error } = await supabase
    //             .from('trades')
    //             .select('cnt')
    //             .eq('id', item)
    //             .single();
    //         if (error) {
    //             console.log('increaseView error: ', error);
    //             return;
    //         }
    //         if (data) {
    //             // 조회수 증가
    //             await supabase
    //                 .from('trades')
    //                 .update({ cnt: data.cnt + 1 })
    //                 .eq('id', item);

    //             // 증가된 조회수 반영
    //             const { data: updateData } = await supabase
    //                 .from('trades')
    //                 .select('*, categoires(name), users(name)')
    //                 .eq('id', item)
    //                 .single()
    //             if (updateData) {
    //                 setDetail(updateData);
    //             }
    //         }
    //     }
    //     increaseView();
    // }, [item]);


    // 글 삭제
    const deleteDetails = async () => {
        // 취소(false)를 눌러야 true가 되므로 !confirm
        if (!confirm('게시글을 삭제할까요?')) {
            return;
        }
        const { data, error } = await supabase
            .from('trades')
            .delete()
            .eq('id', item)
            .select();
        if (error) {
            alert('삭제에 실패했습니다.');
            console.log('delete error', error);
        }
        if (data) {
            alert('게시글이 삭제되었습니다.');
            navigate('/trade');
        }
    }


    // 구매하기/나눔받기/팔기 -> 판매자 채팅으로
    const makeChats = async () => {
        const { data, error } = await supabase
            .from('chats')
            .insert([{
                sender_id: detail?.user_id,
                receiver_id: userInfo?.id,
                chat: '거래해요!',
                create_date: now,
                read: false,
                trades_id: detail.id,
                trades_quantity: 1
            }])
            .select()
        if (error) {
            console.log('error: ', error);
        }
        if (data) {
            console.log('data: ', data);
            alert('채팅이 전송되었습니다.');
            navigate(`/my/talk/${detail?.user_id}`)
        }
    }

    // 버튼 분기
    const handleButtons = () => {
        // 내가 쓴 글이면 (글수정/삭제만)
        if (userInfo && userInfo.id === detail.user_id) {
            return (
                <div>
                    <Button onClick={handleUpdate}>글수정</Button>
                    <Button onClick={deleteDetails}>삭제</Button>
                </div>
            );
        } else {
            // 좋아요 버튼 + 기타 버튼
            return (
                <div>
                    {detail.category_id === 4 && (<Button size="sm" style={{ padding: "2px 12px", fontSize: 16 }} onClick={makeChats}>구매하기</Button>)}
                    {detail.category_id === 5 && (<Button onClick={makeChats}>나눔받기</Button>)}
                    {detail.category_id === 6 && (<Button onClick={makeChats}>팔기</Button>)}
                </div>
            );
        }
    };


    // todo: 글 수정
    const handleUpdate = () => {
        navigate('update');
    }


    if (!detail) return <div>로딩중</div>;

    const images = [detail.main_img, detail.detail_img1, detail.detail_img2, detail.detail_img3, detail.detail_img4].filter(Boolean);


    // 날짜 계산
    const getDateDiff = (date) => {
        const created = new Date(date);
        created.setHours(created.getHours() + 9);
        const now = new Date();
        const diffMs = now - created; // 밀리초 차이
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffDay > 0) return `${diffDay}일 전`;
        if (diffHour > 0) return `${diffHour}시간 전`;
        if (diffMin > 0) return `${diffMin}분 전`;
        return "방금 전";
    }

    const isEdited = detail.create_date !== detail.update_date;
    const baseTime = isEdited ? detail.update_date : detail.create_date;

    return (
        <Card className="border-0" style={{ maxWidth: 1100, margin: "30px auto", borderRadius: 18 }}>
            <Row className="g-0">
                {/* 왼쪽: 이미지 */}
                <Col md={6} xs={12}>
                    <div style={{ background: "#fafafa", borderRadius: "18px 0 0 18px", height: "100%", minHeight: 400 }}>
                        <Carousel indicators={images.length > 1}>
                            {images.length === 0 ? (
                                <Carousel.Item>
                                    <div className="text-center text-muted p-5">이미지가 없습니다.</div>
                                </Carousel.Item>
                            ) : (
                                images.map((img, idx) => (
                                    <Carousel.Item key={idx}>
                                        <img
                                            src={img}
                                            alt={`상세 이미지 ${idx + 1}`}
                                            style={{
                                                width: "100%",
                                                height: 400,
                                                objectFit: "cover",
                                                borderRadius: "18px 0 0 18px"
                                            }}
                                        />
                                    </Carousel.Item>
                                ))
                            )}
                        </Carousel>
                    </div>
                </Col>
                {/* 오른쪽: 정보 */}
                <Col md={6} xs={12} className="p-5 d-flex flex-column justify-content-between">
                    <div>
                        <h4 className="fw-bold">{detail.title}</h4>
                        <div className="text-secondary mb-2">
                            {detail.categories?.name} · {detail.location}
                            <span className="ms-3">{getDateDiff(baseTime)}{isEdited && (' (수정)')}</span>
                        </div>
                        <div className="mb-3 fs-4 fw-bold" style={{ color: "#333" }}>
                            {detail.category_id === 5
                                ? <Badge bg="success" className="fs-6">나눔</Badge>
                                : `${Number(detail.price).toLocaleString()}원`
                            }
                        </div>
                        <div className="mb-4" style={{ whiteSpace: "pre-line" }}>{detail.content}</div>
                        {/* <div className="mb-2 text-muted" style={{ fontSize: 14 }}>
                            ❤️ {detail.like_cnt ?? 0} · 조회 {detail.cnt ?? 0}
                        </div> */}
                        <div className="mb-2 text-muted d-flex align-items-center gap-2" style={{ fontSize: 14 }}>
                            <span> · 조회 {detail.cnt ?? 0}</span>
                        </div>

                        <div className="mb-4 text-muted" style={{ fontSize: 14 }}>
                            작성자: {detail.users?.name ?? '알 수 없음'}
                        </div>
                        <div className="d-flex gap-2">
                            {handleButtons()}
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}