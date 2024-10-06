import { MetaFunction } from '@remix-run/node';
import { AccountData } from '~/components/Sections/Account';
import { GameConfig } from '~/components/Sections/Base/Props';

export const meta: MetaFunction = () => {
  return [
    { title: 'Anime Defender' },
    { name: 'description', content: 'Anime Defender Dashboard' },
  ];
};

// This is the game config for the panel.
// Name is the name of the dashboard you wanted
// endpoint is the api of your backend (ex. endpoint: 'anime_defender' will be http://127.0.0.1:8081/data/anime_defender)
// Columns are the columns that will be displayed in the table.
// Enable is whether the column is show or not.
// Key is the key of the column in the database.
// Label is the label of the column.
// Sortable is whether the column is sortable or not.

const gameConfig: GameConfig = {
  name: 'Anime Defender',
  endpoint: 'anime_defender',
  columns: [
    { enable: true, key: 'name', label: 'Username' },
    { enable: true, key: 'gem', label: 'Gem', sortable: true },
    { enable: true, key: 'rr', label: 'Trait Crystal', sortable: true },
    { enable: true, key: 'ticket', label: 'Lucky Ticket', sortable: true },
    { enable: true, key: 'gold', label: 'Gold', sortable: true },
    { enable: false, key: 'dice', label: '', sortable: true },
    { enable: false, key: 'frost_bind', label: '', sortable: true },
  ],
};

// This is items will be displayed above the table it will be used to calculate the total stats.
// key is the key of the column in the database.
// key is also the name of the image will be displayed, remember the extension is alway webp.
// ---- the image will be stored in public/assets/{key}.webp
// name doesnt matter but you can set it for clean look.

const items = [
  { name: 'Gems', key: 'gem' },
  { name: 'Trait Crystal', key: 'rr' },
  { name: 'Frost Bind', key: 'frost_bind' },
  { name: 'Risky Dice', key: 'dice' },
  { name: 'Ticket', key: 'ticket' },
  { name: 'Gold', key: 'gold' },
];

export default function Anime() {
  return <AccountData gameConfig={gameConfig} items={items} />;
}
