# ดวงหวย - แอปทำนายและวิเคราะห์เลขเด็ด

แอปพลิเคชันทำนายดวงและวิเคราะห์เลขเด็ดหวยด้วยเทคโนโลยี AI และระบบสมาชิก VIP

## 🚀 คุณสมบัติหลัก

- **Landing Page** - หน้าแนะนำแอปพร้อม CTA
- **ระบบสมาชิก** - Login/Register ด้วย Firebase Auth
- **หน้าหลัก** - Feed แสดงเลขเด็ดและข่าวหวย
- **โปรไฟล์** - จัดการข้อมูลส่วนตัวและประวัติ
- **ระบบ VIP** - อัพเกรดสมาชิกพิเศษ
- **AI เลขเด็ด** - วิเคราะห์เลขเด็ดด้วย AI
- **ระบบแอดมิน** - จัดการข่าวและเลขเด็ด
- **การแจ้งเตือน** - ระบบแจ้งเตือนแบบเรียลไทม์

## 🛠 เทคโนโลยีที่ใช้

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **State Management**: React Context + Firebase

## 📁 โครงสร้างโปรเจกต์

\`\`\`
duang-huay-app/
├── app/
│   ├── page.tsx              # Landing Page
│   ├── login/page.tsx        # หน้า Login
│   ├── register/page.tsx     # หน้า Register
│   ├── home/page.tsx         # หน้าหลัก (Feed)
│   ├── profile/page.tsx      # หน้าโปรไฟล์
│   ├── vip/page.tsx          # หน้า VIP
│   ├── ai-lucky/page.tsx     # หน้า AI เลขเด็ด
│   ├── admin/page.tsx        # หน้าแอดมิน
│   ├── notification/page.tsx # หน้าการแจ้งเตือน
│   ├── layout.tsx            # Root Layout
│   └── globals.css           # Global Styles
├── components/
│   ├── navbar.tsx            # Navigation Bar
│   ├── hero.tsx              # Hero Section
│   ├── features.tsx          # Features Section
│   ├── cta.tsx               # Call to Action
│   ├── protected-route.tsx   # Protected Route Component
│   └── ui/                   # shadcn/ui Components
├── lib/
│   ├── firebase.ts           # Firebase Configuration
│   ├── auth-context.tsx      # Authentication Context
│   └── utils.ts              # Utility Functions
├── types/
│   └── index.ts              # TypeScript Types
├── public/                   # Static Assets
├── tailwind.config.ts        # Tailwind Configuration
├── package.json              # Dependencies
└── README.md                 # Documentation
\`\`\`

## 🔧 การติดตั้งและใช้งาน

### 1. Clone Repository

\`\`\`bash
git clone <repository-url>
cd duang-huay-app
\`\`\`

### 2. ติดตั้ง Dependencies

\`\`\`bash
npm install
# หรือ
yarn install
\`\`\`

### 3. ตั้งค่า Firebase

1. สร้างโปรเจกต์ใหม่ใน [Firebase Console](https://console.firebase.google.com)
2. เปิดใช้งาน Authentication (Email/Password)
3. สร้าง Firestore Database
4. เปิดใช้งาน Storage
5. คัดลอก Firebase Config ไปใส่ใน `lib/firebase.ts`

### 4. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local`:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
\`\`\`

### 5. รันโปรเจกต์

\`\`\`bash
npm run dev
# หรือ
yarn dev
\`\`\`

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 🔐 การตั้งค่า Firebase Security Rules

### Firestore Rules

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Lucky numbers are readable by all authenticated users
    match /luckyNumbers/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // News are readable by all authenticated users
    match /news/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Lucky history is private to each user
    match /luckyHistory/{document} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
\`\`\`

### Storage Rules

\`\`\`javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## 📊 โครงสร้างฐานข้อมูล Firestore

### Collection: users
\`\`\`typescript
{
  uid: string,
  name: string,
  email: string,
  isVIP: boolean,
  isAdmin?: boolean,
  createdAt: Timestamp,
  vipPlan?: 'monthly' | 'quarterly' | 'yearly',
  vipStartDate?: Timestamp,
  vipEndDate?: Timestamp,
  notificationSettings?: {
    luckyNumbers: boolean,
    news: boolean,
    vip: boolean,
    system: boolean
  }
}
\`\`\`

### Collection: luckyNumbers
\`\`\`typescript
{
  numbers: string[],
  date: string,
  confidence: number,
  type: 'ai' | 'traditional',
  reasoning?: string,
  createdAt: Timestamp
}
\`\`\`

### Collection: news
\`\`\`typescript
{
  title: string,
  content: string,
  category: string,
  date: string,
  createdAt: Timestamp
}
\`\`\`

### Collection: luckyHistory
\`\`\`typescript
{
  userId: string,
  numbers: string[],
  date: string,
  type: 'ai' | 'traditional',
  confidence?: number,
  reasoning?: string,
  result?: 'win' | 'lose',
  question?: string
}
\`\`\`

## 🎯 TODO และการพัฒนาต่อ

### Phase 1 (ปัจจุบัน)
- ✅ ระบบ Authentication
- ✅ UI/UX พื้นฐาน
- ✅ ระบบ VIP
- ✅ CRUD ข่าวและเลขเด็ด

### Phase 2 (ถัดไป)
- [ ] **AI Integration**: เชื่อมต่อ OpenAI/Gemini API
- [ ] **Payment System**: เชื่อม Stripe/Omise สำหรับ VIP
- [ ] **Push Notifications**: Firebase Cloud Messaging
- [ ] **Analytics**: Google Analytics + Custom Dashboard
- [ ] **Performance**: Image optimization, Caching

### Phase 3 (อนาคต)
- [ ] **Mobile App**: React Native version
- [ ] **Advanced AI**: Custom ML models
- [ ] **Social Features**: Community, Sharing
- [ ] **Gamification**: Points, Badges, Leaderboard

## 🔧 การปรับแต่งและขยายระบบ

### เพิ่ม AI Provider ใหม่

1. ติดตั้ง AI SDK:
\`\`\`bash
npm install @ai-sdk/openai
# หรือ
npm install @ai-sdk/google
\`\`\`

2. เพิ่ม Environment Variables:
\`\`\`env
OPENAI_API_KEY=your-openai-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key
\`\`\`

3. อัพเดต AI Lucky Page:
\`\`\`typescript
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

const { text } = await generateText({
  model: openai('gpt-4'),
  prompt: 'Analyze lottery numbers based on...'
})
\`\`\`

### เพิ่มระบบการชำระเงิน

1. ติดตั้ง Stripe:
\`\`\`bash
npm install stripe @stripe/stripe-js
\`\`\`

2. สร้าง API Route:
\`\`\`typescript
// app/api/create-payment-intent/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  // Handle payment logic
}
\`\`\`

## 🚀 การ Deploy

### Vercel (แนะนำ)

1. Push โค้ดไป GitHub
2. เชื่อม Vercel กับ Repository
3. ตั้งค่า Environment Variables ใน Vercel Dashboard
4. Deploy อัตโนมัติ

### Firebase Hosting

\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
\`\`\`

## 📞 การสนับสนุน

หากมีปัญหาหรือข้อสงสัย:

1. ตรวจสอบ Console ใน Browser Developer Tools
2. ดู Firebase Console สำหรับ errors
3. ตรวจสอบ Network tab สำหรับ API calls
4. อ่าน Documentation ของ Firebase และ Next.js

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

---

**หมายเหตุ**: โปรเจกต์นี้เป็น template พื้นฐาน ต้องปรับแต่งและเพิ่มความปลอดภัยเพิ่มเติมก่อนใช้งานจริง
