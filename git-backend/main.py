from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from datetime import datetime
import secrets
from typing import List

from database import SessionLocal, engine
from models import Base, User, Post

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# DB 세션 의존성

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 회원가입 모델
class SignupRequest(BaseModel):
    username: str
    password: str
    nickname: str
    phone: str

# 로그인 모델
class LoginRequest(BaseModel):
    username: str
    password: str

# 글 작성 모델
class PostCreate(BaseModel):
    author: str
    title: str
    content: str
    image_urls: List[str] = []
    category: str


# 회원가입 API
@app.post("/api/signup")
async def api_signup(data: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == data.username).first()
    if existing_user:
        return JSONResponse(status_code=400, content={"detail": "이미 존재하는 사용자입니다"})

    new_user = User(
        username=data.username,
        password=data.password,
        nickname=data.nickname,
        phone=data.phone
    )
    db.add(new_user)
    db.commit()
    return {"message": "회원가입 성공!"}

# 로그인 API
@app.post("/api/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or user.password != data.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="아이디 또는 비밀번호가 틀렸습니다.")
    return {"message": "로그인 성공", "nickname": user.nickname}

# 사용자 전체 목록 조회
@app.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    if not users:
        raise HTTPException(status_code=404, detail="등록된 사용자가 없습니다")
    return jsonable_encoder(users)

# 게시글 작성 API

@app.post("/api/posts")
def create_post(data: PostCreate, db: Session = Depends(get_db)):
    new_post = Post(
        author=data.author,
        title=data.title,
        content=data.content,
        image_urls=",".join(data.image_urls),
        created_at=datetime.utcnow(),
        category="community"  # 또는 따로 받을 수도 있음
    )
    db.add(new_post)
    db.commit()
    return {"message": "게시글 등록 완료!"}




# 루트 확인용
@app.get("/")
async def home():
    return {"message": "백엔드 서버가 정상적으로 실행 중입니다!"}