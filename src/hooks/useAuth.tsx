import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";
import {
    auth,
    googleProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged,
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    db,
    doc,
    setDoc,
    getDoc
} from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogle: () => Promise<boolean>;
    loginWithEmail: (email: string, pass: string) => Promise<boolean>;
    registerWithEmail: (email: string, pass: string, name: string) => Promise<boolean>;
    logout: () => Promise<void>;
    getToken: () => Promise<string | null>;
    updateUserProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const cached = localStorage.getItem("biocactus_session");
        return cached ? JSON.parse(cached) : null;
    });
    const [loading, setLoading] = useState(!localStorage.getItem("biocactus_session"));

    const syncUserToFirestore = async (firebaseUser: User, displayName?: string): Promise<boolean> => {
        if (!db) return false;
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        const isNew = !userSnap.exists();

        const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: displayName || firebaseUser.displayName || "Explorer",
            photoURL: firebaseUser.photoURL || "",
            lastLogin: new Date().toISOString()
        };

        if (isNew) {
            await setDoc(userRef, {
                ...userData,
                xp: 0,
                level: 1,
                completedLessons: [],
                completedQuizzes: [],
                createdAt: new Date().toISOString(),
            });
        } else {
            await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
        }

        // Update local cache with more info if needed
        localStorage.setItem("biocactus_session", JSON.stringify(firebaseUser));
        return isNew;
    };

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        // Handle Redirect Result
        const handleRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    await syncUserToFirestore(result.user);
                    toast.success("Synchronized via secure redirect");
                }
            } catch (error: any) {
                console.error("Redirect error:", error);
                if (error.code !== "auth/popup-closed-by-user") {
                    toast.error("Redirect sync failed");
                }
            }
        };
        handleRedirect();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                localStorage.setItem("biocactus_session", JSON.stringify(firebaseUser));
                await syncUserToFirestore(firebaseUser);
            } else {
                setUser(null);
                localStorage.removeItem("biocactus_session");
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const loginWithGoogle = async (): Promise<boolean> => {
        if (!auth) {
            console.error("Auth not initialized");
            return false;
        }
        try {
            // Priority 1: Try Popup
            const result = await signInWithPopup(auth, googleProvider);
            return await syncUserToFirestore(result.user);
        } catch (error: any) {
            console.error("Google login attempt error:", error.code);

            // Fallback: If popup is blocked, use Redirect
            if (error.code === "auth/popup-blocked" || error.code === "auth/cancelled-popup-request") {
                toast.info("Browser restricted the popup. Redirecting to secure login...");
                await signInWithRedirect(auth, googleProvider);
                // Redirecting... the actual login will happen on reload
                return false;
            }

            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
        if (!auth) return false;
        try {
            const result = await signInWithEmailAndPassword(auth, email, pass);
            return await syncUserToFirestore(result.user);
        } catch (error) {
            console.error("Login with Email failed:", error);
            throw error;
        }
    };

    const registerWithEmail = async (email: string, pass: string, name: string): Promise<boolean> => {
        if (!auth) return false;
        try {
            const result = await createUserWithEmailAndPassword(auth, email, pass);
            return await syncUserToFirestore(result.user, name);
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
            localStorage.removeItem("biocactus_session");
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const getToken = async () => {
        if (!auth || !auth.currentUser) return null;
        return await auth.currentUser.getIdToken();
    };

    const updateUserProfile = async (data: any) => {
        if (!auth.currentUser || !db) return;

        // Update Firebase Auth Profile
        if (data.displayName || data.photoURL) {
            const { updateProfile } = await import("firebase/auth");
            await updateProfile(auth.currentUser, {
                displayName: data.displayName || auth.currentUser.displayName,
                photoURL: data.photoURL || auth.currentUser.photoURL
            });
        }

        const userRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userRef, data, { merge: true });

        // Refresh local user state
        setUser({ ...auth.currentUser });
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            loginWithGoogle,
            loginWithEmail,
            registerWithEmail,
            logout,
            getToken,
            updateUserProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
