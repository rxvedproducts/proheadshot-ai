
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { User, GeneratedImage } from '../types';
import { Plus, Image as ImageIcon, Clock, LogOut, Download, Loader2, Coins, X, Trash2, AlertCircle, RefreshCcw } from 'lucide-react';
import { fetchUserHistory, deleteHeadshot } from '../services/supabaseService';

interface DashboardProps {
  user: User;
  onStartNew: () => void;
  onLogout: () => void;
  onBuyCredits: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onStartNew, onLogout, onBuyCredits }) => {
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [imageToDelete, setImageToDelete] = useState<GeneratedImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadHistory = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
        setIsRefreshing(true);
    } else {
        setIsLoading(true);
    }

    setError(null);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
        if (isMounted.current) {
            console.warn("History fetch timeout reached.");
            setIsLoading(false);
            setIsRefreshing(false);
            if (!history || history.length === 0) {
               setError("Syncing with our gallery is taking longer than expected. Please try a manual refresh.");
            }
        }
    }, 15000);

    try {
      const data = await fetchUserHistory(user.id);
      if (isMounted.current) {
          setHistory(data as GeneratedImage[]);
          setError(null);
      }
    } catch (err: any) {
      console.error("Failed to load history:", err);
      if (isMounted.current) {
          setError(err.message || "Unable to sync your headshots. Please check your connection.");
      }
    } finally {
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
      }
      if (isMounted.current) {
          setIsLoading(false);
          setIsRefreshing(false);
      }
    }
  }, [user.id]);

  useEffect(() => {
    isMounted.current = true;
    loadHistory();

    return () => {
        isMounted.current = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loadHistory]);

  const handleDeleteClick = (img: GeneratedImage) => {
    setImageToDelete(img);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;

    setIsDeleting(true);
    try {
        await deleteHeadshot(
            user.id,
            imageToDelete.id,
            imageToDelete.generated_image_path,
            imageToDelete.original_image_path
        );

        if (isMounted.current) {
            setHistory(prev => prev.filter(item => item.id !== imageToDelete.id));
            setImageToDelete(null);
        }
    } catch (err: any) {
        console.error("Delete failed:", err);
        if (isMounted.current) {
            setError(err.message || "Failed to remove that image.");
            setImageToDelete(null);
        }
    } finally {
        if (isMounted.current) {
            setIsDeleting(false);
        }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 py-12 px-4 animate-in fade-in duration-500 relative">

      {/* Error Toast */}
      {error && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[60] bg-white text-stone-900 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-in slide-in-from-top-4 fade-in duration-300 border border-stone-200 max-w-[90vw] md:max-w-md">
            <div className="bg-red-50 p-2 rounded-full border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-stone-600 leading-tight">{error}</p>
            </div>
            <div className="flex items-center gap-2">
                 <button
                    onClick={() => loadHistory(true)}
                    className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-amber-600"
                    title="Retry sync"
                 >
                    <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={() => setError(null)} className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-400">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl">

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
                Hi, {user.name || user.email?.split('@')[0] || 'User'}
                </h1>
                {isRefreshing && <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />}
            </div>
            <p className="text-stone-500">View and manage your generated professional portraits.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
                onClick={() => loadHistory(true)}
                className="p-3 bg-white border border-stone-200 text-stone-500 hover:text-stone-800 hover:border-stone-300 rounded-xl transition-all"
                title="Refresh history"
            >
                <RefreshCcw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
                onClick={user.credits < 1 ? onBuyCredits : onStartNew}
                disabled={isLoading}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md shadow-amber-100 transition-all hover:scale-105 disabled:opacity-50"
            >
                {user.credits < 1 ? (
                <>
                    <Coins className="w-5 h-5" /> Buy Credits
                </>
                ) : (
                <>
                    <Plus className="w-5 h-5" /> Create New ({user.credits} Left)
                </>
                )}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 text-stone-700">
                        <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg"><ImageIcon className="w-5 h-5 text-amber-600" /></div>
                        <span className="font-medium">Collection</span>
                    </div>
                </div>
                <p className="text-3xl font-bold text-stone-900">{isLoading ? '...' : history?.length || 0}</p>
                <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Total Generated</p>
            </div>
             <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 text-stone-700 mb-4">
                    <div className="p-2 bg-stone-50 border border-stone-200 rounded-lg"><Clock className="w-5 h-5 text-stone-600" /></div>
                    <span className="font-medium">Wallet</span>
                </div>
                <p className="text-3xl font-bold text-stone-900">{user.credits || 0}</p>
                <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Credits Remaining</p>
            </div>
             <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm hover:border-red-200 hover:bg-red-50/30 transition-colors cursor-pointer group" onClick={onLogout}>
                <div className="flex items-center gap-3 text-stone-700 mb-4">
                    <div className="p-2 bg-stone-50 border border-stone-200 rounded-lg group-hover:bg-red-50 group-hover:border-red-100 transition-colors"><LogOut className="w-5 h-5 text-stone-500 group-hover:text-red-500 transition-colors" /></div>
                    <span className="font-medium">Session</span>
                </div>
                <p className="text-lg font-bold text-stone-900">Sign Out</p>
                <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider font-semibold">Log out of account</p>
            </div>
        </div>

        {/* Gallery Section */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-stone-900">Gallery</h2>
            <div className="h-px flex-1 bg-stone-200 mx-6 hidden sm:block"></div>
            <span className="text-xs text-stone-400 font-mono">{history?.length || 0} ITEMS</span>
        </div>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
                <p className="text-stone-400 animate-pulse text-sm">Syncing your headshots...</p>
            </div>
        ) : history && history.length > 0 ? (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {history.map((img) => (
                  <div key={img.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">

                      <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(img);
                        }}
                        className="absolute top-3 right-3 z-20 p-2 bg-red-600/90 hover:bg-red-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                        title="Delete photo"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>

                      <img src={img.publicUrl} alt="Generated" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" referrerPolicy="no-referrer" />

                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-4">
                          <div className="flex flex-col gap-2 w-full">
                            <a
                                href={img.publicUrl}
                                download={`headshot-${img.id}.png`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2.5 bg-white text-stone-900 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors"
                            >
                                <Download className="w-4 h-4" /> Save High-Res
                            </a>
                            <div className="text-[10px] text-stone-300 font-medium text-center uppercase tracking-tighter">
                                Generated {new Date(img.created_at).toLocaleDateString()}
                            </div>
                          </div>
                      </div>
                  </div>
              ))}
           </div>
        ) : (
          <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-stone-50 border border-stone-200 rounded-3xl flex items-center justify-center mb-6 text-stone-300 shadow-inner">
               <ImageIcon className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-bold text-stone-900 mb-2">Your Gallery is Empty</h3>
             <p className="text-stone-500 max-w-sm mb-8 leading-relaxed">
               Once you generate your first headshot, it will appear here for you to download and share.
             </p>
             <button
                onClick={user.credits < 1 ? onBuyCredits : onStartNew}
                className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-md shadow-amber-100"
              >
                {user.credits < 1 ? "Top up Credits" : "Generate your first photo"}
              </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {imageToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-stone-900/80 backdrop-blur-md"
                onClick={() => !isDeleting && setImageToDelete(null)}
            />
            <div className="relative w-full max-w-sm bg-white border border-stone-200 rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                        <Trash2 className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-stone-900 mb-2">Permanently delete?</h3>
                        <p className="text-stone-500 text-sm leading-relaxed">
                            This will remove the high-res file from our servers forever.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={() => setImageToDelete(null)}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition-colors disabled:opacity-50"
                        >
                            Keep it
                        </button>
                        <button
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Delete"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
