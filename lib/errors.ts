export class CourseError extends Error {
  field: string;
  constructor(field: string, message: string) {
    super(message);
    this.name = 'CourseError';
    this.field = field;
  }
}
