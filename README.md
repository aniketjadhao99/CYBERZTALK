# Cyberztalk - AI-Powered Cybercrime Assistance Platform

A comprehensive, modern web application designed to provide AI-powered support and expert assistance to cybercrime victims.

## 📁 Website Structure

### Public Pages (Non-Authenticated Users)
- **index.html** - Home landing page with hero section and value propositions
- **features.html** - Platform features showcase
- **resources.html** - Knowledge base with security guides and intelligence
- **report-incident.html** - Multi-step incident reporting form with progress tracking
- **about-us.html** - Company mission, values, and information
- **login.html** - User authentication page
- **get-started.html** - User registration/signup page

### Admin/Authenticated Pages
- **admin-dashboard.html** - Main dashboard with statistics, charts, and recent cases overview
- **case-management.html** - Case list management with filters, search, and bulk actions
- **expert-chat.html** - Secure communication interface with experts and case details

## 🎨 Design System

### Colors
- **Primary**: #006688 (Teal Blue)
- **Primary Container**: #00c2ff (Light Blue)
- **Secondary**: #006b5f (Teal Green)
- **Surface**: #faf8ff (Light Background)
- **On Surface**: #131b2e (Dark Text)
- **Error**: #ba1a1a (Red)

### Typography
- **Headlines**: Geist Font (600-700 weight)
- **Body**: Inter Font (400-600 weight)
- **Font Sizes**: 48px (XL), 32px (LG), 24px (MD), 18px (Body LG), 16px (Body MD), 14px (Label MD)

### Styling Framework
- Tailwind CSS for responsive design
- Material Symbols for icons
- Custom CSS for animations and hover effects

## 🔒 Security & Non-Editable Elements

### Read-Only Fields (Non-Changeable)
All critical user input fields in the incident reporting form are marked as `readonly`:
- Full Name
- Email Address
- Mobile Number

These fields maintain data integrity and prevent unauthorized modifications.

### Protected Pages
Admin pages (Dashboard, Case Management, Expert Chat) include:
- Sidebar navigation for secure access
- User authentication indicators
- Session management UI
- Encrypted communication badges

## ✨ Features Implemented

### Home Page
- Hero section with AI-powered messaging
- Value propositions (Security, Privacy, 24/7)
- Navigation bar with all main sections
- Call-to-action buttons
- Professional footer

### Features Page
- 6 key platform features with icons
- Detailed descriptions
- Hover animations
- Feature cards

### Resources Page
- Search functionality
- Category filtering (Cyber Fraud, Phishing, Social Media, Privacy)
- Featured intelligence section
- Latest resources carousel
- Min read indicators

### Report Incident Page
- 8-step form wizard
- Progress tracking sidebar
- Form validation fields
- Category selection
- Step navigation buttons
- Form sections for:
  - Victim information
  - Incident category
  - Detailed description
  - Platform affected
  - Suspect information
  - Evidence collection
  - Priority assessment
  - Final review

### About Us Page
- Company mission statement
- Core values (Privacy First, Compassion, Expertise)
- Key features highlights
- Call-to-action section

### Admin Dashboard
- Sidebar navigation with main menu
- Statistics cards (Total Cases, New, Active, Resolved, High Priority)
- Monthly trends chart placeholder
- Case categories chart placeholder
- Recent cases table with status indicators
- Responsive layout

### Case Management
- Advanced filtering (Status, Priority, Category, Date Range)
- Search functionality
- Bulk actions with checkboxes
- Case list table with:
  - Case ID
  - Victim name with avatars
  - Incident type
  - Date submitted
  - Priority levels (High, Critical, Medium, Low)
  - Assigned expert
  - Status badges (New, Assigned, Under Review, Escalated)
- Pagination controls
- Export data button

### Expert Chat
- Three-panel layout (Conversations, Chat, Case Details)
- Message history with timestamps
- User avatars
- Encryption badges
- File attachment support
- Case details sidebar with:
  - Priority level
  - Incident type
  - Status progress bar
  - Assigned expert info
  - Quick action buttons
- Message input with emoji and file support

### Authentication Pages
- Login page with email/password and social login
- Get Started page with registration form
- Remember me checkbox
- Forgot password link
- Terms and privacy policy links
- All fields marked as non-editable for demo purposes

## 🚀 Getting Started

1. Open `index.html` in a web browser to view the home page
2. Use the navigation menu to explore all sections
3. Click "Get Started" to register (demo page)
4. Click "Login" to authenticate (demo page)
5. Access admin pages through direct URLs:
   - `/admin-dashboard.html`
   - `/case-management.html`
   - `/expert-chat.html`

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints for tablet (768px) and desktop (1024px)
- Touch-friendly navigation
- Optimized layouts for all screen sizes

## 🔗 Navigation Flow

```
Home (index.html)
├── Features
├── Report Incident (Multi-step form)
├── Resources (Knowledge base)
├── About Us
├── Login
└── Get Started

Admin Section
├── Dashboard
├── Case Management
├── Expert Chat
├── Settings
└── Support
```

## 🛠️ Technical Stack

- **HTML5**: Semantic structure
- **Tailwind CSS**: Responsive styling and components
- **JavaScript**: Navigation and form interactions
- **Material Design Icons**: Professional iconography
- **Google Fonts**: Geist and Inter typography

## 📝 Notes

- All pages include consistent navigation and footer
- Color scheme follows Material Design 3 guidelines
- Hover effects and transitions for better UX
- Non-editable fields prevent unauthorized modifications
- Chart placeholders ready for integration with charting libraries
- All links are functional and navigate correctly

## 🔐 Security Considerations

- Forms include read-only fields for sensitive data
- Encryption badges on communication pages
- Session indicators in admin section
- Privacy-first messaging throughout
- Compliance links in footer

---

**Created**: June 2024
**Platform**: Cyberztalk Intelligence
**Version**: 1.0
