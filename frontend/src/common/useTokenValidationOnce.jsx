import { useEffect } from "react";
import axios from "axios";



// ✅ check Runs on every page reload but not the call to backend.

// 🔁 Compares current token with previous one.

// If token is new or manually changed, reset check status.

// 🔐 If token is present and not yet checked in this tab:

// It sends a request to backend to verify the token (runs only once per tab unless token changes).

// If valid → do nothing.

// If invalid or missing → remove token and role.

// 🧠 Once checked, it won’t recheck until tab is refreshed or token is changed.


// reqwest is only send to backend if the tiken alredy in storage on first mount
// and if it changed maually by sommeone then the session storage toaken and the loacal storage token will not match
// then also it wiil send the requset to the backend other wise only the commparison will happen between the session 
// storag and the laocal storage 



const useTokenValidationOnce = () => {
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const role = localStorage.getItem("role");
        const prevToken = sessionStorage.getItem("prevToken");

        // 🔁 If token is changed or newly added manually, reset tokenChecked
        if (token && token !== prevToken) {
            sessionStorage.setItem("tokenChecked", "false");
        }

        const alreadyChecked = sessionStorage.getItem("tokenChecked");

        // ✅ Avoid repeated checks in this session
        if (alreadyChecked === "true") return;

        // ❌ No token or role — skip validation
        if (!token || !role) {
            sessionStorage.setItem("tokenChecked", "true");
            return;
        }

        const validateToken = async () => {
            try {
                await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/token-check`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("✅ Token is valid.");
            } catch (error) {
                console.warn("❌ Token invalid. Clearing storage.");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("role");
            }

            // 🔐 Store token snapshot & mark validation complete
            sessionStorage.setItem("tokenChecked", "true");
            sessionStorage.setItem("prevToken", token);
        };

        validateToken();
    }, []);
};

export default useTokenValidationOnce;
