import React from 'react';
import { View } from '../../types';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface AcessibilidadeProps {
  navigateTo: (view: View) => void;
}

const FONT_SIZES = ['sm', 'base', 'lg', 'xl'];

const FONT_SIZE_LABELS: Record<string, string> = {
  sm: 'Pequena',
  base: 'Normal',
  lg: 'Grande',
  xl: 'Extra Grande',
};

const Acessibilidade: React.FC<AcessibilidadeProps> = ({ navigateTo }) => {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={() => navigateTo('MAIS_DASHBOARD')} variant="ghost" size="icon">
          <Icon name="arrow_back" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-800">Acessibilidade</h2>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-slate-800 mb-3">Tamanho da Fonte</h3>
        <div className="text-center mb-4">
            <p className="text-slate-600">Tamanho atual: <span className="font-bold">{FONT_SIZE_LABELS[fontSize]}</span></p>
        </div>
        <div className="flex items-center justify-center space-x-2">
            <Button onClick={decreaseFontSize} size="icon" aria-label="Diminuir fonte" disabled={FONT_SIZES.indexOf(fontSize) === 0}><Icon name="text_decrease" /></Button>
            <div className="w-full max-w-xs h-1 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-primary)] transition-all duration-300" style={{ width: `${(FONT_SIZES.indexOf(fontSize) / (FONT_SIZES.length - 1)) * 100}%`}}></div>
            </div>
            <Button onClick={increaseFontSize} size="icon" aria-label="Aumentar fonte" disabled={FONT_SIZES.indexOf(fontSize) === FONT_SIZES.length - 1}><Icon name="text_increase" /></Button>
        </div>
        <Button onClick={resetFontSize} variant="secondary" className="w-full mt-6">Restaurar Padrão</Button>
      </Card>
    </div>
  );
};

export default Acessibilidade;