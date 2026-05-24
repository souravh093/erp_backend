// Commented out since Student model does not exist in the current prisma schema.
/*
import {
  Student,
  StudentAddress,
  StudentEducation,
  StudentFavoriteTeacher,
  StudentGuardian,
  StudentPayment,
  StudentPaymentPaidHistory,
  StudentReferredBy,
} from '../../../generated/prisma/client';

export type MargeStudent = Student & {
  studentAddress: StudentAddress | null;
  studentPayments: StudentPayment & {
    studentPaymentPaidHistory: StudentPaymentPaidHistory[];
  } | null;
  studentFavoriteTeacher: StudentFavoriteTeacher[] | null;
  studentReferredBy: StudentReferredBy | null;
  studentEducations: StudentEducation[] | null;
  studentGuardian: StudentGuardian | null;
};
*/
