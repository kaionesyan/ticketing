import mongoose from 'mongoose';

interface PaymentAttrs {
  orderId: string;
  stripeId?: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId?: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

orderSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({
    orderId: attrs.orderId,
    stripeId: attrs.stripeId,
  });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  orderSchema,
);

export { Payment };
