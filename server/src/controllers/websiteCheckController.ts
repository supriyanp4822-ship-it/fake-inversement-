import { Request, Response } from 'express';
import { analyzeWebsite } from '../services/websiteAnalysis';
import { validate, websiteCheckSchema } from '../validators/schemas';

export const checkWebsite = async (req: Request, res: Response) => {
  const { url } = validate(websiteCheckSchema, req.body);
  const result = await analyzeWebsite(url);

  res.status(200).json({
    success: true,
    data: result,
  });
};
