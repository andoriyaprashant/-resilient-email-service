import express from 'express';
import { EmailService } from './services/EmailService';

const app = express();
app.use(express.json());

const emailService = new EmailService();

app.post("/send", async (req, res) => {
  const result = await emailService.sendEmail(req.body);
  res.json({ result });
});

app.get("/status/:id", (req, res) => {
  const status = emailService.getStatus(req.params.id);
  res.json({ status });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
