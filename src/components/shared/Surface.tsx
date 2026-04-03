import styled from "@emotion/styled";

const surfaceBase = {
  background: "rgba(255, 252, 248, 0.96)",
  border: "1px solid rgba(110, 88, 72, 0.08)",
  boxShadow: "0 18px 40px rgba(68, 41, 28, 0.08)",
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

export const TopCard = styled.section({
  ...surfaceBase,
  borderRadius: 30,
  padding: 20,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,248,243,0.92) 100%)",
});

export const BodyStack = styled.section({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const FooterDock = styled.footer({
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  padding: "14px 16px 24px",
  background:
    "linear-gradient(180deg, rgba(255, 246, 240, 0) 0%, rgba(255, 246, 240, 0.94) 30%)",
});

export const FooterInner = styled.div({
  width: "100%",
  maxWidth: 560,
  margin: "0 auto",
});

export const SectionCard = styled.section({
  ...surfaceBase,
  borderRadius: 28,
  padding: 20,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,249,245,0.92) 100%)",
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
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,247,242,0.92) 100%)",
});

export const ButtonStack = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const DualActions = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  "@media (max-width: 560px)": {
    gridTemplateColumns: "1fr",
  },
});
