import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card';

type StatsBoxProps = {
  title: string;
  value: string;
  color: string;
  subText?: string;
};

export const StatsBox: React.FC<StatsBoxProps> = ({
  title,
  value,
  color,
  subText,
}) => {
  return (
    <Card className="w-full bg-gray-800 text-white rounded-lg p-4 flex flex-col items-center justify-center border-gray-500">
      <CardHeader className="flex items-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-4xl font-bold ${color}`}>{value}</p>
        {subText && <CardDescription>{subText}</CardDescription>}
      </CardContent>
    </Card>
  );
};
