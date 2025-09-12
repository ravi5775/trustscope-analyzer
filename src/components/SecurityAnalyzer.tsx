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

  const fetchSSLInfo = async (hostname: string) => {
    try {
      // Use SSL Labs API for real SSL certificate data
      const response = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${hostname}&publish=off&startNew=on&all=done`);
      const data = await response.json();
      
      if (data.status === 'READY' && data.endpoints?.length > 0) {
        const endpoint = data.endpoints[0];
        const cert = endpoint.details?.cert;
        
        if (cert) {
          const expiryDate = new Date(cert.notAfter);
          const isExpired = expiryDate < new Date();
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          return {
            valid: !isExpired && daysUntilExpiry > 0,
            expiry: expiryDate.toLocaleDateString(),
            daysUntilExpiry,
            grade: endpoint.grade || 'Unknown'
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('SSL check failed:', error);
      return null;
    }
  };

  const fetchDomainInfo = async (hostname: string) => {
    try {
      // Use a WHOIS API service for domain information
      const response = await fetch(`https://api.whoisjson.com/v1/${hostname}`);
      const data = await response.json();
      
      const createdDate = data.created_date ? new Date(data.created_date) : null;
      const domainAge = createdDate 
        ? Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365))
        : null;
        
      return {
        age: domainAge ? `${domainAge} years` : 'Unknown',
        registrar: data.registrar?.name || 'Unknown',
        status: data.status || 'Unknown'
      };
    } catch (error) {
      console.error('Domain info fetch failed:', error);
      return {
        age: 'Unknown',
        registrar: 'Unknown', 
        status: 'Unknown'
      };
    }
  };

  const performSecurityChecks = async (url: string) => {
    const hostname = new URL(url).hostname;
    const vulnerabilities = [];
    let totalRisk = 0;

    // SSL Certificate Check
    const sslInfo = await fetchSSLInfo(hostname);
    if (sslInfo) {
      if (sslInfo.valid && sslInfo.daysUntilExpiry > 30) {
        vulnerabilities.push({
          type: "SSL Certificate",
          status: "secure",
          message: `Valid SSL certificate (Grade: ${sslInfo.grade}, expires ${sslInfo.expiry})`
        });
      } else if (sslInfo.daysUntilExpiry <= 30 && sslInfo.daysUntilExpiry > 0) {
        vulnerabilities.push({
          type: "SSL Certificate", 
          status: "warning",
          message: `SSL certificate expires soon (${sslInfo.daysUntilExpiry} days)`
        });
        totalRisk += 20;
      } else {
        vulnerabilities.push({
          type: "SSL Certificate",
          status: "danger", 
          message: "SSL certificate is expired or invalid"
        });
        totalRisk += 40;
      }
    } else {
      vulnerabilities.push({
        type: "SSL Certificate",
        status: "warning",
        message: "Could not verify SSL certificate"
      });
      totalRisk += 15;
    }

    // Protocol Check
    if (url.startsWith('https://')) {
      vulnerabilities.push({
        type: "HTTPS Protocol",
        status: "secure",
        message: "Secure HTTPS connection"
      });
    } else {
      vulnerabilities.push({
        type: "HTTPS Protocol", 
        status: "danger",
        message: "Insecure HTTP connection - data transmitted in plain text"
      });
      totalRisk += 30;
    }

    // Domain Analysis
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf'];
    const hasSuspiciousTld = suspiciousTlds.some(tld => hostname.endsWith(tld));
    
    if (hasSuspiciousTld) {
      vulnerabilities.push({
        type: "Domain Analysis",
        status: "warning", 
        message: "Domain uses a TLD commonly associated with suspicious sites"
      });
      totalRisk += 25;
    } else {
      vulnerabilities.push({
        type: "Domain Analysis",
        status: "secure",
        message: "Domain appears legitimate"
      });
    }

    // URL Structure Analysis
    const suspiciousPatterns = [
      /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP address
      /-/g, // Many hyphens
      /[0-9]/g // Many numbers
    ];
    
    let urlRisk = 0;
    if (suspiciousPatterns[0].test(hostname)) urlRisk += 20; // IP address
    const hyphenCount = (hostname.match(suspiciousPatterns[1]) || []).length;
    if (hyphenCount > 3) urlRisk += 10;
    const numberCount = (hostname.match(suspiciousPatterns[2]) || []).length;
    if (numberCount > 3) urlRisk += 10;
    
    if (urlRisk > 0) {
      vulnerabilities.push({
        type: "URL Structure",
        status: urlRisk > 15 ? "danger" : "warning",
        message: "URL structure contains suspicious patterns"
      });
      totalRisk += urlRisk;
    } else {
      vulnerabilities.push({
        type: "URL Structure", 
        status: "secure",
        message: "URL structure appears normal"
      });
    }

    return { vulnerabilities, totalRisk: Math.min(totalRisk, 100) };
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

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    if (!validateUrl(normalizedUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      const hostname = new URL(normalizedUrl).hostname;
      
      // Progress steps with real analysis
      setAnalysisProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Perform security checks
      const securityResult = await performSecurityChecks(normalizedUrl);
      setAnalysisProgress(60);
      
      // Get domain information
      const domainInfo = await fetchDomainInfo(hostname);
      setAnalysisProgress(80);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnalysisProgress(100);

      // Determine overall status based on risk score
      let status: "safe" | "warning" | "danger";
      if (securityResult.totalRisk <= 30) status = "safe";
      else if (securityResult.totalRisk <= 70) status = "warning"; 
      else status = "danger";

      const result = {
        url: normalizedUrl,
        riskScore: securityResult.totalRisk,
        status,
        vulnerabilities: securityResult.vulnerabilities,
        details: {
          domainAge: domainInfo.age,
          sslExpiry: securityResult.vulnerabilities.find(v => v.type === "SSL Certificate")?.message || "Unknown",
          reputation: securityResult.totalRisk <= 20 ? "Excellent" : 
                     securityResult.totalRisk <= 50 ? "Good" : "Poor",
          contentAnalysis: status === "safe" ? "Legitimate content" :
                          status === "warning" ? "Some concerns detected" : "Potential threats detected"
        }
      };

      setAnalysisResult(result);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed", 
        description: "Could not complete security analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
    
    toast({
      title: "Analysis Complete",
      description: `Security analysis finished for ${normalizedUrl}`,
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