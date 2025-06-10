import React, { useState, useEffect, useContext } from 'react';
import '../styles/Community.css';
import pibLogo from '../assets/piblogo.png';
import background from '../assets/background.png'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Cat() {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState('latest');
  const postsPerPage = 5;
  const navigate = useNavigate();

  const titles = [
  '고양이가 사료를 안 먹어요', '모래를 자꾸 밖에다 싸요', '스크래쳐 추천해 주세요',
  '고양이 털 관리 어떻게 하세요?', '중성화 수술 후 주의사항 궁금해요',
  '고양이가 자꾸 깨물어요', '고양이 캣타워 어떤 거 쓰시나요?'
  ];

  const contents = [
    '기호성 좋은 사료 없을까요? 요즘 밥을 안 먹어요...',
    '화장실 바로 옆에 싸는 경우가 많아요. 왜 그럴까요?',
    '스크래쳐를 자꾸 무시해요... 잘 쓰는 제품 추천 좀!',
    '장모종인데 털이 너무 빠져서 고민이에요. 어떻게 관리하시나요?',
    '중성화 수술 후에 애가 너무 처져있는데 이게 정상인가요?',
    '놀다가 갑자기 손을 깨물어요. 공격성인가요?',
    '튼튼하고 안정감 있는 캣타워 추천 부탁드려요!'
  ];


  const authors = [
    '지우', '정우', '수빈', '은지', '현지', '민수', '도윤'
  ];


  const date = [
    '2025-06-11', '2025-06-10', '2025-06-10', '2025-06-09', '2025-06-08', '2025-06-07', '2025-06-06'
  ]
  const views = [3, 4, 7, 5, 30, 23, 9];

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

export default Cat;
