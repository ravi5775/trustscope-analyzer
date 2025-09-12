import { Shield, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RiskScoreProps {
  score: number;
  status: "safe" | "warning" | "danger";
  url: string;
}

export const RiskScore = ({ score, status, url }: RiskScoreProps) => {
  const getRiskData = () => {
    switch (status) {
      case "safe":
        return {
          icon: Shield,
          title: "Website is Safe",
          description: "No significant security risks detected",
          color: "safe",
          badgeText: "SECURE",
          gradient: "status-safe"
        };
      case "warning":
        return {
          icon: AlertTriangle,
          title: "Moderate Risk",
          description: "Some security concerns identified",
          color: "warning",
          badgeText: "MODERATE RISK",
          gradient: "status-warning"
        };
      case "danger":
        return {
          icon: XCircle,
          title: "High Risk Detected",
          description: "Significant security threats found",
          color: "danger",
          badgeText: "HIGH RISK",
          gradient: "status-danger"
        };
      default:
        return {
          icon: Shield,
          title: "Analysis Complete",
          description: "Security assessment finished",
          color: "primary",
          badgeText: "ANALYZED",
          gradient: "bg-primary"
        };
    }
  };

  const riskData = getRiskData();
  const Icon = riskData.icon;

  return (
    <Card className="glass-card max-w-4xl mx-auto animate-bounce-in">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-4">
          <div className={`p-4 rounded-full ${riskData.gradient} animate-risk-pulse`}>
            <Icon className="w-12 h-12" />
          </div>
        </div>
        <CardTitle className="text-3xl mb-2">{riskData.title}</CardTitle>
        <p className="text-muted-foreground">{riskData.description}</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="secondary" className={`${riskData.gradient} text-sm px-4 py-1`}>
            {riskData.badgeText}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* URL Display */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Analyzed Website</p>
          <p className="font-mono text-lg break-all bg-muted/30 p-3 rounded-lg">
            {url}
          </p>
        </div>

        {/* Risk Score Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Risk Score</span>
            <span className={`text-3xl font-bold text-gradient-${riskData.color}`}>
              {score}/100
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative">
            <Progress 
              value={score} 
              className={`h-4 transition-cyber`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-foreground">
                {score}% Risk Level
              </span>
            </div>
          </div>
        </div>

        {/* Risk Level Indicators */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className={`p-3 rounded-lg text-center transition-cyber ${
            status === "safe" ? "status-safe" : "bg-muted/20"
          }`}>
            <Shield className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Safe</p>
            <p className="text-xs opacity-75">0-30</p>
          </div>
          
          <div className={`p-3 rounded-lg text-center transition-cyber ${
            status === "warning" ? "status-warning" : "bg-muted/20"
          }`}>
            <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Moderate</p>
            <p className="text-xs opacity-75">31-70</p>
          </div>
          
          <div className={`p-3 rounded-lg text-center transition-cyber ${
            status === "danger" ? "status-danger" : "bg-muted/20"
          }`}>
            <XCircle className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-medium">High Risk</p>
            <p className="text-xs opacity-75">71-100</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};