import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const USER_KEY = "tone_user_v1";
const PROFILE_KEY = "tone_profile_v1";
const ORDERS_KEY = "tone_orders_v1";
const ADDRESSES_KEY = "tone_addresses_v1";
const ACCOUNTS_KEY = "tone_accounts_v1";
const SUPPORT_KEY = "tone_support_v1";
const WALLET_KEY = "tone_wallet_v1";
const FIRST_LOGIN_KEY = "tone_first_login_v1";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getStoredAccounts() {
  return loadJSON(ACCOUNTS_KEY, []);
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadJSON(USER_KEY, null));
  const [profile, setProfile] = useState(() => loadJSON(PROFILE_KEY, null));
  const [orders, setOrders] = useState(() => loadJSON(ORDERS_KEY, []));
  const [addresses, setAddresses] = useState(() => loadJSON(ADDRESSES_KEY, []));
  const [walletBalance, setWalletBalance] = useState(() => {
    if (!user) return 0;
    return loadJSON(WALLET_KEY, {})[user?.id] || 0;
  });
  const [showFirstLoginBonus, setShowFirstLoginBonus] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  useEffect(() => {
    if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    else localStorage.removeItem(PROFILE_KEY);
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    if (user) {
      const wallets = loadJSON(WALLET_KEY, {});
      wallets[user.id] = walletBalance;
      localStorage.setItem(WALLET_KEY, JSON.stringify(wallets));
    }
  }, [walletBalance, user]);

  function signup(name, email, password) {
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName) throw new Error("Please enter your full name.");
    if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      throw new Error("Please enter a valid email address.");
    }
    if (password.length < 4) throw new Error("Password must be at least 4 characters.");

    const accounts = getStoredAccounts();
    const alreadyExists = accounts.some((account) => account.email.toLowerCase() === normalizedEmail);
    if (alreadyExists) throw new Error("An account with this email already exists.");

    const newAccount = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}`,
      name: trimmedName,
      email: normalizedEmail,
      password,
    };

    saveAccounts([newAccount, ...accounts]);

    // Initialize wallet with 1000 bonus on first signup
    const wallets = loadJSON(WALLET_KEY, {});
    wallets[newAccount.id] = 1000;
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallets));

    // Mark as first login
    const firstLoginTracker = loadJSON(FIRST_LOGIN_KEY, {});
    firstLoginTracker[newAccount.id] = true;
    localStorage.setItem(FIRST_LOGIN_KEY, JSON.stringify(firstLoginTracker));

    const sessionUser = { id: newAccount.id, name: trimmedName, email: normalizedEmail };
    setUser(sessionUser);
    setWalletBalance(1000);
    setShowFirstLoginBonus(true);
    return sessionUser;
  }

  function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      throw new Error("Please enter a valid email address.");
    }
    if (password.length < 4) throw new Error("Password must be at least 4 characters.");

    const accounts = getStoredAccounts();
    const account = accounts.find((item) => item.email.toLowerCase() === normalizedEmail);

    if (!account) throw new Error("No account found for this email. Please sign up first.");
    if (account.password !== password) throw new Error("Incorrect password. Please try again.");

    // Check if first login
    const firstLoginTracker = loadJSON(FIRST_LOGIN_KEY, {});
    const isFirstLogin = firstLoginTracker[account.id] === true;

    if (isFirstLogin) {
      // Give 1000 bonus on first login
      const wallets = loadJSON(WALLET_KEY, {});
      if (!wallets[account.id]) {
        wallets[account.id] = 1000;
      } else {
        wallets[account.id] += 1000;
      }
      localStorage.setItem(WALLET_KEY, JSON.stringify(wallets));
      delete firstLoginTracker[account.id];
      localStorage.setItem(FIRST_LOGIN_KEY, JSON.stringify(firstLoginTracker));
      setWalletBalance(wallets[account.id]);
      setShowFirstLoginBonus(true);
    } else {
      // Load existing wallet balance
      const wallets = loadJSON(WALLET_KEY, {});
      setWalletBalance(wallets[account.id] || 0);
    }

    const sessionUser = { id: account.id, name: account.name, email: account.email };
    setUser(sessionUser);
    return sessionUser;
  }

  function logout() {
    setUser(null);
    setOrders([]);
    localStorage.removeItem(USER_KEY);
  }

  function saveProfile(result) {
    setProfile(result);
  }

  function addOrder(order) {
    setOrders((prev) => [order, ...prev]);
  }

  function addSupportRequest(request) {
    const stored = loadJSON(SUPPORT_KEY, []);
    const next = [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...request,
        createdAt: new Date().toISOString(),
      },
      ...stored,
    ];
    localStorage.setItem(SUPPORT_KEY, JSON.stringify(next));
    return next[0];
  }

  function getSupportRequests() {
    return loadJSON(SUPPORT_KEY, []);
  }

  function updateOrder(orderId, updatedOrder) {
    setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updatedOrder : o)));
  }

  function getOrders() {
    return orders;
  }

  function cancelOrder(orderId) {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              status: "Cancelled",
              timeline: [...(o.timeline || []), { step: "Cancelled", date: new Date().toISOString(), completed: true }],
            }
          : o
      )
    );
  }

  function getOrderById(orderId) {
    return orders.find((o) => o.orderId === orderId);
  }

  function addAddress(address) {
    const newAddress = {
      id: Date.now().toString(),
      ...address,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, newAddress]);
    return newAddress;
  }

  function getAddresses() {
    return addresses;
  }

  function updateAddress(id, updatedAddress) {
    setAddresses((prev) => prev.map((addr) => (addr.id === id ? { ...addr, ...updatedAddress } : addr)));
  }

  function deleteAddress(id) {
    setAddresses((prev) => {
      const filtered = prev.filter((addr) => addr.id !== id);
      if (filtered.length > 0 && !filtered.some((addr) => addr.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  }

  function setDefaultAddress(id) {
    setAddresses((prev) => prev.map((addr) => ({ ...addr, isDefault: addr.id === id })));
  }

  function getDefaultAddress() {
    return addresses.find((addr) => addr.isDefault) || addresses[0] || null;
  }

  function getWalletBalance() {
    return walletBalance;
  }

  function addToWallet(amount) {
    setWalletBalance((prev) => prev + amount);
  }

  function deductFromWallet(amount) {
    if (walletBalance < amount) {
      throw new Error("Insufficient wallet balance");
    }
    setWalletBalance((prev) => prev - amount);
  }

  function getShowFirstLoginBonus() {
    return showFirstLoginBonus;
  }

  function clearFirstLoginBonus() {
    setShowFirstLoginBonus(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        profile,
        saveProfile,
        addOrder,
        getOrders,
        orders,
        updateOrder,
        cancelOrder,
        getOrderById,
        addAddress,
        getAddresses,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
        addSupportRequest,
        getSupportRequests,
        walletBalance,
        getWalletBalance,
        addToWallet,
        deductFromWallet,
        showFirstLoginBonus: showFirstLoginBonus,
        getShowFirstLoginBonus,
        clearFirstLoginBonus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
