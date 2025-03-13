export interface ZBtnProps {
  color?:
    | "default"
    | "primary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "link-default"
    | "link-primary"
    | "link-success"
    | "link-danger"
    | "link-warning"
    | "link-info"
    | "text-default"
    | "text-primary"
    | "text-success"
    | "text-danger"
    | "text-warning"
    | "text-info";
  plain?: boolean;
  round?: boolean;
  disabled?: boolean;
  padding?: boolean;
}
