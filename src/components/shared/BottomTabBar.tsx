import { Asset } from "@toss/tds-mobile";
import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  { label: "홈", path: "/home", iconName: "icon-home-mono" },
  { label: "리포트", path: "/reports", iconName: "icon-documents-lines-mono" },
];

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      css={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 18,
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      <div
        css={{
          width: "fit-content",
          minWidth: 152,
          maxWidth: 220,
          margin: "0 auto",
          background: "#2f1c49",
          borderRadius: 999,
          padding: 8,
          border: "4px solid #4e356d",
          boxShadow: "0 8px 0 rgba(23, 12, 41, 0.28)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          pointerEvents: "auto",
        }}
      >
        {TABS.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.path}
              aria-label={tab.label}
              type="button"
              onClick={() => navigate(tab.path)}
              css={{
                border: "none",
                borderRadius: 999,
                background: isActive ? "#bff4d5" : "transparent",
                width: 56,
                height: 44,
                display: "grid",
                placeItems: "center",
                padding: 0,
                justifySelf: "center",
                transition: "background 140ms ease, transform 140ms ease",
                ":active": {
                  transform: "translateY(1px)",
                },
              }}
            >
              <Asset.Icon
                aria-hidden={true}
                color={isActive ? "#2b1b46" : "#f7ebff"}
                frameShape={Asset.frameShape.CleanWFull}
                name={tab.iconName}
                css={{
                  width: 18,
                  height: 18,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
