import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabase";
import { useParams } from "react-router-dom";

// 주문 페이지가 필요한가.......
export function UsedOrder() {
    const { item } = useParams();

    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            console.log(item);
            const { data, error } = await supabase
                .from('trades')
                .select('*, users(name)')
                .eq('id', item)
                .single()
            if (error) {
                console.log('error: ', error);
            }
            if (data) {
                setOrder(data);
            }
        }
        fetchOrder();
    }, [item]);

    // 화면에 기존 내용 보여주기
    // 수량..?
    // 

    return (
        <div>
            {order ? (
                <div>
                    <img src={order.main_img} style={{width: "300px"}} />
                    <div>{order.title}</div>
                    <div>{order.content}</div>
                </div>
            ) : <div>로딩중</div>}
            {/* <button onClick={submitOrder}>구매</button> */}
        </div>
    );
}