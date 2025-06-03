import React, { useState } from 'react';
import '../styles/WritePost.css';
import background from '../assets/background.png';
import { useNavigate, useLocation } from 'react-router-dom';

function WritePost() {
  const [form, setForm] = useState({ title: '', content: '' });
  const [images, setImages] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImages([...images, { file, preview: imageURL }]);
    }
  };

  const handleImageDelete = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview); // 메모리 누수 방지
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const category = location.state?.returnTo?.split("/")[1] || "community";

    try {
      const response = await fetch("http://localhost:8000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          image_urls: images.map(img => img.preview).join(","),
          author: "익명", // 로그인 연동하면 사용자 닉네임으로 교체
          category: category
        })
      });

      if (response.ok) {
        alert("작성 완료!");
        navigate(`/${category}`);
      } else {
        alert("작성 실패!");
      }
    } catch (error) {
      alert("서버 오류 발생!");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: '500px auto',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top left',
        minHeight: '100vh',
      }}
    >
      <div className="container-wrapper">
        <div className="write-post-container">
          <h2>글 작성하기</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>제목</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label>내용</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
              />
            </div>

            <div className="image-upload-section">
              <label>사진추가</label>
              <div className="image-boxes">
                {images.map((imgObj, idx) => (
                  <div className="image-box preview" key={idx}>
                    <img src={imgObj.preview} alt={`preview-${idx}`} />
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleImageDelete(idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label className="image-box add">
                  <span>＋</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <button type="submit">작성하기</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WritePost;
