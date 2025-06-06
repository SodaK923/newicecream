import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabase";
import { useImage } from "../hooks/useImage";
//import { getUser } from '../utils/getUser';
import { useUserTable } from "../hooks/useUserTable";
import { useRegion } from "../hooks/useRegion";

export function UsedCreate() {
    const now = new Date().toISOString();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [price, setPrice] = useState("");

    // type-> 4: 벼룩해요 5: 드림해요 6. 구해요 7. 공구해요
    const [category, setCategory] = useState("");

    // useImage 훅
    const { images, setImages, getImages } = useImage();
    const [fileCount, setFileCount] = useState(0);

    // useUserTable 훅
    const { info: userInfo, loading, error } = useUserTable();

    // 상세정보 테이블에서 가져올수도..
    const { city, district } = useRegion();
    const location = `${city} ${district}`;

    // getUser
    // useEffect(() => {
    //     (async () => {
    //         const { user } = await getUser();
    //         if (!user) {
    //             alert('로그인해야 글작성이 가능합니다.');
    //             navigate('/login');
    //         }
    //     })();
    // }, []);

    useEffect(() => {
        console.log("userInfo:", userInfo, "loading:", loading);
        if (!userInfo && !loading) {
            alert('로그인해야 글작성이 가능합니다.');
            navigate('/login');
        }
    }, [loading, userInfo]);


    // 드림해요-> 가격 내용 비움
    useEffect(() => {
        if (category === "5") setPrice("");
    }, [category]);



    // fileCount: 사용자가 < input type = "file" multiple > 에서 고른 파일의 개수
    // images.length: 실제로 서버에 업로드 끝난 이미지 개수(useImage 훅에서 관리)
    // 이미지 업로드 개수 제한 함수
    const handleFileChange = (e) => {
        const files = e.target.files;
        console.log(files);
        if (files.length > 5) {
            alert("사진은 최대 5장까지만 업로드할 수 있습니다.");
            e.target.value = ""; // 선택 취소
            return;
        }
        setFileCount(files.length);
        setImages(e); // 기존대로
    }


    const handleCreate = async (e) => {
        e.preventDefault();

        // if (loading) {
        //     alert("유저 정보를 불러오는 중입니다. 잠시만 기다려 주세요.");
        //     return;
        // }
        if (!userInfo) {
            alert("로그인해야 글작성이 가능합니다.");
            navigate('/login');
            return;

        }

        if (!category) {
            alert("카테고리를 선택해주세요.");
            return;
        }
        if (!title || !content) {
            alert("제목과 내용을 모두 작성해주세요.");
            return;
        }
        if (category !== "5" && !price) { // '나눔' 아니면 가격 필요
            alert("가격을 입력해주세요.");
            return;
        }



        const { data, error } = await supabase
            .from('trades')
            .insert([{
                user_id: userInfo.id,
                title,
                content,
                price: Number(price),
                location,
                main_img: images[0] ? getImages(images[0]) : null,
                detail_img1: images[1] ? getImages(images[1]) : null,
                detail_img2: images[2] ? getImages(images[2]) : null,
                detail_img3: images[3] ? getImages(images[3]) : null,
                detail_img4: images[4] ? getImages(images[4]) : null,
                category_id: Number(category),
                super_category_id: 3,
                create_date: now,
                update_date: now, //null로 햇더니 오류남
                cnt: 0,
                state: 1,
                // 공구에 들어가는 내용->null
                sales_begin: null,
                sales_end: null,
                limit_type: null,
                limit: null,
            }])
            .select()
        if (error) {
            console.log('error', error);
        } if (data) {
            //console.log(data)
            // todo: 글작성한 카테고리로 자동 이동하게 하기
            navigate('/trade/sell');
        }
    }
    //console.log(images);


    return (
        <div>
            <form>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">카테고리 선택</option>
                    <option value="4">벼룩해요</option>
                    <option value="5">드림해요</option>
                    <option value="6">구해요</option>
                    {/* <option value="7">공구해요</option> */}
                </select>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용" />
                <input
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder={category === "5" ? "나눔" : "가격"}
                    disabled={category === "5"}
                />
                <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                {/* 사용자가 선택한 이미지와 업로드된 이미지 개수가 같아야함 */}
                {fileCount !== images.length && (
                    <div>이미지 업로드 중입니다...</div>
                )}
                {/* 업로드하는 사진 보여줌 */}
                <div>
                    {images.length > 0 && images.map((img, idx) => (
                        <img key={idx} src={getImages(img)} alt={`이미지${idx + 1}`} style={{ width: '100px' }} />
                    ))}
                </div>
                {/* 파일 개수가 맞을 때까지 등록버튼 꺼짐 */}
                {/* <button onClick={handleCreate} disabled={fileCount !== images.length || images.length === 0}>등록</button> */}
                <button onClick={handleCreate}>등록</button>
            </form>
        </div>
    )
}
