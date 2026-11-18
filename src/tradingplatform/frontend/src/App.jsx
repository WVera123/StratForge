
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useLocation
} from "react-router-dom";

import "./css/App.css";
import "./css/stylesheet.css";
import "./css/home.css";

import HomePage from "./HomePage";
import StrategyPage from "./StrategyPage";
import SettingsPage from "./SettingsPage";
import WikiPage from "./WikiPage";

const BASE_URL = "http://localhost:8001";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currencies, setCurrencies] = useState([]);
  const [principles, setPrinciples] = useState([]);
  const [settings, setSettings] = useState({});
  const [error, setError] = useState("");

  const [builderMode, setBuilderMode] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  const [strategies, setStrategies] = useState([]);
  const [strategiesLoading, setStrategiesLoading] = useState(true);
  const [strategiesError, setStrategiesError] = useState("");

  useEffect(() => {
    fetchCurrencies();
    fetchPrinciples();
    fetchSettings();
  }, []);

  // Refresh saved strategies whenever the homepage is opened.
  useEffect(() => {
    if (location.pathname === "/") {
      fetchStrategies();
    }
  }, [location.pathname]);


  async function fetchStrategies() {
    setStrategiesLoading(true);
    setStrategiesError("");

    try {
      const response = await fetch(`${BASE_URL}/strategies/get`);

      if (!response.ok) {
        throw new Error("Could not load saved strategies.");
      }

      const data = await response.json();

      const strategyList = Array.isArray(data)
        ? data
        : data?.items || data?.strategies || [];

      setStrategies(strategyList);
    } catch (err) {
      console.error("Error loading strategies:", err);

      setStrategiesError(
        err.message || "Could not load saved strategies."
      );

      setStrategies([]);
    } finally {
      setStrategiesLoading(false);
    }
  }

  async function fetchSettings() {
    try {
      const response = await fetch(`${BASE_URL}/settings`);

      if (!response.ok) {
        throw new Error("Could not load settings.");
      }

      const data = await response.json();

      setSettings({
        initialCapital:
          data.initialCapital !== undefined
            ? parseFloat(data.initialCapital)
            : 10000,

        takerFee:
          data.takerFee !== undefined
            ? parseFloat(data.takerFee)
            : 0,

        makerFee:
          data.makerFee !== undefined
            ? parseFloat(data.makerFee)
            : 0,

        slippage:
          data.slippage !== undefined
            ? parseFloat(data.slippage)
            : 0,

        positionSizing: data.positionSizing || "fixed"
      });
    } catch {
      setSettings({
        initialCapital: 10000,
        takerFee: 0,
        makerFee: 0,
        slippage: 0,
        positionSizing: "fixed"
      });
    }
  }

  const handleSaveSettings = async (newSettings) => {
    try {
      const response = await fetch(`${BASE_URL}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newSettings)
      });

      if (!response.ok) {
        throw new Error("Failed to save settings.");
      }

      setSettings(newSettings);
    } catch (saveError) {
      console.error("Failed to save settings", saveError);
    }
  };

  async function fetchCurrencies() {
    try {
      const response = await fetch(`${BASE_URL}/currencies`);

      if (!response.ok) {
        throw new Error("Could not load currencies.");
      }

      setCurrencies(await response.json());
    } catch {
      setError("Could not load cryptocurrencies.");
    }
  }


  async function fetchPrinciples() {
    try {
      const response = await fetch(`${BASE_URL}/principles`);

      if (!response.ok) {
        throw new Error("Could not load principles.");
      }

      setPrinciples(await response.json());
    } catch {
      setError("Could not load strategy principles.");
    }
  }

  function handleCreateStrategy() {
    setBuilderMode("create");
    setResetTrigger((previous) => previous + 1);

    navigate("/workspace/create");
  }

  // Open the workspace with the selected strategy preloaded.
  // Homepage quick action: show the strategy selection screen
  function handleEditStrategy() {
    setBuilderMode("edit");
    navigate("/workspace/edit");
  }

  // Homepage quick action: also show the selection screen
  function handleBacktestStrategy() {
    setBuilderMode("edit");
    navigate("/workspace/edit");
  }

  // Individual strategy card: open that specific strategy
  function handleEditSpecificStrategy(strategyId) {
    setBuilderMode("edit");
    navigate(`/workspace/edit?strategy_id=${encodeURIComponent(strategyId)}`);
  }

  // Individual strategy card: open and backtest that specific strategy
  function handleBacktestSpecificStrategy(strategyId) {
    setBuilderMode("edit");
    navigate(
      `/workspace/edit?strategy_id=${encodeURIComponent(strategyId)}&run_backtest=true`
    );
  }

  function handleOpenWiki() {
    navigate("/wiki");
  }

  function handleCloseWorkspace() {
    setBuilderMode(null);
    navigate("/");
  }

  const routeBuilderMode = location.pathname.endsWith("/edit")
    ? "edit"
    : "create";

  const isWorkspaceRoute = location.pathname.startsWith("/workspace");

  return (
    <div className="app">

      <header className="app-header">

        <div className="header-left">

          <button
            className="logo-button"
            aria-label="StratForge home"
            onClick={() => navigate("/")}
          >
            <span className="logo-mark">F</span>
            <span className="logo-word">STRATFORGE</span>
          </button>

          <nav
            className="main-navigation"
            aria-label="Main navigation"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `main-navigation-item ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/workspace/create"
              className={() =>
                `main-navigation-item ${isWorkspaceRoute ? "active" : ""
                }`
              }
            >
              Strategy workspace
            </NavLink>

            <NavLink
              to="/wiki"
              className={({ isActive }) =>
                `main-navigation-item ${isActive ? "active" : ""}`
              }
            >
              Wiki
            </NavLink>
          </nav>

        </div>

        <div className="header-right">

          <button
            className="user-profile-button"
            aria-label="Profile and settings"
            onClick={() => navigate("/settings")}
          >
            <span className="user-avatar">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>

            </span>
          </button>

        </div>

      </header>

      <main className="app-content">

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <Routes>

          <Route
            path="/"
            element={
              <HomePage
                strategies={strategies}
                strategiesLoading={strategiesLoading}
                strategiesError={strategiesError}
                currencies={currencies}
                onCreateStrategy={handleCreateStrategy}
                onEditStrategy={handleEditSpecificStrategy}
                onEditExisting={handleEditStrategy}
                onBacktestStrategy={handleBacktestStrategy}
                onRunBacktest={handleBacktestSpecificStrategy}
                onOpenWiki={handleOpenWiki}
              />
            }
          />

          <Route
            path="/workspace/create"
            element={
              <StrategyPage
                BASE_URL={BASE_URL}
                builderMode={routeBuilderMode}
                setBuilderMode={setBuilderMode}
                currencies={currencies}
                principles={principles}
                settings={settings}
                resetTrigger={resetTrigger}
                onClose={handleCloseWorkspace}
                onStrategiesChanged={fetchStrategies}
              />
            }
          />

          <Route
            path="/workspace/edit"
            element={
              <StrategyPage
                BASE_URL={BASE_URL}
                builderMode={routeBuilderMode}
                setBuilderMode={setBuilderMode}
                currencies={currencies}
                principles={principles}
                settings={settings}
                resetTrigger={resetTrigger}
                onClose={handleCloseWorkspace}
                onStrategiesChanged={fetchStrategies}
              />
            }
          />

          <Route
            path="/wiki"
            element={<WikiPage />}
          />

          <Route
            path="/settings"
            element={
              <SettingsPage
                settings={settings}
                onSaveSettings={handleSaveSettings}
              />
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </main>
    </div>
  );
}
