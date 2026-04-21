import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAlertContext } from "../context/alertContext";
import { useRef } from "react";

function Alert() {
  const { isOpen, type, message, onClose } = useAlertContext();
  const cancelRef = useRef();
  const isSuccess = type === "success";

  const successBg = useColorModeValue('#D1FAE5', '#064E3B');
  const errorBg   = useColorModeValue('#FEE2E2', '#7F1D1D');
  const successColor = useColorModeValue('#065F46', '#A7F3D0');
  const errorColor   = useColorModeValue('#991B1B', '#FECACA');

  const bg    = isSuccess ? successBg    : errorBg;
  const color = isSuccess ? successColor : errorColor;

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent py={4} backgroundColor={bg} color={color} borderRadius="16px">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {isSuccess ? 'All good!' : 'Oops!'}
          </AlertDialogHeader>
          <AlertDialogBody>{message}</AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default Alert;
