import { colors } from "@toss/tds-colors";
import { Text } from "@toss/tds-mobile";
import { StatCard } from "../../../components/shared/Surface";

interface ResultStatCardProps {
  label: string;
  value: string | number;
  valueColor: string;
}

export function ResultStatCard({
  label,
  value,
  valueColor,
}: ResultStatCardProps) {
  return (
    <StatCard css={{ background: "#fffef9" }}>
      <Text
        as="span"
        typography="t6"
        fontWeight="medium"
        css={{ display: "block", marginBottom: 10, color: colors.grey600 }}
      >
        {label}
      </Text>
      <strong
        css={{
          display: "block",
          fontSize: 30,
          color: valueColor,
        }}
      >
        {value}
      </strong>
    </StatCard>
  );
}
