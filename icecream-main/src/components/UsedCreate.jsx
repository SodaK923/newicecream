import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabase";
import { useImage } from "../hooks/useImage";
import { getUser } from '../utils/getUser';
import { useUserTable } from "../hooks/useUserTable";
import { useRegion } from "../hooks/useRegion";
//import { useParams } from "react-router-dom";
import { Form, Button, FloatingLabel, Image, Spinner, InputGroup } from "react-bootstrap";

export function UsedCreate() {
    const now = new Date().toISOString();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [price, setPrice] = useState("");

    // type-> 4: 벼룩해요 5: 드림해요 6. 구해요 7. 공구해요
    const [category, setCategory] = useState("");

    // useImage 훅
    const { images, setImages, getImages, initImage } = useImage();
    const [fileCount, setFileCount] = useState(0);
    const fileInputRef = useRef();

    // useUserTable 훅
    const { info: userInfo, loading, error } = useUserTable();

    // useRegion 훅
    const { city, district } = useRegion();
    const location = `${city} ${district}`;

    // 카테고리 숫자->문자열로 변환
    const CATEGORY_MAP = {
        4: "sell",
        5: "share",
        6: "buy"
    };

    useEffect(() => {
        const checkLogin = async () => {
            const { user } = await getUser();
            if (!user) {
                alert('로그인해야 글작성이 가능합니다.');
                navigate('/login');
            }
        }
        checkLogin();
    }, []);


    // 중간에 로그아웃되면 막으라고 쓴 건데 효과없는 듯
    // useEffect(() => {
    //     console.log("userInfo:", userInfo, "loading:", loading);
    //     if (!userInfo && !loading) {
    //         alert('로그인해야 글작성이 가능합니다.');
    //         navigate('/login');
    //     }
    // }, [loading, userInfo]);


    // 드림해요-> 가격 내용 비움
    useEffect(() => {
        if (category === "5") setPrice("");
    }, [category]);


    // fileCount: 사용자가 < input type = "file" multiple > 에서 고른 파일의 개수
    // images.length: 실제로 서버에 업로드 끝난 이미지 개수(useImage 훅에서 관리)
    // 이미지 업로드 개수 제한 함수
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        console.log(files);
        if (images.length+files.length > 5) {
            alert("사진은 최대 5장까지만 업로드할 수 있습니다.");
            fileInputRef.current.value = ""; // 선택 취소
            return;
        }
        setFileCount(images.length+files.length);
        setImages(e);
    }



    // 이미지 삭제
    const handleRemoveImage = () => {
        initImage([]);
        setFileCount(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";   // input의 파일 선택 자체를 비움
        }
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
        if (category !== "5" && !price) {
            alert("가격을 입력해주세요.");
            return;
        }
        if (!confirm('게시글을 등록할까요?')) {
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
                main_img: images[0] ? images[0] : null,
                detail_img1: images[1] ? images[1] : null,
                detail_img2: images[2] ? images[2] : null,
                detail_img3: images[3] ? images[3] : null,
                detail_img4: images[4] ? images[4] : null,
                category_id: Number(category),
                super_category_id: 3,
                create_date: now,
                update_date: now, //null로 햇더니 오류남 -> 맞댄다
                cnt: 0,
                state: 1,
                // 공구에 들어가는 내용->null
                sales_begin: null,
                sales_end: null,
                limit_type: null,
                limit: null,
            }])
            .select()
            .single();
        if (error) {
            console.log('error', error);
        } if (data && data.id) {
            //console.log(data)
            // 숫자->문자열로 변환
            const categoryString = CATEGORY_MAP[category];
            const newItem = data.id;
            navigate(`/trade/${categoryString}/${newItem}`);
        }
    }
    //console.log(images);


    return (
            <div className="p-4 rounded-4 shadow-sm bg-white" style={{ maxWidth: 600, margin: "40px auto" }}>
                <Form>
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>글등록</Form.Label>
                        <Form.Select value={category} onChange={e => setCategory(e.target.value)} required>
                            <option value="">카테고리 선택</option>
                            <option value="4">벼룩해요</option>
                            <option value="5">드림해요</option>
                            <option value="6">구해요</option>
                            {/* <option value="7">공구해요</option> */}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="location">
                        <Form.Label>지역</Form.Label>
                        <Form.Select value={location} disabled>
                            <option value="">{location}</option>
                        </Form.Select>
                        <div className="form-text mt-1 text-muted" style={{ fontSize: 14 }}>
                            ※ 상단메뉴에서 선택해주세요.
                        </div>
                    </Form.Group>



                    <Form.Group className="mb-3" controlId="title">
                        <FloatingLabel label="제목">
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                //ref={titleRef}
                                placeholder="제목"
                                required
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="content">
                        <FloatingLabel label="내용">
                            <Form.Control
                                as="textarea"
                                style={{ minHeight: 120 }}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                //ref={contentRef}
                                placeholder="내용"
                                required
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="price">
                        <InputGroup>
                            <Form.Control
                                type="number"
                                value={price.toLocaleString()}
                                onChange={e => setPrice(e.target.value)}
                                //ref={priceRef}
                                placeholder={category === "5" ? "나눔" : "가격"}
                                disabled={category === "5"}
                                min={0}
                                required={category !== "5"}
                            />
                            {category !== "5" && <InputGroup.Text>원</InputGroup.Text>}
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="images">
                        <Form.Label>이미지 업로드</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <div className="form-text mt-1 text-muted" style={{ fontSize: 14 }}>
                            ※ 이미지는 최대 5장까지 업로드할 수 있습니다.<br />
                            <span className="text-secondary">가장 먼저 선택한 이미지가 대표이미지로 설정됩니다.</span>
                        </div>
                        {fileCount !== images.length && (
                            <div className="mt-2 text-secondary d-flex align-items-center gap-2">
                                <Spinner animation="border" size="sm" />
                                이미지 업로드 중입니다...
                            </div>
                        )}
                        {/* 업로드 미리보기 */}

                        <div className="d-flex flex-wrap gap-2 mt-3">
                            {images.length > 0 && images.map((img, idx) => (
                                <div key={idx} style={{ position: 'relative', display: "inline-block" }}>
                                    {/* 대표 뱃지 */}
                                    {idx === 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: 5,
                                            left: 5,
                                            background: '#dc3545',
                                            color: '#fff',
                                            borderRadius: 8,
                                            padding: '2px 7px',
                                            fontSize: 12,
                                            zIndex: 2
                                        }}>
                                            대표
                                        </span>
                                    )}
                                    {/* X 버튼 */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // 삭제 로직
                                            initImage(prev => prev.filter((_, i) => i !== idx));
                                            setFileCount(prev => prev - 1);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: 5,
                                            right: 5,
                                            background: '#fff',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: 24,
                                            height: 24,
                                            zIndex: 2,
                                            color: '#dc3545',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                        }}
                                    >×</button>
                                    {/* 이미지 클릭시 대표 지정 */}
                                    <Image
                                        src={getImages(img)}
                                        alt={`이미지${idx + 1}`}
                                        style={{
                                            width: '100px', height: '100px',
                                            objectFit: 'cover',
                                            borderRadius: 12,
                                            border: "1px solid #eee",
                                            opacity: idx === 0 ? 1 : 0.8,
                                            cursor: 'pointer'
                                        }}
                                        thumbnail
                                        onClick={() => {
                                            // 클릭한 이미지가 이미 대표라면 무시
                                            if (idx === 0) return;
                                            // 대표로 이동(맨 앞으로)
                                            initImage(prev => {
                                                const newArr = [...prev];
                                                const [selected] = newArr.splice(idx, 1);
                                                newArr.unshift(selected);
                                                return newArr;
                                            });
                                        }}
                                        title={idx === 0 ? "대표 이미지" : "대표로 지정"}
                                    />
                                </div>
                            ))}
                        </div>

                        <Button className="mt-2"
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleRemoveImage}
                        >
                            전체 이미지 다시 선택
                        </Button>
                    </Form.Group >


                    <div className="d-grid gap-2 mt-4">
                        <Button
                            style={{ background: "var(--base-color-5)", border: "none" }}
                            size="lg"
                            onClick={handleCreate}
                            disabled={images.length > 0 && fileCount !== images.length}
                        >
                            등록
                        </Button>
                    </div>
                </Form >
            </div >
        );
    };

