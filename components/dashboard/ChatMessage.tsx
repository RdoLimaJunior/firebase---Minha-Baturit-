import React from 'react';
import { ChatMessage, View, ChatAction } from '../../types';
import Icon from '../ui/Icon';
import Button from '../ui/Button';

interface ChatMessageProps {
    message: ChatMessage;
    isLastMessage: boolean;
    isLoading: boolean;
    onActionClick: (view: View, params?: any) => void;
    onFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
    onCopy: (text: string) => void;
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({
    message,
    isLastMessage,
    isLoading,
    onActionClick,
    onFeedback,
    onCopy,
}) => {
    const isUser = message.role === 'user';

    const handleAction = (action: ChatAction) => {
        switch (action.type) {
            case 'NAVIGATE':
                onActionClick(action.payload.view!, action.payload.params);
                break;
            case 'OPEN_URL':
                if (action.payload.url) {
                    window.open(action.payload.url, '_blank');
                }
                break;
            case 'CALL':
                if (action.payload.phoneNumber) {
                    window.location.href = `tel:${action.payload.phoneNumber}`;
                }
                break;
        }
    };

    if (isUser) {
        return (
            <div className="flex items-start gap-4 flex-row-reverse animate-fade-slide-in">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <Icon name="person" className="text-slate-500 !text-xl" />
                </div>
                <div className="pt-1.5 w-full flex flex-col items-end">
                    <p className="font-semibold text-slate-800">Você</p>
                    <div className="mt-2 inline-block px-4 py-3 rounded-2xl bg-[var(--color-primary)] text-white rounded-br-lg">
                        <p>{message.content}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Model's message
    return (
        <div className="flex items-start gap-4 animate-fade-slide-in">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                <Icon name="flutter_dash" className="text-[var(--color-primary)] !text-xl" />
            </div>
            <div className="pt-1.5 w-full">
                <p className="font-semibold text-slate-800">Assistente Uirapuru</p>
                <div className="mt-2 inline-block px-4 py-3 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-lg space-y-3">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.structuredContent && (
                        <div className="pt-3 border-t border-slate-200/60 text-sm space-y-1">
                            {message.structuredContent.address && <p><Icon name="location_on" className="text-base mr-2" />{message.structuredContent.address}</p>}
                            {message.structuredContent.phone && <p><Icon name="phone" className="text-base mr-2" />{message.structuredContent.phone}</p>}
                            {message.structuredContent.openingHours && <p><Icon name="schedule" className="text-base mr-2" />{message.structuredContent.openingHours}</p>}
                            {message.structuredContent.documents && (
                                <div>
                                    <p className="font-semibold mb-1">Documentos:</p>
                                    <ul className="list-disc list-inside">
                                        {message.structuredContent.documents.map((doc, i) => <li key={i}>{doc}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {isLastMessage && !isLoading && (
                    <div className="mt-3 space-y-2">
                        {message.actions && message.actions.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {message.actions.map((action, index) => (
                                    <Button key={index} onClick={() => handleAction(action)} size="sm">
                                        {action.buttonText}
                                    </Button>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Button size="icon" variant="ghost" className="!p-1.5" onClick={() => onCopy(message.content)} aria-label="Copiar resposta">
                                <Icon name="content_copy" className="text-base text-slate-400" />
                            </Button>
                            <Button size="icon" variant="ghost" className={`!p-1.5 ${message.feedback === 'like' ? '!text-[var(--color-accent-green)]' : 'text-slate-400'}`} onClick={() => onFeedback(message.id, 'like')} aria-label="Gostei">
                                <Icon name="thumb_up" className="text-base" />
                            </Button>
                             <Button size="icon" variant="ghost" className={`!p-1.5 ${message.feedback === 'dislike' ? '!text-[var(--color-accent-red)]' : 'text-slate-400'}`} onClick={() => onFeedback(message.id, 'dislike')} aria-label="Não gostei">
                                <Icon name="thumb_down" className="text-base" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
