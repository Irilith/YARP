import React from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';

export type Items = {
  Item: Array<{
    name: string;
    value: number | string;
    image: string;
  }>;
};

type ItemProps = {
  name: string;
  value: number | string;
  image: string;
};

const ItemComponent: React.FC<ItemProps> = ({ name, value, image }) => {
  return (
    <Card className="w-full min-w-[200px] bg-gray-900 border-gray-500">
      <CardContent className="flex items-center justify-between p-2">
        <Avatar>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <span className="text-white font-bold overflow-hidden text-ellipsis whitespace-nowrap flex-1 bg-gray-700 p-2 rounded-lg text-center">
          {value}
        </span>
      </CardContent>
    </Card>
  );
};

type ItemListProps = {
  items: Items;
};

export const ItemList: React.FC<ItemListProps> = ({ items }) => {
  return (
    <ScrollArea className="w-full rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-800">
        {items.Item.map((item, index) => (
          <ItemComponent
            key={index}
            name={item.name}
            value={item.value}
            image={item.image}
          />
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};
