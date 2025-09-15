import { 
  Shield, 
  Lock, 
  Globe, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Calendar,
  Award,
  FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SecurityReportProps {
  analysis: {
    url: string;
    riskScore: number;
    status: "safe" | "warning" | "danger";
    vulnerabilities: Array<{
      type: string;
      status: "secure" | "warning" | "danger" | "safe";
      message: string;
    }>;
    details: {
      domainAge: string;
      sslExpiry: string;
      reputation: string;
      contentAnalysis: string;
    };
  };
}

export const SecurityReport = ({ analysis }: SecurityReportProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "secure":
      case "safe":
        return <CheckCircle className="w-5 h-5 text-safe" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "danger":
        return <XCircle className="w-5 h-5 text-danger" />;
      default:
        return <CheckCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      secure: "status-safe",
      safe: "status-safe",
      warning: "status-warning",
      danger: "status-danger"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-muted"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-slide-in-right">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            Security Analysis Report
          </CardTitle>
          <CardDescription>
            Comprehensive security assessment results for {analysis.url}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="vulnerabilities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-muted/30">
          <TabsTrigger value="vulnerabilities" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Checks
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Domain Details
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="report" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Technical Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vulnerabilities">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                Vulnerability Assessment
              </CardTitle>
              <CardDescription>
                Detailed security vulnerability scan results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.vulnerabilities.map((vuln, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover-lift transition-cyber"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(vuln.status)}
                    <div>
                      <p className="font-medium">{vuln.type}</p>
                      <p className="text-sm text-muted-foreground">{vuln.message}</p>
                    </div>
                  </div>
                  {getStatusBadge(vuln.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                Domain Information
              </CardTitle>
              <CardDescription>
                Detailed domain and infrastructure analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Domain Age</p>
                      <p className="text-sm text-muted-foreground">{analysis.details.domainAge}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                    <Award className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Reputation</p>
                      <p className="text-sm text-muted-foreground">{analysis.details.reputation}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                    <Lock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">SSL Certificate</p>
                      <p className="text-sm text-muted-foreground">{analysis.details.sslExpiry}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                    <Search className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Content Analysis</p>
                      <p className="text-sm text-muted-foreground">{analysis.details.contentAnalysis}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary" />
                Analysis Summary
              </CardTitle>
              <CardDescription>
                Overall security assessment and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-muted/20 rounded-lg">
                  <div className="text-3xl font-bold text-gradient-safe mb-2">
                    {analysis.vulnerabilities.filter(v => v.status === 'secure' || v.status === 'safe').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Security Checks Passed</p>
                </div>
                
                <div className="text-center p-6 bg-muted/20 rounded-lg">
                  <div className="text-3xl font-bold text-gradient-warning mb-2">
                    {analysis.vulnerabilities.filter(v => v.status === 'warning').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Warnings Found</p>
                </div>
                
                <div className="text-center p-6 bg-muted/20 rounded-lg">
                  <div className="text-3xl font-bold text-gradient-danger mb-2">
                    {analysis.vulnerabilities.filter(v => v.status === 'danger').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Critical Issues</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recommendations</h3>
                
                {analysis.status === "safe" && (
                  <div className="p-4 bg-safe/10 border border-safe/20 rounded-lg">
                    <p className="text-safe font-medium mb-2">✓ Website appears to be secure</p>
                    <p className="text-sm text-muted-foreground">
                      This website has passed all security checks. Continue browsing with confidence.
                    </p>
                  </div>
                )}
                
                {analysis.status === "warning" && (
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-warning font-medium mb-2">⚠ Exercise caution</p>
                    <p className="text-sm text-muted-foreground">
                      Some security concerns were identified. Proceed with caution and avoid entering sensitive information.
                    </p>
                  </div>
                )}
                
                {analysis.status === "danger" && (
                  <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg">
                    <p className="text-danger font-medium mb-2">⛔ High risk website</p>
                    <p className="text-sm text-muted-foreground">
                      Significant security threats detected. We strongly recommend avoiding this website.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="report">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                Technical Methodology Report
              </CardTitle>
              <CardDescription>
                How this assessment was performed and the data sources used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Abstract</h3>
                <p className="text-sm text-muted-foreground">
                  This client-side analyzer estimates website risk by combining Certificate Transparency data,
                  protocol checks, URL heuristics, and domain reputation signals. Results are computed in real time in
                  your browser without sending the URL to a server.
                </p>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Technologies</h4>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>React 18 with TypeScript (Vite)</li>
                    <li>Tailwind CSS design system with shadcn/ui components</li>
                    <li>Lucide icons and small utility helpers</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Datasets & Sources</h4>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    <li>Certificate Transparency via crt.sh (output=json) for SSL expiry and issuer</li>
                    <li>Heuristic URL analysis (structure, hyphens, numbers, IPs)</li>
                    <li>Reputation scoring based on domain age and TLD characteristics</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Identification Workflow</h4>
                <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-1">
                  <li>Normalize URL and verify HTTPS scheme.</li>
                  <li>Query CT logs for the exact hostname; if no match, query base domain and match wildcard SANs.</li>
                  <li>Filter CT entries to SANs that exactly or wildcard-match the hostname; ignore lookalike names.</li>
                  <li>Compute SSL validity from the certificate not_after date; fallback to HTTPS-present if CT is inconclusive.</li>
                  <li>Evaluate URL structure and apply reputation heuristics to derive a total risk score.</li>
                </ol>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Limitations</h4>
                <p className="text-sm text-muted-foreground">
                  Browser-only environments cannot directly read a site’s live certificate chain or WHOIS. CT data may
                  omit private or recently rotated certificates. The analyzer uses conservative fallbacks to avoid false
                  alarms on trusted HTTPS sites.
                </p>
              </div>

              <Separator />

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">URL</p>
                  <p className="text-sm font-medium break-all">{analysis.url}</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                  <p className="text-sm font-medium">{analysis.riskScore}/100</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-1">{(() => {
                    const status = analysis.status;
                    const variants: any = { safe: "status-safe", warning: "status-warning", danger: "status-danger" };
                    return <Badge className={variants[status] || "bg-muted"}>{status.toUpperCase()}</Badge>;
                  })()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};