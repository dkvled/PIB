import React, { useState } from 'react';
import '../styles/Signup.css';

function Signup() {
  const [form, setForm] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 정규식 정의
    const idRegex = /^[a-zA-Z0-9]{4,16}$/;
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    const nicknameRegex = /^[가-힣a-zA-Z]{2,10}$/;
    const phoneRegex = /^010-\d{4}-\d{4}$/;

    // 정규식 검증
    if (!idRegex.test(form.id)) {
      alert("아이디는 4~16자의 영문 또는 숫자여야 합니다.");
      return;
    }
    if (!pwRegex.test(form.password)) {
      alert("비밀번호는 8~20자, 영문과 숫자를 포함해야 합니다.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!nicknameRegex.test(form.nickname)) {
      alert("닉네임은 2~10자의 한글 또는 영문이어야 합니다.");
      return;
    }
    if (!phoneRegex.test(form.phone)) {
      alert("전화번호 형식은 010-1234-5678이어야 합니다.");
      return;
    }

    // 서버 요청
    try {
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: form.id,
          password: form.password,
          nickname: form.nickname,
          phone: form.phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("회원가입 성공!");
        // TODO: 로그인 페이지 이동
      } else {
        alert("회원가입 실패: " + data.detail);
      }
    } catch (error) {
      alert("에러 발생: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={handleSubmit}>
        <h2>회원가입</h2>

        <label>아이디</label>
        <input
          type="text"
          name="id"
          value={form.id}
          onChange={handleChange}
          placeholder="영문/숫자 4~16자"
          required
        />

        <label>비밀번호</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="영문+숫자 포함 8~20자"
          required
        />

        <label>비밀번호 확인</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <label>닉네임</label>
        <input
          type="text"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          placeholder="한글 또는 영문 2~10자"
          required
        />

        <label>전화번호</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="010-1234-5678"
          required
        />

        <button type="submit" className="signup-button">회원가입</button>
      </form>
    </div>
  );
}

export default Signup;
