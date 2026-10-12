import { pool } from "../db.js";

export type CreateApplicationInput = {
  id: string;
  jobUrl: string;
  company?: string;
  jobTitle?: string;
  status: string;
};

export const createApplication = async (
  input: CreateApplicationInput,
) => {
  const result = await pool.query(
    `
      INSERT INTO applications (
        id,
        job_url,
        company,
        job_title,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
    [
      input.id,
      input.jobUrl,
      input.company ?? null,
      input.jobTitle ?? null,
      input.status,
    ],
  );

  return result.rows[0];
};

export const getApplicationById = async (id: string) => {
  const result = await pool.query(
    `
      SELECT *
      FROM applications
      WHERE id = $1;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};

export const updateApplicationStatus = async (
  id: string,
  status: string,
) => {
  const result = await pool.query(
    `
      UPDATE applications
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `,
    [status, id],
  );

  return result.rows[0] ?? null;
};