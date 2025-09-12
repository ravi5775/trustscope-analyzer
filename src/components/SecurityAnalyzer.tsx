import { useState } from "react";
import { Shield, Globe, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { RiskScore } from "./RiskScore";
import { SecurityReport } from "./SecurityReport";

export const SecurityAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const mockAnalysis = {
    url: "",
    riskScore: 0,
    status: "safe" as const,
    vulnerabilities: [
      { type: "SSL Certificate", status: "secure", message: "Valid SSL certificate found" },
      { type: "HTTP Headers", status: "secure", message: "Security headers properly configured" },
      { type: "Phishing Detection", status: "safe", message: "No phishing patterns detected" },
      { type: "Malware Scan", status: "safe", message: "No malicious content found" }
    ],
    details: {
      domainAge: "5 years",
      sslExpiry: "Valid until Dec 2024",
      reputation: "Excellent",
      contentAnalysis: "Legitimate content"
    }
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a website URL",
        variant: "destructive",
      });
      return;
    }

    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis with progress
    const steps = [
      "Checking SSL certificate...",
      "Scanning for vulnerabilities...",
      "Analyzing content for phishing...",
      "Checking reputation databases...",
      "Generating security report..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress((i + 1) * 20);
    }

    // Generate random risk score for demo
    const riskScore = Math.floor(Math.random() * 100);
    let status: "safe" | "warning" | "danger";
    
    if (riskScore <= 30) status = "safe";
    else if (riskScore <= 70) status = "warning";
    else status = "danger";

    const result = {
      ...mockAnalysis,
      url,
      riskScore,
      status
    };

    setAnalysisResult(result);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Security analysis finished for ${url}`,
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid"></div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-primary animate-cyber-glow" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient-primary">AI-Powered</span>{" "}
            <span className="text-foreground">Security Analyzer</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced website security analysis powered by artificial intelligence. 
            Detect vulnerabilities, phishing attempts, and assess overall trustworthiness.
          </p>
        </div>

        {/* URL Input Section */}
        <Card className="glass-card max-w-4xl mx-auto mb-8 hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-primary" />
              Website Analysis
            </CardTitle>
            <CardDescription>
              Enter any website URL to perform comprehensive security analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="glass-input flex-1 text-lg"
                disabled={isAnalyzing}
              />
              <Button 
                onClick={analyzeWebsite}
                disabled={isAnalyzing}
                className="px-8 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-cyber"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Website"
                )}
              </Button>
            </div>

            {/* Progress Bar */}
            {isAnalyzing && (
              <div className="mt-6 space-y-2">
                <Progress value={analysisProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  Scanning... {analysisProgress}% complete
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {analysisResult && !isAnalyzing && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
            <RiskScore 
              score={analysisResult.riskScore}
              status={analysisResult.status}
              url={analysisResult.url}
            />
            <SecurityReport analysis={analysisResult} />
          </div>
        )}

        {/* Features Preview */}
        {!analysisResult && !isAnalyzing && (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16">
            <Card className="glass-card hover-lift">
              <CardHeader>
                <CheckCircle className="w-8 h-8 text-safe mb-2" />
                <CardTitle>Vulnerability Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced scanning for SQL injection, XSS, CSRF, and other security vulnerabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardHeader>
                <AlertTriangle className="w-8 h-8 text-warning mb-2" />
                <CardTitle>Phishing Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI-powered analysis to identify phishing attempts and suspicious domains.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift">
              <CardHeader>
                <XCircle className="w-8 h-8 text-danger mb-2" />
                <CardTitle>Reputation Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cross-reference with global threat databases and reputation systems.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};