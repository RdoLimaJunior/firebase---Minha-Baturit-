import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useStorage } from '../../hooks/useStorage';
import { useToast } from '../ui/Toast';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userProfile }) => {
  const { logout, updateUserProfile } = useAuth();
  const { uploadFile, isLoading: isUploading } = useStorage();
  const { addToast } = useToast();
  
  const [displayName, setDisplayName] = useState(userProfile.displayName || '');
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(userProfile.photoURL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isGuest = userProfile.uid === 'guest-user';

  // Sincroniza o estado do formulário com as props caso o modal seja reaberto para outro usuário (improvável, mas bom ter)
  useEffect(() => {
    if (isOpen) {
        setDisplayName(userProfile.displayName || '');
        setPhotoPreview(userProfile.photoURL);
        setNewPhotoFile(null);
    }
  }, [isOpen, userProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (isGuest) return;
    setIsSubmitting(true);
    
    let photoURL = userProfile.photoURL;

    try {
        if (newPhotoFile) {
            photoURL = await uploadFile(newPhotoFile, 'profile-pictures');
        }

        await updateUserProfile({
            displayName: displayName.trim(),
            photoURL: photoURL,
        });
        
        addToast('Perfil atualizado com sucesso!', 'success');
        onClose();

    } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        addToast('Não foi possível atualizar o perfil.', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const hasChanges = newPhotoFile !== null || displayName.trim() !== (userProfile.displayName || '');
  const isLoading = isSubmitting || isUploading;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Meu Perfil">
      <div className="p-6 space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img 
              src={photoPreview || `https://api.dicebear.com/8.x/initials/svg?seed=${displayName || 'User'}`} 
              alt="Avatar" 
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-200"
            />
            {!isGuest && (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors shadow-md"
                    aria-label="Alterar foto do perfil"
                >
                    <Icon name="photo_camera" className="text-lg" />
                </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
              disabled={isGuest}
            />
          </div>
        </div>
        
        {isGuest ? (
            <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800">{userProfile.displayName}</h3>
                <p className="text-slate-500">Você está navegando como visitante.</p>
                <Button onClick={() => logout()} className="mt-4" variant="primary">Fazer Login</Button>
            </div>
        ) : (
            <>
                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-1">Nome de Exibição</label>
                    <input 
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full p-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"
                        placeholder="Seu nome"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input 
                        id="email"
                        type="email"
                        value={userProfile.email || ''}
                        disabled
                        className="w-full p-2 bg-slate-100 text-slate-500 border border-slate-300 rounded-md cursor-not-allowed"
                    />
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleSave} disabled={!hasChanges || isLoading} className="w-full sm:flex-1">
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                    <Button onClick={() => logout()} variant="secondary" className="w-full sm:flex-1">
                        Sair
                    </Button>
                </div>
            </>
        )}
      </div>
    </Modal>
  );
};

export default ProfileModal;