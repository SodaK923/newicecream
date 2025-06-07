import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from "../supabase/supabase";
import { UsedItem } from './UsedItem';

export function UsedBuy() {
    const [posts, setPosts] = useState([]);
    const [showRegisterMenu, setShowRegisterMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('trades')
                .select('*,categories(name), users(name)')
                .eq('category_id', 6)
                .eq('super_category_id', 3)
                .order('create_date', { ascending: false });
            if (error) {
                console.log("error: ", error);
            }
            if (data) {
                setPosts(data);
            }
        }
        fetchPosts();
    }, []);

    if (!posts) return <div>로딩중</div>;

    // const handleCreate = () => {
    //     navigate('/trade/write');
    // }

    // 글쓰기 등록버튼 처리
    const handleToggleMenu = () => {
        setShowRegisterMenu(prev => !prev);
    };
    const handleRegisterNavigate = (path) => {
        console.log('Navigate to', path);
        setShowRegisterMenu(false);
        navigate(path);  // 이 부분 추가 필요
    };

    return (
        <Container className="mt-4">
            {/* <div className="mb-3 d-flex justify-content-end">
                <Button onClick={handleCreate} variant="primary" style={{ borderRadius: 16 }}>글작성</Button>
            </div> */}

            <Row className="g-4">
                {posts.map((used) => (
                    <Col key={used.id} xs={12} sm={6} md={4} lg={3}>
                        <UsedItem used={used} />
                    </Col>
                ))}
            </Row>
            <div
                className="position-fixed bottom-0 start-0 m-4"
                style={{ zIndex: 1050 }}
            >
                <Button
                    variant="danger"
                    className="d-flex justify-content-center align-items-center shadow rounded-3"
                    style={{ width: '100px', height: '50px', whiteSpace: 'nowrap' }}
                    onClick={handleToggleMenu}
                >
                    + 글쓰기
                </Button>

                {showRegisterMenu && (
                    <div
                        className="bg-danger rounded-3 shadow p-2 mt-3 position-absolute start-0"
                        style={{
                            bottom: '70px',
                            width: '200px',
                            userSelect: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    >
                        {['거래 등록', '공구 등록'].map((label, idx) => {
                            const path = label === '거래 등록'
                                ? '/trade/deal/register'
                                : '/trade/gonggu/register';

                            return (
                                <Button
                                    key={idx}
                                    variant="danger"
                                    className="w-100 text-start mb-2 rounded-2"
                                    onClick={() => handleRegisterNavigate(path)}
                                >
                                    {label}
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
        </Container>

    );
}
