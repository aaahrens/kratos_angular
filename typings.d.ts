export class RequestMethodConfig {
  /**
   * Action should be used as the form action URL `<form action=\"{{ .Action }}\" method=\"post\">`.
   */
  'action': string;
  /**
   * Fields contains multiple fields
   */
  'fields': Array<FormField>;
  'messages'?: Array<Message>;
  /**
   * Method is the form method (e.g. POST)
   */
  'method': string;
  /**
   * Providers is set for the \"oidc\" request method.
   */
  'providers'?: Array<FormField>;
}

export class Message {
  'context'?: object;
  'id'?: number;
  'text'?: string;
  'type'?: string;
}

export class FormField {
  /**
   * Disabled is the equivalent of `<input {{if .Disabled}}disabled{{end}}\">`
   */
  'disabled'?: boolean;
  'messages'?: Array<Message>;
  /**
   * Name is the equivalent of `<input name=\"{{.Name}}\">`
   */
  'name': string;
  /**
   * Pattern is the equivalent of `<input pattern=\"{{.Pattern}}\">`
   */
  'pattern'?: string;
  /**
   * Required is the equivalent of `<input required=\"{{.Required}}\">`
   */
  'required'?: boolean;
  /**
   * Type is the equivalent of `<input type=\"{{.Type}}\">`
   */
  'type': string;
  /**
   * Value is the equivalent of `<input value=\"{{.Value}}\">`
   */
  'value'?: object;
}

