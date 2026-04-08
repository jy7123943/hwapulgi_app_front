import styled from "@emotion/styled";

const surfaceBase = {
  background: "#fffef9",
  border: "4px solid #4e356d",
  boxShadow: "0 8px 0 rgba(52, 33, 83, 0.24)",
};

export const AppShell = styled.div({
  minHeight: "100vh",
  padding: "18px 16px 40px",
  background: "#3b245f",
});

export const ScreenPanel = styled.main({
  width: "100%",
  maxWidth: 500,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 18,
});

export const BodyStack = styled.section({
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

export const SectionCard = styled.section({
  ...surfaceBase,
  borderRadius: 30,
  padding: 20,
  background: "#fffef9",
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
  borderRadius: 24,
  padding: 16,
  background: "#fffef9",
});
