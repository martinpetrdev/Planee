import { DomainException } from '../../../shared/exceptions/domain.exception.ts';

export class McpKeyNotFoundException extends DomainException {
  constructor() {
    super(404, `The requested MCP key was not found.`);
  }
}
