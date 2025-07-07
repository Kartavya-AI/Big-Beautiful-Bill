'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Send, Plus, FileText, Building, Bot, Menu, X, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

interface BusinessOverview {
  companyName: string;
  industry: string;
  size: string;
  description: string;
}

// Industry-specific prompts for better RAG retrieval
const INDUSTRY_PROMPTS: Record<string, string[]> = {
  technology: [
    "How will the R&D tax credits affect my tech company's innovation budget?",
    "What's the impact of the Advanced Manufacturing Credit on semiconductor companies?",
    "How does the Data Modernization Fund create opportunities for tech contractors?",
    "What are the compliance requirements for the spectrum auction provisions?"
  ],
  healthcare: [
    "How will the J-1 visa waiver changes affect healthcare staffing?",
    "What funding opportunities are available through Community Health Center grants?",
    "How does the workforce development funding impact healthcare training programs?",
    "What are the timeline requirements for health workforce provisions?"
  ],
  manufacturing: [
    "How much can I save with the Advanced Manufacturing Credit?",
    "What's the impact of the clean energy credit phase-out on my operations?",
    "How does the full expensing provision affect capital equipment purchases?",
    "What are the compliance costs for the new manufacturing standards?"
  ],
  finance: [
    "How will the CFPB funding cap affect regulatory oversight?",
    "What's the impact of the SEC Reserve Enhancement on compliance costs?",
    "How do the new financial reporting requirements affect my business?",
    "What opportunities exist with the DPA reallocation provisions?"
  ],
  agriculture: [
    "How will the SNAP program changes affect agricultural demand?",
    "What's the impact of the commodity program price increases?",
    "How does the base acre expansion affect farming operations?",
    "What are the timeline requirements for agricultural compliance?"
  ],
  energy: [
    "How will the clean energy credit phase-out affect my renewable projects?",
    "What's the impact of the coal royalty rate increase?",
    "How do the offshore leasing mandates create opportunities?",
    "What funding is available for hydropower modernization?"
  ]
};

