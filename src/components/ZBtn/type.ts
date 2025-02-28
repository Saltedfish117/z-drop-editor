export interface ZBtnProps {
  color?:
    | "primary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "link-primary"
    | "link-success"
    | "link-danger"
    | "link-warning"
    | "link-info"
    | "link-dark"
    | "text-primary"
    | "text-success"
    | "text-danger"
    | "text-warning"
    | "text-info"
    | "text-dark";
  plain?: boolean;
  round?: boolean;
  disabled?: boolean;
  padding?: boolean;
}
