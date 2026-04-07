import styled from "@emotion/styled";

const surfaceBase = {
  background: "#ffffff",
  border: "none",
  boxShadow: "none",
};

export const AppShell = styled.div({
  minHeight: "100vh",
  padding: "20px 16px 40px",
  background:
    "radial-gradient(circle at top left, rgba(197, 107, 255, 0.26), transparent 28%), radial-gradient(circle at top right, rgba(255, 122, 116, 0.24), transparent 24%), linear-gradient(180deg, #f2ece7 0%, #f8f4ef 100%)",
});

export const ScreenPanel = styled.main({
  width: "100%",
  maxWidth: 560,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 14,
});

export const BodyStack = styled.section({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const SectionCard = styled.section({
  ...surfaceBase,
  borderRadius: 28,
  padding: 20,
  background: "#ffffff",
});

export const StatsGrid = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
  "@media (max-width: 560px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
});

export const StatCard = styled.article({
  ...surfaceBase,
  borderRadius: 22,
  padding: 18,
  background: "#ffffff",
});