export default function EnhancedChatbotPage() {
  const [businessOverview, setBusinessOverview] = useState<BusinessOverview | null>(null);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'quick' | 'detailed'>('quick');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, reload } = useChat({
    api: '/api/chat',
    body: {
      businessOverview,
      analysisMode,
    },
    onFinish: () => {
      scrollToBottom();
    },
  });

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const startNewAnalysis = () => {
    window.location.reload();
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleBusinessSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const overview: BusinessOverview = {
      companyName: formData.get('companyName') as string,
      industry: formData.get('industry') as string,
      size: formData.get('size') as string,
      description: formData.get('description') as string,
    };
    setBusinessOverview(overview);
    setShowBusinessForm(false);
    
    // Auto-generate initial analysis
    setTimeout(() => {
      const initialPrompt = `Provide a comprehensive impact analysis of H.R. 1 "One Big Beautiful Bill" for ${overview.companyName}. Focus on the most relevant sections for a ${overview.size} ${overview.industry} company. Include financial impacts, compliance requirements, and implementation timelines.`;
      handleInputChange({ target: { value: initialPrompt } } as React.ChangeEvent<HTMLInputElement>);
    }, 500);
  };

  const getIndustryPrompts = () => {
    if (!businessOverview) return [];
    return INDUSTRY_PROMPTS[businessOverview.industry.toLowerCase()] || [
      "How will this bill affect my company's compliance costs?",
      "What are the key regulatory changes I need to prepare for?",
      "Analyze the competitive advantages this bill might create",
      "What's the timeline for implementation I should plan around?"
    ];
  };

  const getBusinessImpactSummary = () => {
    if (!businessOverview) return null;
    
    const { industry, size } = businessOverview;
    let impact = { opportunities: 0, risks: 0, compliance: 0 };
    
    // Simple impact calculation based on industry and size
    switch (industry.toLowerCase()) {
      case 'technology':
        impact = { opportunities: 4, risks: 2, compliance: 3 };
        break;
      case 'healthcare':
        impact = { opportunities: 3, risks: 2, compliance: 4 };
        break;
      case 'manufacturing':
        impact = { opportunities: 5, risks: 3, compliance: 4 };
        break;
      case 'finance':
        impact = { opportunities: 2, risks: 4, compliance: 5 };
        break;
      default:
        impact = { opportunities: 3, risks: 3, compliance: 3 };
    }
    
    return impact;
  };

  const handlePromptClick = (prompt: string) => {
    handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>);
  };

  // Show business setup form if no business overview
  if (!businessOverview && !showBusinessForm) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 transition-theme">
        <Card className="w-full max-w-2xl bg-card border border-border">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-semibold mb-2">H.R. 1 Bill Impact AI</h1>
              <p className="text-muted-foreground">
                Get personalized analysis of H.R. 1's impact on your company
              </p>
            </div>
            
            <form onSubmit={handleBusinessSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    name="companyName"
                    type="text"
                    required
                    className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Acme Corp"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <select
                    name="industry"
                    required
                    className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="finance">Finance</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="energy">Energy</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Company Size</label>
                <select
                  name="size"
                  required
                  className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select size</option>
                  <option value="small">Small (1-50 employees)</option>
                  <option value="medium">Medium (51-250 employees)</option>
                  <option value="large">Large (251-1000 employees)</option>
                  <option value="enterprise">Enterprise (1000+ employees)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Business Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Brief description of your business operations, key revenue streams, and current challenges..."
                />
              </div>
              
              <Button type="submit" className="w-full">
                Start Impact Analysis
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground transition-theme">
      {/* Enhanced Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'} bg-card border-r border-border flex flex-col overflow-hidden transition-theme`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-6 h-6 text-primary" />
            <div>
              <span className="font-semibold">H.R. 1 Impact AI</span>
              <p className="text-xs text-muted-foreground">RAG-Enhanced Analysis</p>
            </div>
          </div>
          <Button 
            onClick={startNewAnalysis}
            variant="outline" 
            className="w-full justify-start gap-2"
          >
            <Plus className="w-4 h-4" />
            New Analysis
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {businessOverview && (
              <>
                <Card className="p-3 bg-muted border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Business Profile</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{businessOverview.companyName}</p>
                    <p className="text-xs text-muted-foreground">{businessOverview.industry}</p>
                    <Badge variant="outline" className="text-xs">
                      {businessOverview.size} company
                    </Badge>
                  </div>
                </Card>

                {/* Impact Summary */}
                {(() => {
                  const impact = getBusinessImpactSummary();
                  return impact ? (
                    <Card className="p-3 bg-muted border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Impact Preview</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-600">Opportunities</span>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < impact.opportunities ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-red-600">Risks</span>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < impact.risks ? 'bg-red-500' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-orange-600">Compliance</span>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < impact.compliance ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : null;
                })()}

                {/* Analysis Mode Toggle */}
                <Card className="p-3 bg-muted border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Analysis Mode</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={analysisMode === 'quick' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAnalysisMode('quick')}
                      className="flex-1 text-xs"
                    >
                      Quick
                    </Button>
                    <Button
                      variant={analysisMode === 'detailed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAnalysisMode('detailed')}
                      className="flex-1 text-xs"
                    >
                      Detailed
                    </Button>
                  </div>
                </Card>

                {/* Industry-Specific Prompts */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Suggested Questions</span>
                  </div>
                  <div className="space-y-1">
                    {getIndustryPrompts().map((prompt, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePromptClick(prompt)}
                        className="w-full justify-start text-xs p-2 h-auto text-left whitespace-normal"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <h1 className="font-semibold">H.R. 1 Impact Analysis</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-xs"
            >
              {isDark ? '☀️' : '🌙'}
            </Button>
            {businessOverview && (
              <Badge variant="outline" className="text-xs">
                {businessOverview.companyName}
              </Badge>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.length === 0 && businessOverview && (
              <Card className="p-6 bg-muted border border-border">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Ready to analyze H.R. 1's impact on {businessOverview.companyName}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ask specific questions about regulations, tax implications, compliance requirements, or use the suggested prompts in the sidebar.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromptClick("What are the key financial impacts of this bill on my company?")}
                      className="justify-start text-xs"
                    >
                      Financial Impact Analysis
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePromptClick("What compliance requirements will my company need to meet?")}
                      className="justify-start text-xs"
                    >
                      Compliance Requirements
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]" />
                    </div>
                    <span className="text-sm text-muted-foreground">Analyzing bill impact...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder={businessOverview ? `Ask about H.R. 1's impact on ${businessOverview.companyName}...` : "Ask about H.R. 1..."}
              className="flex-1 p-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}