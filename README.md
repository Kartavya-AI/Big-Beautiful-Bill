# Big Beautiful Bill Analyzer
An AI-powered web application that provides personalized analysis of H.R. 1 "One Big Beautiful Bill" and its impact on businesses across different industries and sizes. Built with Next.js, TypeScript, and enhanced with Retrieval-Augmented Generation (RAG) for precise, context-aware legislative analysis.

## 🚀 Features

### Core Functionality
- **RAG-Enhanced Analysis**: Intelligent retrieval system that surfaces the most relevant bill sections based on your business profile
- **Industry-Specific Insights**: Tailored analysis for Technology, Healthcare, Manufacturing, Finance, Agriculture, Energy, and other sectors
- **Size-Aware Impact Assessment**: Different perspectives for startups, small businesses, medium enterprises, and large corporations
- **Real-time Chat Interface**: Interactive Q&A with an AI assistant specialized in legislative analysis
- **Compliance Timeline Tracking**: Key dates and implementation deadlines for regulatory requirements

### Advanced Features
- **Business Profile Setup**: Comprehensive onboarding to capture company details, industry, and size
- **Impact Visualization**: Visual indicators for opportunities, risks, and compliance requirements
- **Analysis Mode Toggle**: Quick summaries or detailed deep-dives based on user preference
- **Industry-Specific Prompts**: Curated question suggestions tailored to each business sector
- **Dark/Light Theme**: Responsive design with theme switching capability
- **Sidebar Navigation**: Persistent business context and suggested questions

## 🏗️ Architecture

### RAG Implementation
The application uses a sophisticated RAG (Retrieval-Augmented Generation) system:
1. **Document Chunking**: H.R. 1 bill content is segmented into logical sections
2. **Industry Mapping**: Predefined mappings between business types and relevant bill sections
3. **Contextual Retrieval**: Dynamic selection of relevant content based on business profile
4. **Enhanced Prompting**: Context-aware system prompts with retrieved sections
5. **Business Impact Analysis**: Automated generation of sector-specific impact assessments

### Technology Stack
- **Frontend**: Next.js 14 with TypeScript
- **UI Components**: Tailwind CSS with custom component library
- **AI Integration**: OpenAI GPT-4o-mini via AI SDK
- **State Management**: React hooks and context
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: Lucide React for consistent iconography

## 📋 Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager
- OpenAI API key

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kartavya-AI/Big-Beautiful-Bill.git
   cd Big-Beautiful-Bill
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open the application**
   Navigate to `http://localhost:3000` in your browser

## 🎯 Usage

### Getting Started
1. **Business Profile Setup**: Complete the initial form with your company details
2. **Industry Selection**: Choose your primary industry from the dropdown
3. **Company Size**: Select your organization size category
4. **Business Description**: Provide context about your operations and challenges

### Using the AI Assistant
1. **Automated Analysis**: The system automatically generates an initial impact assessment
2. **Ask Questions**: Use the chat interface to ask specific questions about the bill
3. **Industry Prompts**: Click on suggested questions tailored to your industry
4. **Analysis Modes**: Toggle between quick summaries and detailed analysis

### Key Features
- **Real-time Responses**: Get immediate answers about specific bill sections
- **Compliance Guidance**: Understand what actions your business needs to take
- **Financial Impact**: Quantified cost and savings estimates where applicable
- **Timeline Planning**: Implementation dates and regulatory deadlines

## 📊 Bill Content Coverage

The application covers all major sections of H.R. 1:

### Title I - Agriculture & Food
- SNAP program changes and work requirements
- Commodity program price adjustments
- Agricultural compliance timelines

### Title II - Defense & Security
- Navy shipbuilding and submarine procurement
- Munitions replenishment programs
- Border security technology investments

### Title III - Banking & Capital Markets
- CFPB funding limitations
- SEC reserve enhancements
- Financial regulatory compliance

### Title IV - Aviation & Spectrum
- FAA modernization funding
- Spectrum auction procedures
- Air traffic control improvements

### Title V - Energy & Natural Resources
- Clean energy credit phase-outs
- Offshore drilling lease requirements
- Coal royalty adjustments

### Title VI - Infrastructure
- Bridge repair grant programs
- Transportation funding reallocations
- Construction project timelines

### Title VII - Tax & Finance
- Child tax credit extensions
- Business expense deductions
- R&D tax credit restorations

### Title VIII - Healthcare & Labor
- Workforce development programs
- Healthcare staffing initiatives
- Education funding increases

### Title IX - Technology & Data
- Federal data modernization
- Government technology contracts
- Digital infrastructure investments

## 🔧 API Reference

### Chat Endpoint
```typescript
POST /api/chat
Content-Type: application/json

{
  "messages": Array<{role: string, content: string}>,
  "businessOverview": {
    "companyName": string,
    "industry": string,
    "size": string,
    "description": string
  },
  "analysisMode": "quick" | "detailed"
}
```

### Business Profile Structure
```typescript
interface BusinessOverview {
  companyName: string;
  industry: 'technology' | 'healthcare' | 'manufacturing' | 'finance' | 'agriculture' | 'energy' | 'other';
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  description: string;
}
```

## 🎨 Customization

### Industry Mappings
To add new industries or modify existing mappings, update the `INDUSTRY_MAPPINGS` object in `app/api/chat/route.ts`:

```typescript
const INDUSTRY_MAPPINGS = {
  newIndustry: ['Relevant Bill Section', 'Another Section'],
  // ... existing mappings
};
```

### Size-Based Analysis
Modify the `SIZE_IMPACT_MAPPINGS` to adjust how different company sizes are analyzed:

```typescript
const SIZE_IMPACT_MAPPINGS = {
  startup: ['Relevant Provisions', 'Tax Benefits'],
  // ... existing mappings
};
```

### UI Customization
The application uses Tailwind CSS. Customize the appearance by:
- Modifying the color scheme in `tailwind.config.js`
- Updating component styles in individual files
- Adding custom CSS classes as needed

## 🔍 RAG System Details

### Content Retrieval Logic
1. **Industry Matching**: Maps business industry to relevant bill sections
2. **Size-Based Filtering**: Considers company size for applicable provisions
3. **Contextual Ranking**: Prioritizes sections based on business description
4. **Fallback Mechanism**: Provides full bill content if no specific matches found

### Analysis Enhancement
1. **Automated Impact Assessment**: Generates sector-specific impact summaries
2. **Compliance Identification**: Highlights mandatory vs. optional provisions
3. **Timeline Extraction**: Identifies key implementation dates
4. **Cost-Benefit Analysis**: Provides financial impact estimates


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add comments for complex logic
- Test thoroughly before submitting

## 🙏 Acknowledgments

- OpenAI for providing the GPT-4 API
- Next.js team for the excellent framework
- Tailwind CSS for the utility-first styling approach
- The open-source community for various packages used

