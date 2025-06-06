import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from "../supabase/supabase";
//import { Product } from './Product';
import { UsedItem } from './UsedItem';


export function UsedBuy() {
    const [posts, setPosts] = useState([]);
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
                console.log("data: ", data);
            }
            if(data) {
                setPosts(data);
            }
        }
        fetchPosts();
    }, []);

    if(!posts) return <div>로딩중</div>;

    const handleCreate=()=>{
        navigate('/trade/write');
    }

    return (
        <Container className="mt-4">
            <div className="mb-3 d-flex justify-content-end">
                <Button onClick={handleCreate} variant="primary" style={{ borderRadius: 16 }}>글작성</Button>
            </div>
            <Row className="g-4">
                {posts.map((used) => (
                    <Col key={used.id} xs={12} sm={6} md={4} lg={3}>
                        <UsedItem used={used} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}