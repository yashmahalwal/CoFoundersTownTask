import { IconButton } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React, { PropsWithChildren, useState } from "react";
import TextField, { TextFieldProps } from "./TextField";
import useEffectExceptMount from "use-effect-except-mount";
interface PasswordToggleProps extends Omit<TextFieldProps, "type" | "id"> {
  initialVisible?: boolean;
  onTypeChange?: (type: "text" | "password") => void;
  id: string;
}

const PasswordToggle = React.forwardRef<
  HTMLInputElement,
  PropsWithChildren<PasswordToggleProps>
>(({ initialVisible, onTypeChange, ...props }, inputRef) => {
  const [type, setType] = useState<"password" | "text">(() =>
    initialVisible ? "text" : "password"
  );

  useEffectExceptMount(() => {
    onTypeChange && onTypeChange(type);
  }, [type]);

  return (
    <TextField
      ref={inputRef}
      {...props}
      onCopy={(e) => {
        e.preventDefault();
        props.onCopy && props.onCopy(e);
      }}
      onCut={(e) => {
        e.preventDefault();
        props.onCut && props.onCut(e);
      }}
      onPaste={(e) => {
        e.preventDefault();
        props.onPaste && props.onPaste(e);
      }}
      type={type}
      rightAdornment={
        <IconButton
          aria-controls={props.id}
          aria-expanded={type === "text"}
          variant="unstyled"
          aria-label={type === "text" ? "Hide password" : "Show password"}
          onClick={() => setType((t) => (t === "text" ? "password" : "text"))}
          icon={<FontAwesomeIcon icon={type === "text" ? faEyeSlash : faEye} />}
        />
      }
    ></TextField>
  );
});

PasswordToggle.displayName = "PasswordToggle";
export default PasswordToggle;
