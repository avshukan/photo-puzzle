import preset0 from '../assets/presets/preset-0.jpg';
import preset1 from '../assets/presets/preset-1.jpg';
import preset2 from '../assets/presets/preset-2.jpg';
import preset3 from '../assets/presets/preset-3.jpg';
import preset4 from '../assets/presets/preset-4.jpg';
import preset5 from '../assets/presets/preset-5.jpg';

export type PresetImage = {
  id: string;
  label: string;
  imageUrl: string;
};

export const PRESET_IMAGES: PresetImage[] = [
  { id: 'preset-0', label: 'Default', imageUrl: preset0 },
  { id: 'preset-1', label: 'Forest', imageUrl: preset1 },
  { id: 'preset-2', label: 'Lake', imageUrl: preset2 },
  { id: 'preset-3', label: 'Fruits', imageUrl: preset3 },
  { id: 'preset-4', label: 'Coffee', imageUrl: preset4 },
  { id: 'preset-5', label: 'Flowers', imageUrl: preset5 },
];
