import { useRouter } from "src/routes/hooks";
import { validateToken } from "@services/users"; 
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await validateToken();
                if (res.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    router.push('/signin', { from: router.location.pathname })
                }
            } catch (err) {
                setIsAuthenticated(false);
                router.push('/signin', { from: router.location.pathname })
            }
        };

        checkAuth();
    }, [router]);

    if (isAuthenticated === null) 
        return <div>Loading...</div>;

    return isAuthenticated ? children : "";
};

export default ProtectedRoute;
