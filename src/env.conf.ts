// Inject all your environment variables here
/* eslint-disable no-process-env */
export default {
  PORT: process.env.PORT || 2000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  KafkaClientId: process.env.KAFKA_CLIENT_ID || 'my-app',
  KafkaBrokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
  stripeSecretKey:
    process.env.STRIPE_SECRET_KEY ||
    'sk_test_1234567890abcdefghijklmnopqrstuvwxyz',
  stripeWebhookSecret:
    process.env.STRIPE_WEBHOOK_SECRET ||
    'whsec_1234567890abcdefghijklmnopqrstuvwxyz',
};
