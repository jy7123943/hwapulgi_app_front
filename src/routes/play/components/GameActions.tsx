import { Button } from '@toss/tds-mobile';
import { ButtonStack, DualActions } from '../../../components/shared/Surface';

interface GameActionsProps {
  onPrimaryHit: () => void;
  onSkillShot: () => void;
  onFinish: () => void;
}

export function GameActions({ onPrimaryHit, onSkillShot, onFinish }: GameActionsProps) {
  return (
    <ButtonStack>
      <Button color="primary" display="full" size="xlarge" onClick={onPrimaryHit}>
        정면 한 방
      </Button>
      <DualActions>
        <Button color="dark" display="full" variant="weak" onClick={onSkillShot}>
          특수 스킬
        </Button>
        <Button color="light" display="full" onClick={onFinish} variant="weak">
          여기까지
        </Button>
      </DualActions>
    </ButtonStack>
  );
}
