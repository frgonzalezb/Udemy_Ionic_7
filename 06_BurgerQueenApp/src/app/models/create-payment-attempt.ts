class CreatePaymentAttempt {
  secretKey!: string;
  amount?: number;
  currency!: string;
  customer_id?: string;
}

export default CreatePaymentAttempt;
