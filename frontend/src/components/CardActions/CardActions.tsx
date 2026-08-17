import Button from "../Button/Button";

interface CardActionsProps<T extends string | number = string | number> {
  itemId: T;
  onDismiss: (id: T) => void;
  onInterest: (id: T) => void;
}

export const CardActions = <T extends string | number = string | number>({
  itemId,
  onDismiss,
  onInterest,
}: CardActionsProps<T>) => {
  return (
    <div className="mt-auto grid grid-cols-2 gap-2.5 px-6 pb-6">
      <Button
        onClick={() => onDismiss(itemId)}
        variant="primary"
        className="gap-1.5 whitespace-nowrap text-sm"
      >
        <i className="fas fa-times"></i>
        <span>Descartar</span>
      </Button>
      <Button
        onClick={() => onInterest(itemId)}
        variant="accent"
        className="gap-1.5 whitespace-nowrap text-sm"
      >
        <i className="fas fa-heart"></i>
        Tenho Interesse!
      </Button>
    </div>
  );
};

export default CardActions;
