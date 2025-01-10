// Inject all your environment variables here
/* eslint-disable no-process-env */
import 'dotenv/config'

export default {
  PORT: process.env.PORT || 2000,
  baseDir: process.cwd(),
  NODE_ENV: process.env.NODE_ENV || 'development',
  KafkaClientId: process.env.KAFKA_CLIENT_ID || 'my-app',
  KafkaBrokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
  stripeSecretKey:
    process.env.STRIPE_SECRET_KEY ||
    'sk_test_1234567890abcdefghijklmnopqrstuvwxyz',
  stripeWebhookSecret:
    process.env.STRIPE_WEBHOOK_SECRET ||
    'whsec_1234567890abcdefghijklmnopqrstuvwxyz',
  kafka: {
    url: process?.env?.KAFKA_URL,
    host: process?.env?.KAFKA_HOST,
    port: process?.env?.KAFKA_PORT,
  }
};
