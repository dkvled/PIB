import React, { useState, useEffect, useContext } from 'react';
import '../styles/Community.css';
import pibLogo from '../assets/piblogo.png';
import background from '../assets/background.png'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Community() {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState('latest');
  const postsPerPage = 5;
  const navigate = useNavigate();

  const titles = [
  '우리 동네 동물병원 추천해요', '강아지랑 고양이 같이 키우는 분 계신가요?', '반려동물 보험 들어야 할까요?', 
  '처음 입양했는데 뭐부터 준비해야 할까요?', '펫카페 괜찮은 곳 있을까요?', '슬개골 탈구 수술 경험 공유해요', 
  '동물등록 꼭 해야 하나요?'
  ];

  const contents = [
    '동물병원이 너무 많아서 어디로 가야 할지 모르겠어요. 추천 좀 부탁드려요!',
    '강아지랑 고양이 같이 키울 때 주의할 점 있을까요?',
    '반려동물 보험이 좋다고 하는데 실제로 도움 되나요?',
    '처음 반려동물 입양했는데 어떤 준비물부터 챙기면 좋을까요?',
    '서울 강서구 쪽에 괜찮은 펫카페 아시는 분 있나요?',
    '슬개골 탈구 수술한 후기 남겨요. 고민하시는 분 참고하세요.',
    '동물등록 안 하면 벌금 있다던데 꼭 해야 하나요?'
  ];


  const authors = [
    user.nickname, '민수', '지우', '정우', '수빈', '은지', '도윤'
  ];


  const date = [
    '2025-06-11', '2025-06-10', '2025-06-10', '2025-06-09', '2025-06-08', '2025-06-07', '2025-06-06'
  ]
  const views = [0, 2, 8, 15, 30, 19, 5];

  const posts = [...Array(7)].map((_, i) => ({
    id: i,
    title: titles[i],
    content: contents[i],
    author: authors[i],
    date: date[i],
    views: views[i]
  }));

  const sortPosts = (posts, type) => {
    return [...posts].sort((a, b) => {
      if (type === 'latest') {
        return new Date(b.date) - new Date(a.date);
      } else if (type === 'popular') {
        return b.views - a.views;
      }
      return 0;
    });
  };

  useEffect(() => {
    setFilteredPosts(sortPosts(posts, sortType));
  }, [sortType]);

  const handleSearch = () => {
    const keyword = searchTerm.toLowerCase();
    const result = posts.filter(
      post => post.title.toLowerCase().includes(keyword) ||
              post.content.toLowerCase().includes(keyword)
    );
    setFilteredPosts(sortPosts(result, sortType));
    setCurrentPage(1);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div   
    style={{
    backgroundImage: `url(${background})`,
    backgroundSize: '500px auto',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'top left',
    minHeight: '100vh',
  }}>

      <div className= "community-wrapper">
        <div className="community-container" >
          <h2 className="board-title">커뮤니티 게시판</h2>

          <div className="search-bar">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>검색</button>
            <button className="write-button" onClick={() => navigate('/writepost', { state: { returnTo: '/community' } })}>글쓰기</button>
          </div>

          <div className="sort-options">
            <label>
              <input
                type="radio"
                name="sort"
                checked={sortType === 'latest'}
                onChange={() => setSortType('latest')}
              />
              최신순
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                checked={sortType === 'popular'}
                onChange={() => setSortType('popular')}
              />
              인기순
            </label>
          </div>

           <div className="post-header">
            <div className="post-header-left">내용</div>
            <div className="post-header-right">
              <div>날짜</div>
              <div>조회수</div>
            </div>
          </div>

          <div className="post-list">
            {currentPosts.map((post) => (
              <div className="post-item" key={post.id}>
                <div className="post-left">
                  <Link to="/postview" className="post-title-link">
                    <div className="post-title">{post.title}</div>
                  </Link>

                  <div className="post-content">{post.content}</div>
                  <div className="post-footer">{post.author}</div>
                </div>
                <div className="post-right">
                  <div className="post-meta">
                    <div className="meta-date">{post.date}</div>
                    <div className="meta-views">{post.views}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <span onClick={() => handlePageClick(Math.max(1, currentPage - 1))}>&lt;</span>
            {[...Array(totalPages)].map((_, i) => (
              <span
                key={i}
                onClick={() => handlePageClick(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </span>
            ))}
            <span onClick={() => handlePageClick(Math.min(totalPages, currentPage + 1))}>&gt;</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Community;
