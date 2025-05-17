import { Connection, ClientSession } from 'mongoose';

/**
 * Executes the provided asynchronous operation within a MongoDB transaction.
 *
 * Starts a new session and transaction, runs the given operation, and commits the transaction if successful.
 * If an error occurs, the transaction is aborted and the error is rethrown.
 * The session is always ended after the operation completes.
 *
 * @typeParam T - The return type of the operation.
 * @param connection - The MongoDB connection to use for starting the session.
 * @param operation - An asynchronous function that receives the session and performs database operations.
 * @returns A promise that resolves with the result of the operation.
 * @throws Rethrows any error encountered during the operation after aborting the transaction.
 */
export async function withTransaction<T>(
  connection: Connection,
  operation: (session: ClientSession) => Promise<T>,
): Promise<T> {
  const session = await connection.startSession();
  session.startTransaction();

  try {
    const result = await operation(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
