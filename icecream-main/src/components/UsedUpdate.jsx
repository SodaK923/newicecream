import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/supabase";
import { useImage } from "../hooks/useImage";
//import { getUser } from '../utils/getUser';
import { useUserTable } from "../hooks/useUserTable";
//import { useRegion } from "../hooks/useRegion";
import { Form, Button, FloatingLabel, InputGroup, Spinner, Image } from "react-bootstrap";

export function UsedUpdate() {
    // TODO: 수정 시간 업데이트
    const now = new Date().toISOString();
    const navigate = useNavigate();
    // url에서 가져옴
    const { item } = useParams();

    // 제목, 내용, 가격
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [price, setPrice] = useState("");
    // 기존 사진
    const [exPics, setExPics] = useState([]);
    const [location, setLocation] = useState("");

    // 새 지역 선택(안씀)
    // const { city, district } = useRegion();
    // const newLocation = `${city} ${district}`;

    // type-> 4: 벼룩해요 5: 드림해요 6. 구해요 7. 공구해요
    const [category, setCategory] = useState("");

    // useImage 훅
    const { images, setImages, getImages, initImage } = useImage();
    const [fileCount, setFileCount] = useState(0);
    const fileInputRef = useRef();

    // useUserTable 훅
    const { info: userInfo, loading, error } = useUserTable();

    // 카테고리 숫자->문자열로 변환
    const CATEGORY_MAP = {
        4: "sell",    // 중고거래
        5: "share",     // 구매
        6: "buy"  // 나눔
    };

    // 지역 정보인데 쓸 지 안쓸 지 모르겠음..
    //const { city, district } = useRegion();
    //const location = `${city} ${district}`;


    // 로그인 안됐으면 튕기게(중간에 로그아웃되면 막으라고 쓴 건데 효과없는 듯)
    // useEffect(() => {
    //     console.log("userInfo:", userInfo, "loading:", loading);
    //     if (!userInfo && !loading) {
    //         alert('로그인해야 글작성이 가능합니다.');
    //         navigate('/login');
    //     }
    // }, [loading, userInfo]);


    // 드림해요-> 가격 내용 비움(썼다가 중간에 바꾸면 내용이 남으므로 비워줌)
    useEffect(() => {
        if (category === "5") setPrice("");
    }, [category]);


    // 기존 내용 불러옴
    useEffect(() => {
        const fetchForm = async () => {
            const { data, error } = await supabase
                .from('trades')
                .select('*, categories(name)')
                .eq('id', item)
                .single();
            if (error) {
                console.log("error: ", error);
                console.log("data: ", data);
            }
            if (data) {
                setTitle(data.title)
                setContent(data.content)
                setPrice(data.price)
                setCategory(String(data.category_id))
                setLocation(data.location)
                //기존 이미지들 배열로 만듦
                setExPics([
                    data.main_img,
                    data.detail_img1,
                    data.detail_img2,
                    data.detail_img3,
                    data.detail_img4
                ].filter(Boolean)); //비어있는 건 뺌
            }
        }
        fetchForm();
    }, [item]);



    // fileCount: 사용자가 < input type = "file" multiple > 에서 고른 파일의 개수
    // images.length: 실제로 서버에 업로드 끝난 이미지 개수(useImage 훅에서 관리)
    // 이미지 업로드 개수 제한 함수
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        console.log(files);
        if (images.length+files.length > 5) {
            alert("사진은 최대 5장까지만 업로드할 수 있습니다.");
            fileInputRef.current.value="";
            return;
        }
        setFileCount(images.length+files.length);
        if (files.length > 0) {
            //setExPics([]);
            setImages(e); // 기존대로
        }
    }

    const handleRemoveImage = () => {
        initImage([]);
        setFileCount(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";   // input의 파일 선택 자체를 비움!
        }
    }

    // 새로 업로드한 이미지가 있으면 새이미지 저장
    const finalPics = (images.length > 0 ? images : exPics).filter(Boolean);

    // // 스토리지 경로 안붙었으면 붙이고 붙었으면 냅둠
    // const getFinalUrl = (img) => {
    //     if (!img) return null;
    //     return img.startsWith("http") ? img : getImages(img);
    // };


    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!userInfo) {
            alert("로그인해야 글수정이 가능합니다.");
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
        if (!confirm('게시글을 수정할까요?')) {
            return;
        }

        const { data, error } = await supabase
            .from('trades')
            .update({
                title,
                content,
                price: category === "5" ? 0 : Number(price),
                category_id: Number(category),
                location,
                main_img: images[0] ? images[0] : null,
                detail_img1: images[1] ? images[1] : null,
                detail_img2: images[2] ? images[2] : null,
                detail_img3: images[3] ? images[3] : null,
                detail_img4: images[4] ? images[4] : null,
                update_date: now
            })
            .eq('id', item)
            .select()
            .single();
        if (error) {
            console.log('error', error);
        } if (data) {
            //console.log(data)
            // todo: 글작성한 카테고리로 자동 이동하게 하기
            const categoryString = CATEGORY_MAP[category];
            const newItem = data.id;
            navigate(`/trade/${categoryString}/${newItem}`);
        }
    }


    return (
        <div className="p-4 rounded-4 shadow-sm bg-white" style={{ maxWidth: 600, margin: "40px auto" }}>
            <Form>
                <Form.Group className="mb-3" controlId="category">
                    <Form.Label>글수정</Form.Label>
                    <Form.Select value={category} onChange={e => setCategory(e.target.value)} required>
                        <option value="">카테고리 선택</option>
                        <option value="4">벼룩해요</option>
                        <option value="5">드림해요</option>
                        <option value="6">구해요</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="location">
                    <Form.Label>지역</Form.Label>
                    <Form.Control
                        value={location}
                        type="text"
                        disabled
                    />
                    <div className="form-text mt-1 text-muted" style={{ fontSize: 14 }}>
                        ※ 지역은 수정할 수 없습니다.
                    </div>
                </Form.Group>

                {/* 새 지역 선택(안씀) */}
                {/* <Form.Group className="mb-3" controlId="newLocation">
                    <Form.Label>지역</Form.Label>
                    <Form.Select value={newLocation}>
                        <option value="">{newLocation}</option>
                    </Form.Select>
                </Form.Group> */}

                <Form.Group className="mb-3" controlId="title">
                    <FloatingLabel label="제목">
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
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
                            placeholder="내용"
                            required
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group className="mb-3" controlId="price">
                    <InputGroup>
                        <Form.Control
                            type="number"
                            value={category === "5" ? 0 : price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder={category === "5" ? "나눔" : "가격"}
                            disabled={category === "5"}
                            min={0}
                            required={category !== "5"}
                        />
                        {category !== "5" && <InputGroup.Text>원</InputGroup.Text>}
                    </InputGroup>
                </Form.Group>

                {/* 기존 이미지 미리보기 */}
                <Form.Group className="mb-3">
                    <Form.Label>기존 이미지</Form.Label>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                        {exPics.length > 0 ? (
                            exPics.map((img, i) => (
                                <Image
                                    key={i}
                                    src={getImages(img)}
                                    alt={`기존 이미지 ${i + 1}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 12, border: "1px solid #eee" }}
                                    thumbnail
                                />
                            ))
                        ) : (
                            <div className="text-muted">기존 이미지 없음</div>
                        )}
                    </div>
                </Form.Group>

                {/* 새 이미지 업로드 */}
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
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                    <Button
                        style={{ background: "var(--base-color-5)", border: "none" }}
                        size="lg"
                        onClick={handleUpdate}
                        disabled={images.length > 0 && fileCount !== images.length}
                    >
                        수정
                    </Button>
                </div>
            </Form>
        </div>
    );
}