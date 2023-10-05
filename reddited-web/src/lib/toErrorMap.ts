import { FieldError } from "@/gql/grapqhql";

const constructSetError = (
  errors: FieldError[]
) => {
  const errorMessages: Record<string, string> = {}; // Create an object to store error messages

  errors.forEach((error) => {
    errorMessages['field']= error.field
    errorMessages['message'] = error.message
  });

  return errorMessages; // Return the error messages object
};

export default constructSetError;
