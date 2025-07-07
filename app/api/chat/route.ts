import { openai, createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// H.R. 1 Bill Content - "One Big Beautiful Bill"
const HR1_BILL_CONTENT = `
H.R. 1 – 'One Big Beautiful Bill'

1. Tax & Finance (Title VII)
Sec 701 – Extension of Personal Tax Provisions
- Child Tax Credit (Sec 701(a), new §24(h)): extends $2,000 per qualifying child through tax year 2027; refundable amount
- Earned Income Tax Credit (Sec 701(b), §32(m)): indexed phase-in; phase-out thresholds +5%.
- Qualified Business Income Deduction (Sec 701(c), §199A(g)): maintains 20% deduction; expands aggregation rules.
Sec 702 – New Income Exclusions
- Tips & Overtime (Sec 702(a), amending §61): excludes up to $5,000 of documented tips and overtime pay annually.
- Car-Loan Interest (Sec 702(b), new §163(r)): up to $500 interest on vehicle loans excluded from AGI.
Sec 703 – 'Trump Accounts' Pilot
- Pilot Program (Sec 703(a), new Chapter 72): $2B over FY26–30 for defined-contribution retirement plans for political staff
Sec 704 – Business Credits & Depreciation
- Full Expensing (Sec 704(a), §179): expensing cap $2.5M indexed, permanent.
- R&D Bonus Depreciation (Sec 704(b), §174): immediate expensing restored; amortization repeal.
- Advanced Manufacturing Credit (Sec 704(c), new §45X): $1B/year for semiconductors and battery components, FY26–35
Sec 705 – Clean-Energy Credit Phase-Out
- Renewable Electricity (Sec 705(a), §45): phases out by 5% annually, 0% by Jan 1, 2030.
- Electric Vehicle Credit (Sec 705(b), §30D): extends to used EVs with $3,000 cap; title-hold requirement 3 months.

2. Banking & Capital Markets (Title III)
Sec 301 – CFPB Funding Cap
- Spending Limit (Sec 301(a), new §1024(g)): caps CFPB discretionary budget at $1.2B (FY26 baseline).
Sec 302 – SEC Reserve Enhancement
- Reserve Transfer (Sec 302(a), new to §4 SEA): up to $250M/year from CFPB excess to Investor Protection Fund.
Sec 303 – DPA Reallocation
- Unused Loan Authority (Sec 303(a), DPA §101): $1B reprogrammed to Defense Production Reinvestment Fund.

3. Energy & Natural Resources (Title V)
Sec 501 – Outer Continental Shelf Leasing
- Lease Sale Mandate (Sec 501(a), OCSLA §18): five sales by Dec 31, 2026; 37.5% revenue-sharing.
Sec 502 – Coal Royalty Adjustment
- Royalty Rate (Sec 502(a), MLA §6): onshore coal rate 12.5% -> 15% effective Jan 1, 2027.
Sec 503 – Strategic Petroleum Reserve
- Authority Rescission (Sec 503(a)): rescinds 40% of unexpended drawdown (~$3B).
- Refill Infrastructure (Sec 503(b)): $500M for pipeline and port modernization, FY26–28.
Sec 504 – Hydropower Licensing
- License Fees (Sec 504(a), FPA §23): fee waiver for <10MW small hydro projects through 2030.
- Dredging Grants (Sec 504(b)): $300M for reservoir sediment removal, FY26–30.

4. Agriculture & Food (Title I)
Sec 101 – SNAP Rebase & Indexing
- Thrifty Food Plan (Sec 101(a), FNA §3): rebases Oct 1, 2025; ties adjustments to CPI-U.
Sec 102 – ABAWD Work Requirements
- Uniform Rule (Sec 102(a), §6(o)): 3-month limit per 36-month period.
- Waiver Criteria (Sec 102(b)): aligned waivers; AK/HI exempt through 2028.
Sec 103 – Elderly/Disabled Utility & Shelter
- Utility Allowance (Sec 103(a), §5(d)(2)): 10% increase.
- Internet Fees Prohibition (Sec 103(b)): bars internet as shelter expense.
Sec 104 – State Cost-Share & Admin Match
- Error-Rate Surcharge (Sec 104(a), new §16A): up to 15% surcharge on excess error costs.
- Administrative Funding (Sec 104(b)): federal match 75% from FY28.
Sec 105 – Commodity Programs
- PLC Reference Prices (Sec 105(a), §9019): corn +3%, soy +2%, wheat +2%; inflation cap 13%.
- Base Acre Expansion (Sec 105(b)): +30M acres through 2026.
- Election Lock-In (Sec 105(c)): locks 2025 elections through 2031; higher of PLC or ARC paid.

5. Healthcare & Labor (Title VIII)
Sec 801 – Higher Education Finance
- Pell Grants (Sec 801(a), HEA §401(b)): +$500 max award, FY26+.
- FAFSA Simplification (Sec 801(b)): IRS data-match; removes Asset Protection Allowance.
Sec 802 – PLUS Loan Limits
- Cap Increase (Sec 802(a), HEA §428B): cap raised to $15K/year, AY26–27.
Sec 803 – Workforce Development
- Sector Partnerships (Sec 803(a)): $2B, FY26–30; non-compete ban required.
- Apprenticeship Grants (Sec 803(b)): $200M, FY26–27.
Sec 804 – Health Workforce
- J-1 Visa Waivers (Sec 804(a)): accelerated for HPSA service.
- Community Health Centers (Sec 804(b)): $300M HRSA staffing grants, FY26–30.

6. Technology & Data (Title IX)
Sec 901 – OMB Data Modernization
- Modernization Fund: $100M for federal data platform.
Sec 402 – FAA Spectrum Auction (Title IV)
- 5GHz Safety Band: ~$5B proceeds; to AATF.
- Deployment Delay Waiver: 1-year equipment retrofit extensions.
Sec 403 – ATC Modernization
- NextGen Funding: $3B, FY26–30; 1,000 new controller trainees by FY27.

7. Defense & Security Contracting (Title II)
Sec 201 – Navy Shipbuilding
- Aircraft Carriers & Subs: $12B for 2 carriers; $8B for 5 subs, FY26.
Sec 203 – Munitions Replenishment
- $15B stockpile rebuild: LRASM, 155mm rounds.
Sec 209 – Border Security Tech
- Surveillance Systems: $3B sensors, towers, radar.
- Facility Construction: $1.5B for 20 centers by FY28.

8. Infrastructure & Construction (Title II & VI)
Sec 215 – MILCON Projects
- Barracks & Housing: $2.5B for 15 renovation projects, FY26–28.
- DoDEA Schools: $600M for 4 overseas campuses.
Sec 601 – STP Climate Funds Reallocation
- Bridge Repair Grants: $1.2B to Bridge Investment Program; min $50M/state.
`;

const INDUSTRY_MAPPINGS = {
  technology: ['Technology & Data', 'R&D Bonus Depreciation', 'Advanced Manufacturing Credit', 'Data Modernization'],
  healthcare: ['Healthcare & Labor', 'Health Workforce', 'Community Health Centers', 'J-1 Visa Waivers'],
  manufacturing: ['Advanced Manufacturing Credit', 'Full Expensing', 'R&D Bonus Depreciation', 'Clean-Energy Credit Phase-Out'],
  finance: ['Banking & Capital Markets', 'CFPB Funding Cap', 'SEC Reserve Enhancement'],
  agriculture: ['Agriculture & Food', 'SNAP Rebase', 'Commodity Programs', 'PLC Reference Prices'],
  energy: ['Energy & Natural Resources', 'Clean-Energy Credit Phase-Out', 'Outer Continental Shelf Leasing', 'Coal Royalty Adjustment'],
  defense: ['Defense & Security Contracting', 'Navy Shipbuilding', 'Munitions Replenishment'],
  education: ['Higher Education Finance', 'Pell Grants', 'PLUS Loan Limits', 'Workforce Development'],
  construction: ['Infrastructure & Construction', 'MILCON Projects', 'Bridge Repair Grants'],
  retail: ['Tax & Finance', 'Tips & Overtime', 'Child Tax Credit', 'Qualified Business Income Deduction'],
  transportation: ['ATC Modernization', 'NextGen Funding', 'FAA Spectrum Auction']
};

const SIZE_IMPACT_MAPPINGS = {
  startup: ['Tips & Overtime', 'R&D Bonus Depreciation', 'Full Expensing', 'Workforce Development'],
  small: ['Qualified Business Income Deduction', 'Full Expensing', 'Tips & Overtime', 'Child Tax Credit'],
  medium: ['Advanced Manufacturing Credit', 'Full Expensing', 'Workforce Development', 'Non-compete ban'],
  large: ['Advanced Manufacturing Credit', 'R&D Bonus Depreciation', 'CFPB regulations', 'Clean-Energy Credit Phase-Out'],
  enterprise: ['Banking & Capital Markets', 'SEC Reserve Enhancement', 'Advanced Manufacturing Credit', 'Clean-Energy Credit Phase-Out']
};

function retrieveRelevantSections(businessOverview: any): string {
  if (!businessOverview) return HR1_BILL_CONTENT;

  const { industry, size, description } = businessOverview;
  const relevantSections: string[] = [];

  const industryKey = industry.toLowerCase();
  const industryKeywords = (industryKey in INDUSTRY_MAPPINGS)
    ? INDUSTRY_MAPPINGS[industryKey as keyof typeof INDUSTRY_MAPPINGS]
    : [];
  
  const sizeKeywords = (size in SIZE_IMPACT_MAPPINGS)
    ? SIZE_IMPACT_MAPPINGS[size as keyof typeof SIZE_IMPACT_MAPPINGS]
    : [];
  
  const allKeywords = [...industryKeywords, ...sizeKeywords];
  const billSections = HR1_BILL_CONTENT.split('\n\n');
  
  billSections.forEach(section => {
    const sectionLower = section.toLowerCase();
    const shouldInclude = allKeywords.some(keyword => 
      sectionLower.includes(keyword.toLowerCase())
    );
    
    if (shouldInclude) {
      relevantSections.push(section);
    }
  });
  
  const taxSection = billSections.find(section => 
    section.includes('Tax & Finance') || section.includes('Title VII')
  );
  if (taxSection && !relevantSections.includes(taxSection)) {
    relevantSections.unshift(taxSection);
  }

  if (relevantSections.length === 0) {
    return HR1_BILL_CONTENT;
  }
  
  return relevantSections.join('\n\n');
}

function analyzeBusinessImpact(businessOverview: any): string {
  if (!businessOverview) return '';
  const { industry, size, companyName, description } = businessOverview;
  
  let analysis = `\n## RAG-Enhanced Business Impact Analysis for ${companyName}\n\n`;
  switch (industry.toLowerCase()) {
    case 'technology':
      analysis += `**Technology Sector Impact:**
- R&D Bonus Depreciation (Sec 704(b)): Immediate expensing restored - significant tax savings for R&D investments
- Advanced Manufacturing Credit (Sec 704(c)): $1B/year for semiconductors and battery components (FY26-35)
- Data Modernization Fund: $100M for federal data platform - potential government contracting opportunities
- FAA Spectrum Auction: ~$5B proceeds from 5GHz Safety Band\n\n`;
      break;
      
    case 'healthcare':
      analysis += `**Healthcare Sector Impact:**
- Health Workforce provisions (Sec 804): J-1 Visa Waivers accelerated for HPSA service
- Community Health Centers: $300M HRSA staffing grants (FY26-30)
- Workforce Development: $2B funding with non-compete ban requirements\n\n`;
      break;
      
    case 'manufacturing':
      analysis += `**Manufacturing Sector Impact:**
- Advanced Manufacturing Credit: $1B/year for semiconductors and battery components
- Full Expensing: $2.5M cap indexed, permanent - major capital expenditure benefits
- Clean-Energy Credit Phase-Out: 5% annual reduction, 0% by Jan 1, 2030\n\n`;
      break;
      
    case 'finance':
      analysis += `**Financial Services Impact:**
- CFPB Funding Cap: Budget capped at $1.2B (FY26 baseline) - potential regulatory relief
- SEC Reserve Enhancement: Up to $250M/year transfer to Investor Protection Fund
- Increased oversight and compliance requirements\n\n`;
      break;
  }
  switch (size) {
    case 'startup':
    case 'small':
      analysis += `**Small Business Specific Benefits:**
- Tips & Overtime Exclusion: Up to $5,000 annually excluded from AGI
- R&D Bonus Depreciation: Immediate expensing for research investments
- Full Expensing: Up to $2.5M cap for equipment and assets
- Qualified Business Income Deduction: 20% deduction maintained\n\n`;
      break;
      
    case 'medium':
    case 'large':
    case 'enterprise':
      analysis += `**Larger Business Considerations:**
- Advanced Manufacturing Credit eligibility for qualifying sectors
- Workforce Development requirements: Non-compete ban compliance needed
- Enhanced regulatory compliance for CFPB and SEC provisions
- Clean-Energy Credit phase-out timeline planning required\n\n`;
      break;
  }
  
  return analysis;
}

export async function POST(req: Request) {
  try {
    const { messages, businessOverview, analysisMode } = await req.json();

    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('OPENAI_API_KEY not found in environment variables');
      return new Response('API key not configured', { status: 500 });
    }

    const retrievedContent = retrieveRelevantSections(businessOverview);
    const businessImpactAnalysis = analyzeBusinessImpact(businessOverview);

    // Enhanced system prompt with RAG-retrieved content
    const systemPrompt = `You are an expert business analyst specializing in legislative impact analysis for H.R. 1 "One Big Beautiful Bill". You have access to the complete bill text and must provide detailed, actionable insights on how this legislation will affect businesses.

${businessOverview ? `
BUSINESS CONTEXT:
- Company: ${businessOverview.companyName}
- Industry: ${businessOverview.industry}
- Size: ${businessOverview.size} (${businessOverview.size === 'startup' ? '1-10' : businessOverview.size === 'small' ? '11-50' : businessOverview.size === 'medium' ? '51-200' : businessOverview.size === 'large' ? '201-1000' : '1000+'} employees)
- Description: ${businessOverview.description}

RETRIEVED RELEVANT BILL SECTIONS FOR THIS BUSINESS:
${retrievedContent}

${businessImpactAnalysis}
` : `
COMPLETE H.R. 1 BILL CONTENT:
${HR1_BILL_CONTENT}
`}

ANALYSIS INSTRUCTIONS:
1. **Prioritize Retrieved Content**: Focus primarily on the sections most relevant to this business
2. **Specific Impact Assessment**: Provide concrete financial and operational impacts
3. **Timeline Analysis**: Highlight key implementation dates and deadlines
4. **Compliance Requirements**: Detail specific actions needed for compliance
5. **Opportunity Identification**: Point out potential benefits and competitive advantages
6. **Cost-Benefit Analysis**: Provide estimated costs and savings where possible
7. **Action Items**: Give specific, prioritized next steps
8. **Risk Assessment**: Identify potential challenges and mitigation strategies

ANALYSIS DEPTH: ${analysisMode === 'detailed' ? 'Provide comprehensive, in-depth analysis with extensive details' : 'Provide focused, concise analysis highlighting key points'}

RESPONSE FORMAT:
- Use specific section references (e.g., "Sec 704(a), §179")
- Include dollar amounts and percentages from the bill
- Provide implementation timelines
- Distinguish between mandatory and optional provisions
- Offer both immediate and long-term impact assessments

Focus on actionable business intelligence rather than legal interpretation. Be specific about how each provision affects this particular business context.`;

    const openaiWithKey = createOpenAI({ apiKey });
    const model = openaiWithKey('gpt-4o-mini');

    const result = await streamText({
      model,
      system: systemPrompt,
      messages,
      temperature: 0.3,
      maxTokens: analysisMode === 'detailed' ? 2000 : 1500,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('RAG Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}