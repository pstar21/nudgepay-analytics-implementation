import { PersonalityType } from '@/utils/metricsCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PersonalityCardProps {
  personalityType: PersonalityType;
  emoji: string;
  description: string;
  tips: string[];
}

const PersonalityCard = ({ personalityType, emoji, description, tips }: PersonalityCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="text-4xl">{emoji}</span>
          <div>
            <div className="text-2xl font-bold">{personalityType}</div>
            <Badge variant="secondary" className="mt-2">Your Spending Profile</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">{description}</p>
          
          <div>
            <h4 className="font-semibold mb-2">Tips for Better Financial Health:</h4>
            <ul className="list-disc list-inside space-y-1">
              {tips.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalityCard;
