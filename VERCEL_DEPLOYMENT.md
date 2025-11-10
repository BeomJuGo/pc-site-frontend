# Vercel 배포 가이드 (PC 사이트 프론트엔드)

## ✅ 현재 상태

프론트엔드 코드는 이미 환경 변수를 사용하도록 설정되어 있습니다:

- ✅ `src/utils/api.js` - `process.env.REACT_APP_API_URL` 사용
- ✅ `src/pages/Recommend.js` - `process.env.REACT_APP_API_URL` 사용

## 🔧 로컬 개발 환경 설정

### 1. `.env` 파일 생성

프로젝트 루트에 `.env` 파일을 생성하세요:

```env
REACT_APP_API_URL=http://localhost:10000
```

⚠️ **중요**: `.env` 파일은 Git에 커밋하지 마세요 (이미 `.gitignore`에 포함됨)

### 2. 백엔드 서버 실행

```bash
# 백엔드 디렉토리로 이동
cd C:\Users\lom00\Desktop\pc-site-backend-main

# 서버 실행
npm start
```

서버가 정상적으로 실행되면:
```
✅ 서버 실행 중: http://localhost:10000
```

### 3. 프론트엔드 실행

```bash
# 프론트엔드 디렉토리로 이동
cd C:\Users\lom00\Desktop\pc-site-frontend-main

# 개발 서버 실행
npm start
```

---

## 🚀 Vercel 배포 설정

### 1단계: Vercel 환경 변수 설정

1. Vercel 대시보드 접속: https://vercel.com
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. **Add New** 버튼 클릭
4. 다음 정보 입력:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://pc-site-backend.onrender.com`
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development (선택사항)
5. **Save** 클릭

⚠️ **중요**: 
- Render 백엔드 URL: `https://pc-site-backend.onrender.com`

### 2단계: 코드 푸시 및 배포

```bash
# 프론트엔드 디렉토리로 이동
cd C:\Users\lom00\Desktop\pc-site-frontend-main

# 변경사항 커밋 (필요한 경우)
git add .
git commit -m "Update for Vercel deployment"
git push origin main
```

Vercel은 GitHub와 연결되어 있으면 자동으로 배포합니다.

### 3단계: 재배포 (환경 변수 추가 후)

환경 변수를 추가한 후에는 반드시 재배포해야 합니다:

1. Vercel 대시보드 → **Deployments**
2. 최신 배포 선택
3. **Redeploy** 버튼 클릭

---

## 🧪 배포 후 테스트

### 1. 브라우저 콘솔 확인

1. 배포된 사이트 접속
2. 개발자 도구 (F12) → **Console** 탭
3. 에러 메시지 확인:
   - ❌ `Failed to fetch` → API URL 확인 필요
   - ❌ `CORS error` → 백엔드 CORS 설정 확인 필요
   - ✅ 에러 없음 → 정상 작동

### 2. Network 탭 확인

1. 개발자 도구 → **Network** 탭
2. 페이지 새로고침
3. API 요청 확인:
   - 요청 URL이 Render 백엔드 URL을 가리키는지 확인
   - 상태 코드가 200인지 확인

### 3. 기능 테스트

- ✅ 홈 페이지 로드
- ✅ 카테고리 페이지 (CPU, GPU 등)
- ✅ 부품 상세 페이지
- ✅ AI 추천 기능

---

## ⚠️ 중요 사항

### React 환경 변수 규칙

1. **접두사 필수**: 클라이언트에 노출하려면 `REACT_APP_` 접두사가 필요합니다
2. **빌드 타임**: 환경 변수는 빌드 시점에 주입됩니다
3. **재배포 필요**: 환경 변수를 변경한 후에는 반드시 재배포해야 합니다

### 환경 변수 이름

- ✅ 올바른 이름: `REACT_APP_API_URL`
- ❌ 잘못된 이름: `API_URL` (REACT_APP_ 접두사 없음)
- ❌ 잘못된 이름: `VITE_API_BASE` (Vite용, React와 다름)

---

## 🔍 문제 해결

### 문제 1: API 요청이 localhost로 가는 경우

**증상**: Network 탭에서 `http://localhost:10000`으로 요청이 감

**원인**: 환경 변수가 제대로 설정되지 않음

**해결**:
1. Vercel 대시보드 → Settings → Environment Variables
2. `REACT_APP_API_URL` 확인 및 수정
3. **Redeploy** 클릭

### 문제 2: 빌드는 성공하지만 API 호출 실패

**확인 사항**:
1. 환경 변수 이름이 `REACT_APP_API_URL`인지 확인
2. Render 백엔드가 실행 중인지 확인:
   ```bash
   curl https://pc-site-backend.onrender.com/api/health
   ```
3. 브라우저 콘솔에서 실제 사용되는 API URL 확인:
   ```javascript
   console.log(process.env.REACT_APP_API_URL);
   ```

### 문제 3: CORS 에러

**증상**: 콘솔에 `CORS policy` 에러

**원인**: 백엔드 CORS 설정에 Vercel 도메인이 없음

**해결**:
1. Render 대시보드 → Environment Variables
2. `ALLOWED_ORIGINS`에 Vercel URL 추가:
   ```
   ALLOWED_ORIGINS=https://your-project.vercel.app,https://goodpricepc.vercel.app
   ```
3. Render 서비스 재배포

---

## 📝 체크리스트

배포 전 확인:

- [ ] `.env` 파일 생성 (로컬 개발용)
- [ ] Vercel 환경 변수 `REACT_APP_API_URL` 설정
- [ ] Render 백엔드 URL 확인
- [ ] 코드 푸시 및 배포
- [ ] 배포 후 재배포 (환경 변수 추가 후)
- [ ] 브라우저에서 테스트
- [ ] Network 탭에서 API 요청 확인

---

## 📚 참고 자료

- [Create React App 환경 변수 문서](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Vercel 환경 변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)

---

**마지막 업데이트**: 2025년 1월

